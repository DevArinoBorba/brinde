// Gordinho Brindes — servidor HTTP: API do painel/loja + arquivos estáticos do build Vite
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import * as store from './database.js';
import { ensureAdminCredential, login, changePin, requireAdmin } from './auth.js';
import * as instagram from './instagram.js';
import { unitPriceForQty } from '../src/pricing.js';

const PORT = Number(process.env.PORT) || 3000;
// LISTEN_HOST (e não HOST): o Coolify injeta HOST=0.0.0.0, e o health check dele usa localhost -> ::1 no Alpine
const HOST = process.env.LISTEN_HOST || '::';
const DIST_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');

const db = await store.openDatabase();
await ensureAdminCredential(db);
console.log(`[db] conectado: ${db.kind}`);

// Vídeos/capas de reels enviados e nunca salvos nas configurações
const reelMediaIds = (settings) => (settings.reels || []).flatMap((r) => [r.videoId, r.posterId]).filter(Boolean);
const removedMedia = await store.deleteUnusedMedia(db, reelMediaIds(await store.getSettings(db)));
if (removedMedia) console.log(`[media] ${removedMedia} arquivo(s) sem uso removido(s)`);

const app = express();
app.set('trust proxy', 1); // atrás do proxy do Coolify (Traefik)
app.disable('x-powered-by');

app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// ------------------------------------------------------------------
// Utilitários
// ------------------------------------------------------------------
const asyncRoute = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Limite simples por IP (memória do processo)
function rateLimit({ windowMs, max, message }) {
  const hits = new Map();
  return (req, res, next) => {
    const now = Date.now();
    const entry = hits.get(req.ip);
    if (!entry || entry.reset < now) {
      hits.set(req.ip, { count: 1, reset: now + windowMs });
    } else if (++entry.count > max) {
      return res.status(429).json({ error: message });
    }
    if (hits.size > 10000) {
      for (const [ip, e] of hits) if (e.reset < now) hits.delete(ip);
    }
    next();
  };
}

const text = (value, max) => String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
const isPlainObject = (v) => v && typeof v === 'object' && !Array.isArray(v);
const ID_RE = /^[A-Za-z0-9_-]{1,80}$/;
const ORDER_STATUSES = ['Pendente', 'Aprovado', 'Em Produção', 'Enviado', 'Concluído', 'Cancelado'];
const round2 = (n) => Math.round(n * 100) / 100;

function newOrderId() {
  return `PED-${Date.now().toString(36).toUpperCase().slice(-5)}${Math.floor(100 + Math.random() * 900)}`;
}

/**
 * Monta o pedido a partir do que veio do navegador. Na loja (público) os preços são
 * recalculados com as faixas do produto; no painel o admin pode informar o valor.
 */
async function buildOrder(input, { admin }) {
  if (!isPlainObject(input)) throw new HttpError(400, 'Pedido inválido.');
  const c = isPlainObject(input.customer) ? input.customer : {};
  const customer = {
    name: text(c.name, 120),
    company: text(c.company, 160),
    phone: text(c.phone, 40),
    email: text(c.email, 160),
  };
  if (!customer.name) throw new HttpError(400, 'Informe o nome do cliente.');

  const rawItems = Array.isArray(input.items) ? input.items.slice(0, 50) : [];
  if (!rawItems.length) throw new HttpError(400, 'O pedido precisa de pelo menos um item.');

  const ids = rawItems.map((it) => text(it?.productId, 80)).filter((id) => ID_RE.test(id));
  const products = await store.getProductsByIds(db, ids);

  const items = rawItems.map((raw) => {
    const productId = text(raw?.productId, 80);
    const product = products.get(productId);
    const quantity = Math.min(1_000_000, Math.max(1, parseInt(raw?.quantity, 10) || 1));
    if (!product && !admin) throw new HttpError(400, 'Produto não encontrado no catálogo.');

    const unitPrice = admin && Number.isFinite(Number(raw?.unitPrice))
      ? Math.max(0, Number(raw.unitPrice))
      : unitPriceForQty(product, quantity);
    return {
      productId: product ? product.id : 'manual',
      name: product ? product.name : text(raw?.name, 160) || 'Item Personalizado',
      sku: product ? product.sku || '' : '',
      quantity,
      color: text(raw?.color, 60),
      unitPrice: round2(unitPrice),
      total: round2(quantity * unitPrice),
    };
  });

  const subtotal = round2(items.reduce((sum, it) => sum + it.total, 0));
  const settings = await store.getSettings(db);
  let discountPercent = 0;
  const couponCode = text(input.couponCode, 40).toUpperCase();
  if (couponCode) {
    const coupon = (settings.coupons || []).find((cp) => cp.active && cp.code.toUpperCase() === couponCode);
    discountPercent = coupon ? Number(coupon.discountPercent) || 0 : 0;
  }
  const total = round2(subtotal * (1 - discountPercent / 100));

  const now = new Date();
  return {
    id: newOrderId(),
    date: now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    status: admin && ORDER_STATUSES.includes(input.status) ? input.status : 'Pendente',
    customer,
    items,
    subtotal,
    discountPercent,
    couponCode: discountPercent ? couponCode : '',
    total,
    paymentMethod: text(input.paymentMethod, 120),
    notes: text(input.notes, 1000),
    source: admin ? 'painel' : 'loja',
    createdAt: now.toISOString(),
  };
}

