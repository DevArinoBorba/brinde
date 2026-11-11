// Gordinho Brindes — aplica no storefront tudo o que é gerenciado pelo Painel Admin
// (configurações da loja, produtos dos carrosséis e reels do Instagram).
import { db } from './db.js';

// ------------------------------------------------------------------
// FORMATADORES
// ------------------------------------------------------------------
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
  const saveBadge = [...slide.querySelectorAll('span')].find((s) => s.textContent.trim() === 'Economize até');
  if (saveBadge) {
    const wrapper = saveBadge.parentElement;
    const pct = wrapper.lastElementChild;
    if (pct && pct !== saveBadge) pct.textContent = `${product.maxDiscount || 0}%`;
    wrapper.parentElement.hidden = !product.maxDiscount;
  }

  const priceEl = slide.querySelector('.text-xl.md\\:text-3xl');
  if (priceEl) priceEl.textContent = formatBRL(db.getUnitPriceForQty(product, 100));

  renderTiers(slide.querySelector('.divide-y'), product);

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
// 3. REELS DO INSTAGRAM (embed oficial)
// ------------------------------------------------------------------
let renderedReelsKey = '';

export function renderInstagramReels(settings = db.getSettings()) {
  const track = document.getElementById('instagram-reels-track');
  if (!track) return;

  const reels = Array.isArray(settings.instagramReels) ? settings.instagramReels : [];
  const key = JSON.stringify([reels, settings.instagramUrl]);
  if (key === renderedReelsKey) return; // evita recarregar os iframes à toa
  renderedReelsKey = key;

  if (reels.length) {
    track.replaceChildren(...reels.map((url) => {
      const card = document.createElement('div');
      card.className = 'ig-reel-card';
      const quote = document.createElement('blockquote');
      quote.className = 'instagram-media';
      quote.setAttribute('data-instgrm-permalink', url);
      quote.setAttribute('data-instgrm-version', '14');
      const fallback = document.createElement('a');
      fallback.href = url;
      fallback.target = '_blank';
      fallback.rel = 'noopener noreferrer';
      fallback.textContent = 'Ver este reel no Instagram';
      quote.appendChild(fallback);
      card.appendChild(quote);
      return card;
    }));
    loadInstagramEmbedScript();
  } else {
    // Sem reels cadastrados: mostra a grade pública do perfil
    const user = (settings.instagramUrl || '').match(/instagram\.com\/([A-Za-z0-9._]+)/)?.[1];
    if (!user) {
      track.replaceChildren();
      return;
    }
    const card = document.createElement('div');
    card.className = 'ig-profile-card';
    const frame = document.createElement('iframe');
    frame.src = `https://www.instagram.com/${user}/embed/`;
    frame.title = `Instagram @${user}`;
    frame.loading = 'lazy';
    card.appendChild(frame);
    track.replaceChildren(card);
  }
}

function loadInstagramEmbedScript() {
  if (window.instgrm?.Embeds) {
    window.instgrm.Embeds.process();
    return;
  }
  if (document.getElementById('instagram-embed-js')) return;
  const script = document.createElement('script');
  script.id = 'instagram-embed-js';
  script.async = true;
  script.src = 'https://www.instagram.com/embed.js';
  document.body.appendChild(script);
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
