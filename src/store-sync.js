// Gordinho Brindes — aplica no storefront tudo o que é gerenciado pelo Painel Admin
// (configurações da loja, produtos dos carrosséis e reels do Instagram).
import { db } from './db.js';

// ------------------------------------------------------------------
// FORMATADORES
// ------------------------------------------------------------------
export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatBRL(value) {
  const n = Number(value) || 0;
  return `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatBRLShort(value) {
  const n = Number(value) || 0;
  return Number.isInteger(n) ? `R$ ${n.toLocaleString('pt-BR')}` : formatBRL(n);
}

// Link de WhatsApp sempre com o número configurado no admin
export function whatsappUrl(message = '') {
  const number = String(db.getSettings().whatsappNumber || '').replace(/\D/g, '');
  return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}

// ------------------------------------------------------------------
// 1. CONFIGURAÇÕES DA LOJA
// ------------------------------------------------------------------
export function applySettings(settings = db.getSettings()) {
  const values = {
    ...settings,
    cashbackExample: formatBRLShort((500 * (Number(settings.cashbackPercent) || 0)) / 100),
  };

  document.querySelectorAll('[data-setting]').forEach((el) => {
    const value = values[el.getAttribute('data-setting')];
    el.textContent = value === undefined || value === null ? '' : String(value);
  });

  document.querySelectorAll('[data-hide-empty]').forEach((el) => {
    const value = values[el.getAttribute('data-hide-empty')];
    el.hidden = value === undefined || value === null || String(value).trim() === '';
  });

  document.title = `Brindes Personalizados para Empresas | ${settings.storeName || 'Gordinho Brindes'}`;

  // Faixa de aviso do topo
  const bar = document.getElementById('top-announcement-bar');
  const barText = document.getElementById('top-announcement-text');
  if (bar && barText) {
    barText.textContent = settings.announcementText || '';
    bar.hidden = settings.announcementVisible === false || !settings.announcementText;
  }

  applySocialLinks(settings);
}

function applySocialLinks(settings) {
  const number = String(settings.whatsappNumber || '').replace(/\D/g, '');
  const socials = [
    ['instagram.com', settings.instagramUrl],
    ['facebook.com', settings.facebookUrl],
    ['youtube.com', settings.youtubeUrl],
    ['tiktok.com', settings.tiktokUrl],
  ];

  document.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href');

    if (/wa\.me\/|api\.whatsapp\.com\/send/.test(href)) {
      // Mantém a mensagem pré-preenchida do link, troca só o número
      let text = '';
      try { text = new URL(href).searchParams.get('text') || ''; } catch {}
      a.setAttribute('href', `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`);
      return;
    }

    if (href.startsWith('mailto:')) {
      a.setAttribute('href', `mailto:${settings.supportEmail || ''}`);
      a.hidden = !settings.supportEmail;
      return;
    }

    if (a.closest('#instagram-reels-track')) return;
    for (const [domain, url] of socials) {
      if (href.includes(domain)) {
        if (url) a.setAttribute('href', url);
        a.hidden = !url;
        return;
      }
    }
  });
}

// ------------------------------------------------------------------
// 2. PRODUTOS DOS CARROSSÉIS (seções "mais-vendidos", "destaques", "lancamentos")
// ------------------------------------------------------------------
let cardTemplate = null;
let swatchTemplate = null;
let colorOverflowTemplate = null;
let tierRowTemplate = null;

// Guarda um card original como molde antes de qualquer alteração no DOM
function captureTemplates() {
  if (cardTemplate) return true;
  const sample = document.querySelector('[data-product-section] > [data-listing-product-id]');
  if (!sample) return false;

  cardTemplate = sample.cloneNode(true);
  swatchTemplate = document.querySelector('[data-listing-product-id] [aria-label="Cores disponíveis"] > button')?.cloneNode(true) || null;
  colorOverflowTemplate = document.querySelector('[data-listing-product-id] [aria-label="Cores disponíveis"] > span')?.cloneNode(true) || null;

  // Linha de faixa de preço com selo de desconto e marcador de faixa de referência
  const refRow = [...document.querySelectorAll('[data-listing-product-id] .divide-y > button')]
    .find((row) => row.querySelector('span.absolute') && row.querySelector('.rounded-full'));
  tierRowTemplate = refRow ? refRow.cloneNode(true) : null;
  return true;
}

/**
 * Sincroniza os carrosséis com o banco.
 * Retorna true quando foi preciso criar cards novos (os binds de eventos da página
 * só alcançam cards existentes na carga, então o chamador decide se recarrega).
 */
export function renderProducts({ allowCreate = true } = {}) {
  if (!captureTemplates()) return false;

  const products = db.getProducts();
  const byId = new Map(products.map((p) => [p.id, p]));
  let needsCreate = false;

  document.querySelectorAll('[data-product-section]').forEach((track) => {
    const section = track.getAttribute('data-product-section');
    const shown = new Set();

    track.querySelectorAll(':scope > [data-listing-product-id]').forEach((slide) => {
      const product = byId.get(slide.getAttribute('data-listing-product-id'));
      if (!product || !(product.sections || []).includes(section)) {
        slide.remove();
        return;
      }
      hydrateCard(slide, product);
      shown.add(product.id);
    });

    // Produtos da seção ainda sem card (ex.: cadastrados no admin) entram no início
    const missing = products.filter((p) => (p.sections || []).includes(section) && !shown.has(p.id));
    if (!missing.length) return;
    needsCreate = true;
    if (!allowCreate) return;
    missing.slice().reverse().forEach((product) => {
      const slide = cardTemplate.cloneNode(true);
      hydrateCard(slide, product);
      track.prepend(slide);
    });
  });

  // Libera a área de preço dos cards (fica oculta até os dados do banco chegarem)
  document.documentElement.classList.add('catalog-ready');
  return needsCreate;
}

function hydrateCard(slide, product) {
  slide.setAttribute('data-listing-product-id', product.id);
  slide.setAttribute('data-db-product-id', product.id);

  const link = slide.querySelector('a');
  if (link && product.slug) link.setAttribute('href', `/produto/${product.slug}`);

  // Fotos (principal + hover)
  const imgs = slide.querySelectorAll('a > div:first-child img');
  if (imgs[0] && product.image) {
    imgs[0].src = product.image;
    imgs[0].removeAttribute('srcset');
    imgs[0].alt = product.name;
  }
  if (imgs[1]) {
    imgs[1].src = product.hoverImage || product.image || '';
    imgs[1].removeAttribute('srcset');
  }

  const info = link?.children[1];
  const skuEl = info?.querySelector(':scope > span');
  if (skuEl) skuEl.textContent = product.sku ? `SKU: ${product.sku}` : '';

  const titleEl = slide.querySelector('h3');
  if (titleEl) titleEl.textContent = product.name;

  const descEl = slide.querySelector('.product-details-content p');
  if (descEl) {
    const desc = product.description || '';
    descEl.textContent = desc.length > 90 ? `${desc.slice(0, 90).trimEnd()}...` : desc;
  }

  renderSwatches(slide.querySelector('[aria-label="Cores disponíveis"]'), product);

  // "Economize até X%"
  const onRequest = db.isPriceOnRequest(product);
  const saveBadge = [...slide.querySelectorAll('span')].find((s) => s.textContent.trim() === 'Economize até');
  if (saveBadge) {
    const wrapper = saveBadge.parentElement;
    const pct = wrapper.lastElementChild;
    if (pct && pct !== saveBadge) pct.textContent = `${product.maxDiscount || 0}%`;
    wrapper.parentElement.hidden = onRequest || !product.maxDiscount;
  }

  // Preço (ou "Sob consulta"), "/un.", texto de referência/Pix e tabela de faixas
  const priceEl = slide.querySelector('.text-xl.md\\:text-3xl');
  if (priceEl) {
    priceEl.textContent = onRequest ? 'Sob consulta' : formatBRL(db.getUnitPriceForQty(product, 100));
    priceEl.classList.toggle('price-on-request', onRequest);
    if (priceEl.nextElementSibling) priceEl.nextElementSibling.hidden = onRequest;
    const priceNotes = priceEl.parentElement?.nextElementSibling;
    if (priceNotes) priceNotes.hidden = onRequest;
  }
  const tiersBlock = slide.querySelector('.divide-y')?.closest('.mt-4');
  if (tiersBlock) tiersBlock.hidden = onRequest;
  if (!onRequest) renderTiers(slide.querySelector('.divide-y'), product);

  // Botão do card: "Ver mais" vira "Consultar no WhatsApp" (abre o modal para escolher qtd/cor e pôr na sacola)
  const ctaEl = [...slide.querySelectorAll('span')].find((s) => s.dataset.ctaLabel || /^(Ver mais|Consultar no WhatsApp)$/.test(s.textContent.trim()));
  if (ctaEl) {
    ctaEl.dataset.ctaLabel = 'true';
    ctaEl.textContent = onRequest ? 'Consultar no WhatsApp' : 'Ver mais';
    ctaEl.classList.toggle('cta-whatsapp', onRequest);
  }

  // Estoque
  const card = link || slide;
  card.classList.toggle('product-card-out-of-stock', product.inStock === false);
  let badge = slide.querySelector('.product-badge-esgotado');
  if (product.inStock === false && !badge) {
    badge = document.createElement('span');
    badge.className = 'product-badge-esgotado absolute top-3 left-3 z-20';
    badge.textContent = 'Esgotado';
    slide.querySelector('a > div:first-child')?.appendChild(badge);
  } else if (product.inStock !== false && badge) {
    badge.remove();
  }
}

function renderSwatches(container, product) {
  if (!container || !swatchTemplate) return;
  const colors = Array.isArray(product.colorNames) && product.colorNames.length
    ? product.colorNames
    : (product.colors || []).map((hex) => ({ name: hex, hex }));

  const MAX_VISIBLE = 6;
  const nodes = colors.slice(0, MAX_VISIBLE).map((color) => {
    const btn = swatchTemplate.cloneNode(true);
    btn.title = color.name;
    btn.setAttribute('aria-label', `Ver na cor ${color.name}`);
    btn.style.backgroundColor = color.hex;
    return btn;
  });
  if (colors.length > MAX_VISIBLE) {
    const more = colorOverflowTemplate ? colorOverflowTemplate.cloneNode(true) : document.createElement('span');
    more.textContent = `+${colors.length - MAX_VISIBLE}`;
    nodes.push(more);
  }
  container.replaceChildren(...nodes);
  container.hidden = colors.length === 0;
}

function renderTiers(container, product) {
  if (!container || !tierRowTemplate || !Array.isArray(product.tiers) || !product.tiers.length) return;
  const tiers = [...product.tiers].sort((a, b) => (a.minQty || 1) - (b.minQty || 1));

  container.replaceChildren(...tiers.map((tier) => {
    const row = tierRowTemplate.cloneNode(true);
    const max = tier.maxQty === '+' ? Infinity : Number(tier.maxQty) || Infinity;
    const isReference = (tier.minQty || 1) <= 100 && 100 <= max;
    if (!isReference) row.querySelector(':scope > span.absolute')?.remove();

    const [labelWrap, mobileWrap, priceEl] = [...row.children].filter((c) => !c.classList.contains('absolute'));
    labelWrap.firstElementChild.textContent = tier.label;
    const badges = [labelWrap.querySelector('.rounded-full'), mobileWrap?.querySelector('.rounded-full')].filter(Boolean);
    if (tier.discount > 0) {
      badges.forEach((b) => (b.textContent = `-${tier.discount}%`));
    } else {
      badges.forEach((b) => b.remove());
    }
    priceEl.textContent = formatBRL(tier.price).replace(' ', ' ');
    return row;
  }));
}

// ------------------------------------------------------------------
// 3. REELS (vídeos enviados pelo painel, no visual original da seção)
// ------------------------------------------------------------------
let renderedReelsKey = '';

const PLAY_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play w-6 h-6 text-[#0A2717] fill-[#0A2717] translate-x-0.5"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>';

export function renderInstagramReels(settings = db.getSettings()) {
  const track = document.getElementById('instagram-reels-track');
  if (!track) return;

  const reels = (Array.isArray(settings.reels) ? settings.reels : []).filter((r) => r && r.videoId);
  const key = JSON.stringify(reels);
  if (key === renderedReelsKey) return; // não reinicia vídeos que estão tocando
  renderedReelsKey = key;

  // Sem vídeos cadastrados, a seção inteira some (nada de layout vazio)
  const section = track.closest('section');
  if (section) section.hidden = reels.length === 0;

  track.replaceChildren(...reels.map(buildReelCard));
}

function buildReelCard(reel) {
  const card = document.createElement('div');
  card.className = 'flex-none w-[78vw] max-w-[300px] sm:w-72 md:w-80 aspect-[9/16] snap-start group cursor-pointer';
  card.innerHTML = `
    <div class="relative h-full w-full rounded-[2.5rem] overflow-hidden bg-stone-900 transition-all duration-700 group-hover:scale-[1.02] shadow-2xl border-2 border-transparent group-hover:border-primary/30">
      <video loop playsinline preload="metadata" class="absolute inset-0 w-full h-full object-cover"></video>
      <div class="reel-shade absolute inset-0 bg-gradient-to-t from-[#0A2717] via-[#0A2717]/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
      <button type="button" aria-label="Reproduzir vídeo" class="absolute inset-0 flex items-center justify-center focus:outline-none">
        <span class="reel-play w-14 h-14 bg-[#FAB818] rounded-full flex items-center justify-center shadow-xl transition-all duration-300 opacity-100 scale-100">${PLAY_ICON}</span>
      </button>
      <div class="reel-caption absolute bottom-8 left-8 right-8 pointer-events-none">
        <h3 class="text-white font-bold leading-tight text-lg mb-3 tracking-tight"></h3>
      </div>
    </div>`;

  const video = card.querySelector('video');
  video.src = `/media/${reel.videoId}`;
  if (reel.posterId) video.poster = `/media/${reel.posterId}`;
  card.querySelector('h3').textContent = reel.title || '';

  const button = card.querySelector('button');
  const setPlaying = (playing) => {
    card.classList.toggle('reel-playing', playing);
    button.setAttribute('aria-label', playing ? 'Pausar vídeo' : 'Reproduzir vídeo');
  };
  button.addEventListener('click', () => {
    if (video.paused) {
      // Um vídeo por vez
      document.querySelectorAll('#instagram-reels-track video').forEach((v) => v !== video && v.pause());
      video.muted = false;
      video.play().catch(() => {
        // Navegador bloqueou som: toca mudo
        video.muted = true;
        video.play().catch(() => {});
      });
    } else {
      video.pause();
    }
  });
  video.addEventListener('play', () => setPlaying(true));
  video.addEventListener('pause', () => setPlaying(false));
  return card;
}

// Setas "anterior/próximo" da seção de reels
export function setupInstagramReelsNav() {
  const track = document.getElementById('instagram-reels-track');
  const section = track?.closest('section');
  if (!section) return;
  const step = () => (track.firstElementChild?.getBoundingClientRect().width || 320) + 24;
  section.querySelector('button[aria-label="Anterior"]')?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  section.querySelector('button[aria-label="Próximo"]')?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
}