// ------------------------------------------------------------------
// API pública (loja)
// ------------------------------------------------------------------
const api = express.Router();
api.use(express.json({ limit: '1mb' }));

api.get('/health', asyncRoute(async (req, res) => {
  await db.query('SELECT 1');
  res.json({ ok: true });
}));

// Tudo o que a loja precisa para montar a vitrine em uma única chamada
api.get('/store', asyncRoute(async (req, res) => {
  const [settings, products, categories] = await Promise.all([
    store.getSettings(db), store.listProducts(db), store.listCategories(db),
  ]);
  res.set('Cache-Control', 'no-store');
  res.json({ settings, products, categories });
}));

api.post('/orders',
  rateLimit({ windowMs: 10 * 60 * 1000, max: 15, message: 'Muitos pedidos em pouco tempo. Tente novamente em alguns minutos.' }),
  asyncRoute(async (req, res) => {
    const order = await store.insertOrder(db, await buildOrder(req.body, { admin: false }));
    res.status(201).json(publicOrder(order));
  }));

// Rastreio: só devolve dados não sensíveis
const publicOrder = (o) => ({
  id: o.id,
  status: o.status,
  date: o.date,
  total: o.total,
  itemCount: (o.items || []).length,
  customerFirstName: (o.customer?.name || '').split(/\s+/)[0] || '',
});

api.get('/orders/track',
  rateLimit({ windowMs: 60 * 1000, max: 20, message: 'Muitas consultas. Aguarde um minuto.' }),
  asyncRoute(async (req, res) => {
    const orders = await store.findOrdersForTracking(db, text(req.query.q, 60));
    res.json(orders.map(publicOrder));
  }));

api.post('/auth/login',
  rateLimit({ windowMs: 10 * 60 * 1000, max: 10, message: 'Muitas tentativas. Aguarde 10 minutos.' }),
  asyncRoute(async (req, res) => {
    const session = await login(db, text(req.body?.pin, 64));
    if (!session) return res.status(401).json({ error: 'PIN incorreto. Tente novamente.' });
    res.json(session);
  }));

// ------------------------------------------------------------------
// API do painel (exige login)
// ------------------------------------------------------------------
const admin = express.Router();
admin.use(requireAdmin(db));

admin.get('/orders', asyncRoute(async (req, res) => res.json(await store.listOrders(db))));

admin.post('/orders', asyncRoute(async (req, res) => {
  res.status(201).json(await store.insertOrder(db, await buildOrder(req.body, { admin: true })));
}));

admin.put('/orders/:id', asyncRoute(async (req, res) => {
  const patch = isPlainObject(req.body) ? req.body : {};
  if (patch.status !== undefined && !ORDER_STATUSES.includes(patch.status)) throw new HttpError(400, 'Status inválido.');
  const allowed = {};
  if (patch.status !== undefined) allowed.status = patch.status;
  if (patch.notes !== undefined) allowed.notes = text(patch.notes, 1000);
  const order = await store.updateOrder(db, req.params.id, allowed);
  if (!order) throw new HttpError(404, 'Pedido não encontrado.');
  res.json(order);
}));

admin.delete('/orders/:id', asyncRoute(async (req, res) => {
  if (!(await store.deleteOrder(db, req.params.id))) throw new HttpError(404, 'Pedido não encontrado.');
  res.status(204).end();
}));

