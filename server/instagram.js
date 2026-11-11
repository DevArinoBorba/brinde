// Gordinho Brindes — importação de reels pela API oficial do Instagram (Instagram API with Instagram Login).
// O token de longa duração da conta profissional fica só no servidor (tabela secrets ou INSTAGRAM_ACCESS_TOKEN)
// e é renovado automaticamente antes de expirar (validade de 60 dias).
import { getSecret, setSecret, deleteSecret } from './database.js';

const GRAPH = 'https://graph.instagram.com';
const TOKEN_KEY = 'instagram_access_token';
const MAX_VIDEO_BYTES = 80 * 1024 * 1024;
const REFRESH_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

export class InstagramError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function graph(path, token, params = {}) {
  const url = new URL(path.startsWith('http') ? path : `${GRAPH}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  if (token) url.searchParams.set('access_token', token);
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) {
    const message = data.error?.message || `Instagram respondeu ${res.status}`;
    const expired = data.error?.code === 190;
    // 422 (e não 401): 401 é reservado para sessão do painel expirada, que desloga o admin
    throw new InstagramError(expired ? 422 : 502, expired
      ? 'Token do Instagram inválido, expirado ou revogado. Gere um novo token e conecte a conta novamente.'
      : `Erro na API do Instagram: ${message}`);
  }
  return data;
}

async function currentToken(db) {
  const stored = await getSecret(db, TOKEN_KEY);
  if (stored) return stored;
  // Primeira execução: aceita o token vindo do Coolify
  if (process.env.INSTAGRAM_ACCESS_TOKEN) {
    await setSecret(db, TOKEN_KEY, process.env.INSTAGRAM_ACCESS_TOKEN);
    return getSecret(db, TOKEN_KEY);
  }
  return null;
}

async function requireToken(db) {
  const token = await currentToken(db);
  if (!token) {
    throw new InstagramError(409, 'Conecte a conta do Instagram em Configurações > Reels para importar pelo link.');
  }
  return token.value;
}

export async function status(db) {
  const token = await currentToken(db);
  if (!token) return { connected: false };
  try {
    const me = await graph('/me', token.value, { fields: 'username' });
    return { connected: true, username: me.username };
  } catch (err) {
    return { connected: false, error: err.message };
  }
}

/** Valida e guarda o token informado no painel. */
export async function connect(db, token) {
  const clean = String(token || '').trim();
  if (clean.length < 20) throw new InstagramError(400, 'Token inválido.');
  const me = await graph('/me', clean, { fields: 'username,account_type' });
  await setSecret(db, TOKEN_KEY, clean);
  return { connected: true, username: me.username };
}

export async function disconnect(db) {
  await deleteSecret(db, TOKEN_KEY);
  return { connected: false };
}

/** Renova o token de longa duração (só é aceito após 24h de emissão). */
export async function refreshTokenIfNeeded(db) {
  const token = await currentToken(db);
  if (!token || Date.now() - new Date(token.updated_at).getTime() < REFRESH_AFTER_MS) return;
  try {
    const data = await graph('/refresh_access_token', token.value, { grant_type: 'ig_refresh_token' });
    if (data.access_token) {
      await setSecret(db, TOKEN_KEY, data.access_token);
      console.log('[instagram] token renovado');
    }
  } catch (err) {
    console.warn('[instagram] falha ao renovar token:', err.message);
  }
}

// Aceita links /reel/, /reels/, /p/ e /tv/ (com ou sem usuário e parâmetros)
export function shortcodeFromUrl(url) {
  const match = String(url || '').match(/instagram\.com\/(?:[A-Za-z0-9._]+\/)?(?:reels?|p|tv)\/([A-Za-z0-9_-]{5,})/);
  return match ? match[1] : null;
}

// Procura a publicação entre as mídias da conta conectada (até ~500 publicações)
async function findMedia(token, shortcode) {
  let page = await graph('/me/media', token, {
    fields: 'id,permalink,media_type,media_product_type,media_url,thumbnail_url,caption',
    limit: '50',
  });
  for (let i = 0; i < 10 && page; i++) {
    const found = (page.data || []).find((m) => (m.permalink || '').includes(`/${shortcode}/`));
    if (found) return found;
    page = page.paging?.next ? await graph(page.paging.next) : null;
  }
  return null;
}

async function download(url, { maxBytes, expectType }) {
  const res = await fetch(url, { signal: AbortSignal.timeout(120000) });
  if (!res.ok) throw new InstagramError(502, `Não foi possível baixar a mídia (${res.status}).`);
  const mime = (res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
  if (!mime.startsWith(expectType)) throw new InstagramError(502, 'O Instagram devolveu um arquivo inesperado.');
  const length = Number(res.headers.get('content-length') || 0);
  if (length > maxBytes) throw new InstagramError(413, 'O vídeo passa de 80 MB.');
  const data = Buffer.from(await res.arrayBuffer());
  if (data.length > maxBytes) throw new InstagramError(413, 'O vídeo passa de 80 MB.');
  return { mime: mime === 'image/jpg' ? 'image/jpeg' : mime, data };
}

/**
 * Importa um reel pelo link: localiza na conta conectada, baixa vídeo e capa pela API oficial
 * e devolve os arquivos para gravar em /media.
 */
export async function importReel(db, url) {
  const shortcode = shortcodeFromUrl(url);
  if (!shortcode) throw new InstagramError(400, 'Link inválido. Use o link do reel (instagram.com/reel/...).');

  const token = await requireToken(db);
  const media = await findMedia(token, shortcode);
  if (!media) {
    throw new InstagramError(404, 'Publicação não encontrada na conta conectada. O link precisa ser de um reel desta conta.');
  }
  if (media.media_type !== 'VIDEO' || !media.media_url) {
    throw new InstagramError(400, 'Essa publicação não é um vídeo (reel).');
  }

  const video = await download(media.media_url, { maxBytes: MAX_VIDEO_BYTES, expectType: 'video/' });
  const poster = media.thumbnail_url
    ? await download(media.thumbnail_url, { maxBytes: 5 * 1024 * 1024, expectType: 'image/' }).catch(() => null)
    : null;

  const title = String(media.caption || '').split('\n')[0].replace(/#\S+/g, '').trim().slice(0, 80);
  return { video, poster, title, permalink: media.permalink };
}