admin.put('/products/:id', asyncRoute(async (req, res) => {
  const product = req.body;
  if (!isPlainObject(product) || !ID_RE.test(req.params.id) || product.id !== req.params.id) {
    throw new HttpError(400, 'Produto inválido.');
  }
  if (!text(product.name, 200)) throw new HttpError(400, 'Informe o nome do produto.');
  res.json(await store.upsertProduct(db, product));
}));

admin.delete('/products/:id', asyncRoute(async (req, res) => {
  if (!(await store.deleteProduct(db, req.params.id))) throw new HttpError(404, 'Produto não encontrado.');
  res.status(204).end();
}));

admin.put('/categories/:id', asyncRoute(async (req, res) => {
  const body = isPlainObject(req.body) ? req.body : {};
  const name = text(body.name, 120);
  if (!ID_RE.test(req.params.id) || !name) throw new HttpError(400, 'Categoria inválida.');
  const category = { id: req.params.id, name, slug: text(body.slug, 120), icon: text(body.icon, 40) || 'tag' };
  res.json(await store.upsertCategory(db, category));
}));

admin.delete('/categories/:id', asyncRoute(async (req, res) => {
  if (!(await store.deleteCategory(db, req.params.id))) throw new HttpError(404, 'Categoria não encontrada.');
  res.status(204).end();
}));

admin.put('/settings', asyncRoute(async (req, res) => {
  if (!isPlainObject(req.body)) throw new HttpError(400, 'Configurações inválidas.');
  const { adminPin, ...patch } = req.body; // o PIN tem rota própria e nunca fica nas configurações públicas
  if (patch.reels !== undefined) patch.reels = sanitizeReels(patch.reels);

  const before = await store.getSettings(db);
  const saved = await store.saveSettings(db, patch);
  if (patch.reels !== undefined) {
    // Apaga do banco os vídeos/capas que saíram da lista
    const keep = reelMediaIds(saved);
    const dropped = reelMediaIds(before).filter((id) => !keep.includes(id));
    await store.deleteUnusedMedia(db, keep, { alsoDelete: dropped });
  }
  res.json(saved);
}));

const MEDIA_ID_RE = /^med_[A-Za-z0-9_-]{16,40}$/;
function sanitizeReels(value) {
  if (!Array.isArray(value)) throw new HttpError(400, 'Lista de reels inválida.');
  return value.slice(0, 30).map((r) => {
    if (!isPlainObject(r) || !MEDIA_ID_RE.test(r.videoId || '')) throw new HttpError(400, 'Reel sem vídeo válido.');
    return {
      id: ID_RE.test(r.id || '') ? r.id : crypto.randomUUID(),
      videoId: r.videoId,
      posterId: MEDIA_ID_RE.test(r.posterId || '') ? r.posterId : '',
      title: text(r.title, 120),
    };
  });
}

// Upload de vídeo (MP4/WebM) ou capa (JPEG/PNG/WebP) dos reels. Corpo = arquivo bruto.
const MEDIA_TYPES = {
  'video/mp4': 80 * 1024 * 1024,
  'video/webm': 80 * 1024 * 1024,
  'image/jpeg': 5 * 1024 * 1024,
  'image/png': 5 * 1024 * 1024,
  'image/webp': 5 * 1024 * 1024,
};
admin.post('/media',
  express.raw({ type: Object.keys(MEDIA_TYPES), limit: '80mb' }),
  asyncRoute(async (req, res) => {
    const mime = (req.get('content-type') || '').split(';')[0].trim().toLowerCase();
    const maxSize = MEDIA_TYPES[mime];
    if (!maxSize) throw new HttpError(415, 'Formato não suportado. Envie o vídeo em MP4 (ou WebM).');
    if (!Buffer.isBuffer(req.body) || req.body.length === 0) throw new HttpError(400, 'Arquivo vazio.');
    if (req.body.length > maxSize) throw new HttpError(413, 'Arquivo grande demais.');
    const id = newMediaId();
    await store.insertMedia(db, { id, mime, data: req.body });
    res.status(201).json({ id, url: '/media/' + id, mime, size: req.body.length });
  }));

const newMediaId = () => 'med_' + crypto.randomBytes(16).toString('base64url');

// Instagram (API oficial): conectar a conta e importar reel pelo link
const instagramRoute = (fn) => asyncRoute(async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    if (err instanceof instagram.InstagramError) throw new HttpError(err.status, err.message);
    throw err;
  }
});

admin.get('/instagram', instagramRoute(async (req, res) => res.json(await instagram.status(db))));
admin.put('/instagram', instagramRoute(async (req, res) => res.json(await instagram.connect(db, req.body?.token))));
admin.delete('/instagram', instagramRoute(async (req, res) => res.json(await instagram.disconnect(db))));

admin.post('/instagram/import',
  rateLimit({ windowMs: 60 * 1000, max: 10, message: 'Muitas importações seguidas. Aguarde um minuto.' }),
  instagramRoute(async (req, res) => {
    const reel = await instagram.importReel(db, text(req.body?.url, 300));
    const videoId = newMediaId();
    await store.insertMedia(db, { id: videoId, mime: reel.video.mime, data: reel.video.data });
    let posterId = '';
    if (reel.poster) {
      posterId = newMediaId();
      await store.insertMedia(db, { id: posterId, mime: reel.poster.mime, data: reel.poster.data });
    }
    res.status(201).json({ videoId, posterId, title: reel.title, permalink: reel.permalink });
  }));

admin.put('/pin', asyncRoute(async (req, res) => {
  const pin = text(req.body?.pin, 64);
  if (pin.length < 4) throw new HttpError(400, 'O PIN precisa ter pelo menos 4 caracteres.');
  res.json(await changePin(db, pin));
}));

api.use('/admin', admin);
api.use((req, res) => res.status(404).json({ error: 'Rota não encontrada.' }));
app.use('/api', api);

// ------------------------------------------------------------------
// Mídia dos reels (com suporte a Range: o Safari/iOS exige para tocar vídeo)
// ------------------------------------------------------------------
app.get('/media/:id', asyncRoute(async (req, res) => {
  if (!MEDIA_ID_RE.test(req.params.id)) return res.status(404).end();
  const info = await store.getMediaInfo(db, req.params.id);
  if (!info) return res.status(404).end();

  res.set({
    'Content-Type': info.mime,
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=31536000, immutable', // id muda a cada upload
  });

  let start = 0;
  let end = info.size - 1;
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.get('range') || '');
  if (range) {
    if (range[1] === '') {
      start = Math.max(0, info.size - Number(range[2]));
    } else {
      start = Number(range[1]);
      if (range[2] !== '') end = Math.min(Number(range[2]), info.size - 1);
    }
    if (start > end || start >= info.size) {
      return res.status(416).set('Content-Range', `bytes */${info.size}`).end();
    }
    // Blocos de até 2 MB por resposta para não segurar o vídeo inteiro na memória
    end = Math.min(end, start + 2 * 1024 * 1024 - 1);
    res.status(206).set('Content-Range', `bytes ${start}-${end}/${info.size}`);
  }

  res.set('Content-Length', String(end - start + 1));
  if (req.method === 'HEAD') return res.end();
  res.end(await store.getMediaChunk(db, req.params.id, start, end));
}));

// ------------------------------------------------------------------
// Arquivos estáticos (mesmas regras do vercel.json: /admin -> painel, demais -> loja)
// ------------------------------------------------------------------
const HASHED_ASSET = /^\/assets\/.+-[A-Za-z0-9_-]{8}\.(js|css|woff2)$/;
app.use(express.static(DIST_DIR, {
  index: false,
  setHeaders(res, filePath) {
    const urlPath = '/' + path.relative(DIST_DIR, filePath).split(path.sep).join('/');
    if (HASHED_ASSET.test(urlPath)) res.set('Cache-Control', 'public, max-age=31536000, immutable');
    else if (urlPath.startsWith('/assets/')) res.set('Cache-Control', 'public, max-age=86400');
    else res.set('Cache-Control', 'no-cache');
  },
}));

const sendPage = (file) => (req, res) => res.set('Cache-Control', 'no-cache').sendFile(path.join(DIST_DIR, file));
app.get(['/admin', '/admin.html'], sendPage('admin.html'));
app.use((req, res, next) => (req.method === 'GET' && !path.extname(req.path) ? sendPage('index.html')(req, res) : next()));

// ------------------------------------------------------------------
// Erros
// ------------------------------------------------------------------
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error('[erro]', err);
  res.status(status).json({ error: status >= 500 ? 'Erro interno. Tente novamente.' : err.message });
});

app.listen(PORT, HOST, () => console.log(`[server] Gordinho Brindes em http://${HOST}:${PORT}`));

// Mantém o token do Instagram válido (expira em 60 dias sem renovação)
instagram.refreshTokenIfNeeded(db);
setInterval(() => instagram.refreshTokenIfNeeded(db), 24 * 60 * 60 * 1000).unref();
