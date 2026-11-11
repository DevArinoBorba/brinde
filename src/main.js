import { db } from './db.js';
import { applySettings, renderProducts, renderInstagramReels, setupInstagramReelsNav, whatsappUrl, escapeHtml } from './store-sync.js';

// ==========================================================================
// GORDINHO BRINDES — MAIN STOREFRONT CONTROLLER
// ==========================================================================

document.addEventListener('DOMContentLoaded', async () => {
  // Catálogo e configurações vêm do banco; sem API, segue com o catálogo padrão
  await db.ready;

  // 1. Initial Data Sync & Subscription (antes dos binds, para os cards novos receberem eventos)
  syncStorefrontWithDB();
  db.subscribe(({ key }) => {
    // Produto novo cadastrado no admin precisa dos binds de evento da carga da página
    if ((key === 'store' || key === 'products') && renderProducts({ allowCreate: false })) {
      window.location.reload();
      return;
    }
    syncStorefrontWithDB();
    renderCartDrawer();
  });
  setupInstagramReelsNav();

  // 2. Navigation & Modals UI
  setupEntryPopup();
  setupStickyCategoryNav();
  setupMegaMenu();
  setupMobileDrawer();
  setupMobileSearch();
  setupHeroBannerSlider();
  setupProductCarousels();
  setupFaqAccordion();
  setupCookieBanner();

  // 3. Product Cards Interactive Features
  setupCardAccordions();
  setupColorSwatches();
  setupFavorites();
  setupProductClickInterception();

  // 4. Cart Drawer & Checkout
  setupCartDrawer();

  // 5. Category Filtering & Search
  setupCategoryFiltering();

  // 6. Institutional & Client Link Handlers (Zero 404s)
  setupInstitutionalLinks();
});

// ------------------------------------------------------------------
// 1. DATA SYNCHRONIZATION WITH DATABASE
// ------------------------------------------------------------------
function syncStorefrontWithDB() {
  const settings = db.getSettings();

  // 1.1 Configurações do admin (contatos, redes, textos promocionais, faixa do topo)
  applySettings(settings);

  // 1.2 Cashback popup title
  const cashbackTitles = document.querySelectorAll('#entry-popup-title');
  cashbackTitles.forEach(title => {
    title.innerHTML = `Ganhe <span class="italic text-[#16A34A]">${settings.cashbackPercent}% de cashback</span>`;
  });

  // 1.3 Produtos dos carrosséis (nome, fotos, cores, preços por faixa, estoque)
  renderProducts();

  // 1.4 Reels do Instagram
  renderInstagramReels(settings);

  // Update cart badge counters
  updateCartCounters();
}

function updateCartCounters() {
  const cart = db.getCart();
  const totalUnits = cart.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0);
  const cartBadges = document.querySelectorAll('#cart-count-badge, .cart-count-badge');
  cartBadges.forEach(badge => {
    badge.textContent = totalUnits;
    badge.style.display = totalUnits > 0 ? 'flex' : 'none';
  });
}

// ------------------------------------------------------------------
// 2. ENTRY POPUP (CASHBACK OFERTA)
// ------------------------------------------------------------------
function setupEntryPopup() {
  const entryPopup = document.getElementById('entry-popup');
  const closePopupBtn = document.getElementById('btn-close-entry-popup');
  const claimBtn = document.getElementById('btn-claim-cashback');
  const continueBtn = document.getElementById('btn-continue-browsing');

  function closeEntryPopup() {
    if (entryPopup) {
      entryPopup.style.display = 'none';
      entryPopup.classList.add('hidden');
    }
  }

  function openEntryPopup() {
    if (entryPopup) {
      entryPopup.style.display = 'flex';
      entryPopup.classList.remove('hidden');
    }
  }

  if (closePopupBtn) closePopupBtn.addEventListener('click', closeEntryPopup);
  if (claimBtn) {
    claimBtn.addEventListener('click', () => {
      closeEntryPopup();
      showToast('Cupom GORDINHO5 ativado com sucesso!', 'success');
      openCartDrawer();
    });
  }
  if (continueBtn) continueBtn.addEventListener('click', closeEntryPopup);

  if (entryPopup) {
    entryPopup.addEventListener('click', (e) => {
      const card = entryPopup.querySelector('.relative.w-full') || entryPopup.firstElementChild;
      if (e.target === entryPopup || (card && !card.contains(e.target))) {
        closeEntryPopup();
      }
    });
  }

  // Bind PT / Language button to open Cashback offer
  document.querySelectorAll('button').forEach(btn => {
    if (btn.textContent.trim() === 'PT' || btn.querySelector('span[translate="no"]')?.textContent.trim() === 'PT') {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openEntryPopup();
      });
    }
  });
}

// ------------------------------------------------------------------
// 3. MEGAMENU & MOBILE DRAWER NAVIGATION
// ------------------------------------------------------------------

// Barra de categorias presa no topo (position: sticky no CSS). Aqui só marca quando
// ela está colada no topo (sombra) e posiciona o megamenu logo abaixo dela.
function setupStickyCategoryNav() {
  const nav = document.getElementById('category-nav');
  if (!nav) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    const rect = nav.getBoundingClientRect();
    nav.classList.toggle('is-stuck', rect.top <= 0 && window.scrollY > 0);
    document.documentElement.style.setProperty('--megamenu-top', `${Math.max(rect.bottom, 0) + 8}px`);
  };
  const schedule = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
}

function setupMegaMenu() {
  const megaMenu = document.getElementById('nav-megamenu');
  const closeMegaMenuBtn = document.getElementById('btn-close-megamenu');

  function openMegaMenu() {
    if (megaMenu) {
      megaMenu.style.display = 'block';
      megaMenu.classList.add('active');
    }
  }

  function closeMegaMenu() {
    if (megaMenu) {
      megaMenu.style.display = 'none';
      megaMenu.classList.remove('active');
    }
  }

  if (closeMegaMenuBtn) closeMegaMenuBtn.addEventListener('click', closeMegaMenu);

  document.querySelectorAll('button').forEach(btn => {
    const text = btn.textContent.trim().toUpperCase();
    if (text.startsWith('PRODUTOS') || (btn.classList.contains('nav-link') && text.includes('PRODUTOS'))) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (megaMenu && megaMenu.style.display === 'block') {
          closeMegaMenu();
        } else {
          openMegaMenu();
        }
      });
    }
  });

  document.addEventListener('click', (e) => {
    if (megaMenu && megaMenu.style.display === 'block') {
      if (!megaMenu.contains(e.target) && !e.target.closest('button')?.textContent.includes('PRODUTOS')) {
        closeMegaMenu();
      }
    }
  });
}

function setupMobileDrawer() {
  const mobileDrawerBackdrop = document.getElementById('mobile-drawer-backdrop');
  const mobileDrawer = document.getElementById('radix-:r0:');
  const closeMobileDrawerBtn = document.getElementById('btn-close-mobile-drawer');
  const openMenuBtn = document.querySelector('button[aria-label="Abrir menu"]');

  function openMobileDrawer() {
    if (mobileDrawerBackdrop) mobileDrawerBackdrop.classList.remove('hidden');
    if (mobileDrawer) {
      mobileDrawer.classList.remove('closed');
      mobileDrawer.setAttribute('data-state', 'open');
    }
    if (openMenuBtn) openMenuBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMobileDrawer() {
    if (mobileDrawerBackdrop) mobileDrawerBackdrop.classList.add('hidden');
    if (mobileDrawer) {
      mobileDrawer.classList.add('closed');
      mobileDrawer.setAttribute('data-state', 'closed');
    }
    if (openMenuBtn) openMenuBtn.setAttribute('aria-expanded', 'false');
  }

  if (openMenuBtn) openMenuBtn.addEventListener('click', openMobileDrawer);
  if (closeMobileDrawerBtn) closeMobileDrawerBtn.addEventListener('click', closeMobileDrawer);
  if (mobileDrawerBackdrop) mobileDrawerBackdrop.addEventListener('click', closeMobileDrawer);
}

// ------------------------------------------------------------------
// 4. SEARCH (DESKTOP & MOBILE)
// ------------------------------------------------------------------
function setupMobileSearch() {
  const mobileSearchBackdrop = document.getElementById('mobile-search-backdrop');
  const mobileSearchDialog = document.getElementById('mobile-search-dialog');
  const closeMobileSearchBtn = document.getElementById('btn-close-mobile-search');
  const mobileSearchInput = document.getElementById('mobile-search-input');

  function openMobileSearch() {
    if (mobileSearchBackdrop) mobileSearchBackdrop.classList.remove('hidden');
    if (mobileSearchDialog) mobileSearchDialog.classList.remove('hidden');
    if (mobileSearchInput) setTimeout(() => mobileSearchInput.focus(), 100);
  }

  function closeMobileSearch() {
    if (mobileSearchBackdrop) mobileSearchBackdrop.classList.add('hidden');
    if (mobileSearchDialog) mobileSearchDialog.classList.add('hidden');
  }

  if (closeMobileSearchBtn) closeMobileSearchBtn.addEventListener('click', closeMobileSearch);
  if (mobileSearchBackdrop) mobileSearchBackdrop.addEventListener('click', closeMobileSearch);

  // Search input listeners
  const allSearchInputs = document.querySelectorAll('input[placeholder="Buscar produtos"]');
  allSearchInputs.forEach(input => {
    input.addEventListener('click', () => {
      if (window.innerWidth < 1024) openMobileSearch();
    });
    input.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      filterProductsBySearch(query);
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = input.value.trim().toLowerCase();
        filterProductsBySearch(query);
        closeMobileSearch();
      }
    });
  });

  // Search tags
  document.querySelectorAll('.search-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const term = tag.textContent.trim().toLowerCase();
      allSearchInputs.forEach(input => input.value = term);
      filterProductsBySearch(term);
      closeMobileSearch();
    });
  });
}

function filterProductsBySearch(query) {
  if (!query) {
    document.querySelectorAll('[data-listing-product-id], .group.relative.flex.flex-col').forEach(card => {
      card.style.display = '';
    });
    return;
  }

  let foundCount = 0;
  let firstMatch = null;

  document.querySelectorAll('[data-listing-product-id], .group.relative.flex.flex-col').forEach(card => {
    const text = card.textContent.toLowerCase();
    if (text.includes(query)) {
      card.style.display = '';
      foundCount++;
      if (!firstMatch) firstMatch = card;
    } else {
      card.style.display = 'none';
    }
  });

  if (firstMatch) {
    firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// ------------------------------------------------------------------
// 5. PRODUCT CARD ACCORDIONS (PREVENT CLICK BUBBLING)
// ------------------------------------------------------------------
function setupCardAccordions() {
  // 5.1 "Detalhes" buttons
  document.querySelectorAll('button').forEach(btn => {
    if (btn.textContent.trim().startsWith('Detalhes')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // CRITICAL: Stop bubbling to card anchor

        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !isExpanded);

        const svg = btn.querySelector('svg');
        if (svg) {
          if (!isExpanded) svg.classList.add('rotate-180');
          else svg.classList.remove('rotate-180');
        }

        const cardParent = btn.closest('.flex.flex-1.flex-col') || btn.parentElement.parentElement;
        const detailsContent = cardParent ? cardParent.querySelector('.product-details-content') : null;
        if (detailsContent) {
          if (!isExpanded) {
            detailsContent.classList.remove('collapsed');
            detailsContent.classList.add('expanded');
          } else {
            detailsContent.classList.remove('expanded');
            detailsContent.classList.add('collapsed');
          }
        }
      });
    }
  });

  // 5.2 "Preço por quantidade" buttons
  document.querySelectorAll('button').forEach(btn => {
    const text = btn.textContent.toLowerCase();
    if (text.includes('preço por qtd') || text.includes('preço por quantidade')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // CRITICAL: Stop bubbling to card anchor

        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !isExpanded);

        const svg = btn.querySelector('svg.lucide-chevron-down');
        if (svg) {
          if (!isExpanded) svg.classList.add('rotate-180');
          else svg.classList.remove('rotate-180');
        }

        const parent = btn.parentElement;
        const tableContainer = parent ? parent.querySelector('.grid.transition-\\[grid-template-rows\\,opacity\\,margin\\]') || parent.nextElementSibling : null;
        if (tableContainer) {
          if (!isExpanded) {
            tableContainer.classList.remove('grid-rows-[0fr]', 'opacity-0', 'mt-0');
            tableContainer.classList.add('grid-rows-[1fr]', 'opacity-100', 'mt-2');
          } else {
            tableContainer.classList.remove('grid-rows-[1fr]', 'opacity-100', 'mt-2');
            tableContainer.classList.add('grid-rows-[0fr]', 'opacity-0', 'mt-0');
          }
        }
      });
    }
  });

  // 5.3 Quantity Tier Buttons inside accordion
  document.querySelectorAll('.grid.transition-\\[grid-template-rows\\,opacity\\,margin\\] button').forEach(tierBtn => {
    tierBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // CRITICAL: Stop bubbling

      const card = tierBtn.closest('.flex.flex-1.flex-col')?.parentElement || tierBtn.closest('[data-listing-product-id]');
      const priceText = tierBtn.querySelector('.tabular-nums:last-child')?.textContent.trim();
      if (card && priceText) {
        const mainPrice = card.querySelector('.text-xl.md\\:text-3xl.font-extrabold');
        if (mainPrice) {
          mainPrice.textContent = priceText;
        }
      }
    });
  });
}

// ------------------------------------------------------------------
// 6. COLOR SWATCHES & FAVORITES
// ------------------------------------------------------------------
function setupColorSwatches() {
  document.querySelectorAll('.flex.flex-wrap.gap-1 button, [aria-label*="Selecionar cor"]').forEach(swatch => {
    swatch.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // CRITICAL: Stop bubbling

      const parent = swatch.parentElement;
      if (parent) {
        parent.querySelectorAll('button').forEach(b => {
          b.classList.remove('ring-2', 'ring-offset-2', 'ring-[#FAB818]', 'scale-110');
        });
      }
      swatch.classList.add('ring-2', 'ring-offset-2', 'ring-[#FAB818]', 'scale-110');
    });
  });
}

function setupFavorites() {
  document.querySelectorAll('button[aria-label="Adicionar aos favoritos"], button svg.lucide-heart').forEach(el => {
    const btn = el.tagName === 'BUTTON' ? el : el.closest('button');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // CRITICAL: Stop bubbling

      const card = btn.closest('[data-listing-product-id]') || btn.closest('.group');
      const productId = card ? (card.getAttribute('data-db-product-id') || card.getAttribute('data-listing-product-id')) : 'prod-generic';

      const isFav = db.toggleFavorite(productId);
      const svg = btn.querySelector('svg');
      if (svg) {
        if (isFav) {
          svg.setAttribute('fill', '#EF4444');
          svg.setAttribute('stroke', '#EF4444');
          showToast('Adicionado aos favoritos!', 'success');
        } else {
          svg.setAttribute('fill', 'none');
          svg.setAttribute('stroke', 'currentColor');
          showToast('Removido dos favoritos.', 'info');
        }
      }
    });
  });
}

// ------------------------------------------------------------------
// 7. PRODUCT CARD CLICK -> OPEN ORDER / QUOTE MODAL
// ------------------------------------------------------------------
function setupProductClickInterception() {
  document.addEventListener('click', (e) => {
    // Check if clicked element or parent is a link to a product
    const productLink = e.target.closest('a[href^="/produto/"], a[href^="/p/produto"], .btn-quote-product');
    const verMaisBtn = e.target.closest('button, a');

    const isVerMais = verMaisBtn && (
      verMaisBtn.textContent.includes('Ver mais') || 
      verMaisBtn.textContent.includes('Personalizar') ||
      verMaisBtn.textContent.includes('Cotar Agora')
    );

    if (productLink || isVerMais) {
      // Don't intercept if clicking an accordion inside
      if (e.target.closest('.product-details-content, .grid.transition-\\[grid-template-rows\\,opacity\\,margin\\], [aria-label="Adicionar aos favoritos"]')) {
        return;
      }

      e.preventDefault();
      const card = (productLink || verMaisBtn).closest('[data-listing-product-id], .group.relative.flex.flex-col, .product-card');
      const productId = card ? card.getAttribute('data-db-product-id') : null;
      const titleEl = card ? card.querySelector('h3') : null;
      const title = titleEl ? titleEl.textContent.trim() : '';

      const products = db.getProducts();
      let matched = null;

      if (productId) {
        matched = products.find(p => p.id === productId);
      }
      if (!matched && title) {
        matched = products.find(p => p.name.toUpperCase() === title.toUpperCase() || (p.sku && title.includes(p.sku)));
      }
      if (!matched) {
        matched = products[0];
      }

      openOrderModal(matched);
    }
  });
}

// ------------------------------------------------------------------
// 8. INTERACTIVE ORDER / QUOTE MODAL (WITH WHATSAPP & DB PERSISTENCE)
// ------------------------------------------------------------------
function openOrderModal(product) {
  let modalBackdrop = document.getElementById('store-order-modal-backdrop');
  if (!modalBackdrop) {
    modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'store-order-modal-backdrop';
    modalBackdrop.className = 'admin-modal-backdrop';
    document.body.appendChild(modalBackdrop);
  }

  let selectedQty = 100;
  let selectedColor = (product.colorNames && product.colorNames[0]) ? product.colorNames[0].name : 'Cor Padrão';
  let unitPrice = db.getUnitPriceForQty(product, selectedQty);

  function recalculate() {
    unitPrice = db.getUnitPriceForQty(product, selectedQty);
    const total = selectedQty * unitPrice;
    const unitPriceEl = document.getElementById('modal-unit-price-display');
    const totalEl = document.getElementById('modal-order-total');
    if (unitPriceEl) unitPriceEl.textContent = `R$ ${unitPrice.toFixed(2).replace('.', ',')} / un.`;
    if (totalEl) totalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
  }

  modalBackdrop.classList.remove('hidden');
  modalBackdrop.innerHTML = `
    <div class="admin-modal" onclick="event.stopPropagation()" style="max-width: 540px;">
      <div class="admin-modal-header" style="background: linear-gradient(135deg, #06180E 0%, #0A2717 100%); color: #fff; border-bottom: 2px solid #FAB818;">
        <div>
          <span style="font-size: 11px; font-weight: 800; color: #FAB818; text-transform: uppercase; letter-spacing: 0.1em;">
            Solicitar Orçamento Personalizado
          </span>
          <h2 style="font-size: 17px; font-weight: 700; margin: 3px 0 0 0; color: #FFFFFF;">${product.name}</h2>
        </div>
        <button type="button" id="btn-close-store-modal" class="admin-btn admin-btn-secondary admin-btn-sm" style="color: #fff; border-color: rgba(255,255,255,0.3);">✕</button>
      </div>

      <form id="store-order-form" class="admin-modal-body" style="padding: 20px;">
        <!-- Product Snapshot Card -->
        <div style="display: flex; gap: 14px; align-items: center; background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 12px; margin-bottom: 16px;">
          <img src="${product.image || '/favicon.png'}" alt="${product.name}" style="width: 64px; height: 64px; object-fit: contain; border-radius: 8px; background: #fff; padding: 4px; border: 1px solid #CBD5E1;">
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 11px; color: #64748B; font-weight: 700;">SKU: ${product.sku || 'N/A'}</span>
              <span style="font-size: 11px; font-weight: 800; color: #22C55E; background: #DCFCE7; padding: 2px 6px; border-radius: 4px;">Em Estoque</span>
            </div>
            <div id="modal-unit-price-display" style="font-size: 16px; font-weight: 800; color: #06180E; margin-top: 2px;">
              R$ ${unitPrice.toFixed(2).replace('.', ',')} / un.
            </div>
            <div style="font-size: 11px; color: #64748B;">Categoria: <strong>${product.category || 'Geral'}</strong> · Preço progressivo por atacado</div>
          </div>
        </div>

        <!-- Color Selection -->
        ${product.colorNames && product.colorNames.length > 0 ? `
          <div class="admin-form-group" style="margin-bottom: 14px;">
            <label class="admin-form-label" style="font-weight: 700; font-size: 12px; color: #06180E;">Escolha a Cor do Brinde:</label>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              ${product.colorNames.map((c, i) => `
                <button type="button" class="btn-modal-color-select ${i === 0 ? 'active' : ''}" data-color-name="${c.name}" style="display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; border: 1.5px solid ${i === 0 ? '#FAB818' : '#CBD5E1'}; background: ${i === 0 ? '#FEF9C3' : '#fff'}; cursor: pointer; font-size: 12px; font-weight: 600;">
                  <span style="width: 14px; height: 14px; border-radius: 50%; background: ${c.hex}; border: 1px solid rgba(0,0,0,0.2);"></span>
                  <span>${c.name}</span>
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Quantity Selection -->
        <div class="admin-form-group" style="margin-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <label class="admin-form-label" style="font-weight: 700; font-size: 12px; color: #06180E; margin: 0;">Quantidade de Peças:</label>
            <span style="font-size: 11px; color: #22C55E; font-weight: 700;">Quanto maior a quantidade, menor o valor unitário!</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(5, 1fr) 110px; gap: 6px;">
            ${[50, 100, 250, 500, 1000].map(q => `
              <button type="button" class="admin-btn ${q === 100 ? 'admin-btn-primary' : 'admin-btn-secondary'} admin-btn-sm btn-qty-pill" data-qty="${q}" style="padding: 6px 4px; font-weight: 700; font-size: 12px;">
                ${q} un.
              </button>
            `).join('')}
            <input type="number" id="order-custom-qty" min="1" value="100" class="admin-input" style="padding: 6px 8px; text-align: center; font-weight: 700; font-size: 12px;" placeholder="Outra qtd">
          </div>
        </div>

        <!-- Customer Form Fields -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="admin-form-group">
            <label class="admin-form-label" style="font-weight: 700; font-size: 12px;">Seu Nome *</label>
            <input type="text" id="order-cust-name" class="admin-input" required placeholder="Ex: Roberto Alves">
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label" style="font-weight: 700; font-size: 12px;">Empresa / Razão Social</label>
            <input type="text" id="order-cust-company" class="admin-input" placeholder="Ex: Agência Criativa">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="admin-form-group">
            <label class="admin-form-label" style="font-weight: 700; font-size: 12px;">WhatsApp com DDD *</label>
            <input type="text" id="order-cust-phone" class="admin-input" required placeholder="(47) 99999-9999">
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label" style="font-weight: 700; font-size: 12px;">E-mail Corporativo *</label>
            <input type="email" id="order-cust-email" class="admin-input" required placeholder="contato@empresa.com.br">
          </div>
        </div>

        <div class="admin-form-group">
          <label class="admin-form-label" style="font-weight: 700; font-size: 12px;">Detalhes da Gravação / Logo</label>
          <input type="text" id="order-notes" class="admin-input" placeholder="Ex: Gravação a laser 1 posição / Silk em 2 cores">
        </div>

        <!-- Total Calculation Box -->
        <div style="background: linear-gradient(135deg, #06180E 0%, #0A2717 100%); border: 1.5px solid #FAB818; border-radius: 12px; padding: 14px; display: flex; justify-content: space-between; align-items: center; margin-top: 10px; color: #fff;">
          <div>
            <div style="font-size: 11px; color: #FAB818; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">INVESTIMENTO TOTAL ESTIMADO</div>
            <div style="font-size: 11px; color: #E2E8F0;">${db.getSettings().pixDiscountPercent}% de desconto à vista via Pix ou até ${db.getSettings().maxInstallments}x s/ juros</div>
          </div>
          <div id="modal-order-total" style="font-size: 20px; font-weight: 900; color: #FAB818;">
            R$ ${(selectedQty * unitPrice).toFixed(2).replace('.', ',')}
          </div>
        </div>
      </form>

      <div class="admin-modal-footer" style="padding: 16px 20px; background: #F8FAFC; border-top: 1px solid #E2E8F0; display: flex; gap: 10px; justify-content: space-between;">
        <button type="button" id="btn-add-to-cart-from-modal" class="admin-btn admin-btn-secondary" style="font-size: 13px;">
          🛒 Adicionar à Sacola
        </button>
        <div style="display: flex; gap: 8px;">
          <button type="button" id="btn-submit-whatsapp-order" class="admin-btn" style="background: #25D366; color: #fff; font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 6px;">
            <span>💬 Orçar no WhatsApp</span>
          </button>
          <button type="button" id="btn-submit-store-order" class="admin-btn admin-btn-primary" style="font-size: 13px; font-weight: 700;">
            Confirmar Proposta
          </button>
        </div>
      </div>
    </div>
  `;

  // Close handlers
  document.getElementById('btn-close-store-modal')?.addEventListener('click', closeOrderModal);
  modalBackdrop.addEventListener('click', closeOrderModal);

  // Color selection
  modalBackdrop.querySelectorAll('.btn-modal-color-select').forEach(btn => {
    btn.addEventListener('click', () => {
      modalBackdrop.querySelectorAll('.btn-modal-color-select').forEach(b => {
        b.style.borderColor = '#CBD5E1';
        b.style.background = '#fff';
      });
      btn.style.borderColor = '#FAB818';
      btn.style.background = '#FEF9C3';
      selectedColor = btn.getAttribute('data-color-name');
    });
  });

  // Quantity selection pills
  modalBackdrop.querySelectorAll('.btn-qty-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      modalBackdrop.querySelectorAll('.btn-qty-pill').forEach(b => {
        b.classList.remove('admin-btn-primary');
        b.classList.add('admin-btn-secondary');
      });
      btn.classList.add('admin-btn-primary');
      btn.classList.remove('admin-btn-secondary');
      selectedQty = parseInt(btn.getAttribute('data-qty'), 10);
      const customInput = document.getElementById('order-custom-qty');
      if (customInput) customInput.value = selectedQty;
      recalculate();
    });
  });

  // Custom quantity input
  const customQtyInput = document.getElementById('order-custom-qty');
  if (customQtyInput) {
    customQtyInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (val && val > 0) {
        selectedQty = val;
        modalBackdrop.querySelectorAll('.btn-qty-pill').forEach(b => {
          b.classList.remove('admin-btn-primary');
          b.classList.add('admin-btn-secondary');
        });
        recalculate();
      }
    });
  }

  // Action: Add to Cart
  document.getElementById('btn-add-to-cart-from-modal')?.addEventListener('click', () => {
    const notes = document.getElementById('order-notes')?.value.trim() || '';
    db.addToCart(product, selectedQty, {
      selectedColor,
      notes,
    });
    closeOrderModal();
    showToast(`Adicionado: ${selectedQty}x ${product.name} à sacola!`, 'success');
    openCartDrawer();
  });

  // Action: WhatsApp Direct Quote
  document.getElementById('btn-submit-whatsapp-order')?.addEventListener('click', () => {
    const name = document.getElementById('order-cust-name')?.value.trim() || 'Cliente';
    const company = document.getElementById('order-cust-company')?.value.trim() || 'Não informada';
    const notes = document.getElementById('order-notes')?.value.trim() || 'Padrão';
    const total = (selectedQty * unitPrice).toFixed(2).replace('.', ',');

    const message = `Olá, Gordinho Brindes! Vim pelo site e gostaria de um orçamento corporativo:
*Produto:* ${product.name} (SKU: ${product.sku || 'N/A'})
*Quantidade:* ${selectedQty} unidades
*Cor Escolhida:* ${selectedColor}
*Valor Estimado:* R$ ${total} (R$ ${unitPrice.toFixed(2).replace('.', ',')}/un.)
*Cliente:* ${name}
*Empresa:* ${company}
*Instruções:* ${notes}`;

    window.open(whatsappUrl(message), '_blank');
  });

  // Action: Confirm Store Order (DB Persistence)
  document.getElementById('btn-submit-store-order')?.addEventListener('click', async (e) => {
    const name = document.getElementById('order-cust-name')?.value.trim();
    const phone = document.getElementById('order-cust-phone')?.value.trim();
    const email = document.getElementById('order-cust-email')?.value.trim();
    const company = document.getElementById('order-cust-company')?.value.trim();
    const notes = document.getElementById('order-notes')?.value.trim();

    if (!name || !phone || !email) {
      alert('Por favor, informe Nome, WhatsApp e E-mail para registrar a proposta.');
      return;
    }

    const total = parseFloat((selectedQty * unitPrice).toFixed(2));

    const submitBtn = e.currentTarget;
    submitBtn.disabled = true;
    let newOrder;
    try {
      newOrder = await db.addOrder({
      customer: { name, company, phone, email },
      items: [
        {
          productId: product.id,
          name: product.name,
          sku: product.sku || '',
          quantity: selectedQty,
          color: selectedColor,
          unitPrice,
          total,
        }
      ],
      total,
      paymentMethod: `Pix à vista (${db.getSettings().pixDiscountPercent}% OFF) ou Faturado`,
      notes: notes || 'Gravação personalizada com arte enviada pelo cliente.',
    });
    } catch (err) {
      submitBtn.disabled = false;
      showToast(`Não foi possível registrar a proposta: ${err.message} Envie pelo WhatsApp.`, 'error');
      return;
    }

    modalBackdrop.innerHTML = `
      <div class="admin-modal" onclick="event.stopPropagation()" style="max-width: 480px; text-align: center; padding: 36px 24px;">
        <div style="width: 58px; height: 58px; border-radius: 50%; background: #DCFCE7; color: #16A34A; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style="font-size: 21px; font-weight: 800; color: #06180E; margin: 0 0 8px 0;">Proposta #${newOrder.id} Registrada!</h2>
        <p style="font-size: 13.5px; color: #64748B; margin: 0 0 20px 0; line-height: 1.5;">
          Sua solicitação de orçamento foi gravada com sucesso. Nossa equipe de consultores entrará em contato pelo WhatsApp <strong>${escapeHtml(phone)}</strong> em instantes!
        </p>

        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
          <button type="button" class="admin-btn admin-btn-secondary" onclick="document.getElementById('store-order-modal-backdrop').remove()">
            Continuar no Site
          </button>
          <a href="${whatsappUrl(`Olá, acabei de solicitar a proposta ${newOrder.id} no site da ${db.getSettings().storeName}!`)}" target="_blank" class="admin-btn" style="background: #25D366; color: #fff; font-weight: 700;">
            💬 Abrir no WhatsApp
          </a>
        </div>
      </div>
    `;
  });
}

function closeOrderModal() {
  const modal = document.getElementById('store-order-modal-backdrop');
  if (modal) modal.classList.add('hidden');
}

// ------------------------------------------------------------------
// 9. SHOPPING CART DRAWER (FULL MULTI-ITEM CRUD)
// ------------------------------------------------------------------
function setupCartDrawer() {
  let drawer = document.getElementById('gordinho-cart-drawer');
  if (!drawer) {
    drawer = document.createElement('div');
    drawer.id = 'gordinho-cart-drawer';
    drawer.className = 'fixed inset-0 z-[120] flex justify-end bg-black/50 backdrop-blur-sm transition-opacity duration-300 hidden';
    drawer.innerHTML = `
      <div class="relative w-full max-w-[440px] h-full bg-[#FFFFFF] shadow-2xl flex flex-col" onclick="event.stopPropagation()">
        <!-- Header -->
        <div class="p-5 border-b border-gray-100 flex items-center justify-between bg-[#06180E] text-white">
          <div class="flex items-center gap-2.5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FAB818" stroke-width="2.2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            <div>
              <h2 class="font-bold text-base text-white font-heading">Sua Sacola de Orçamentos</h2>
              <p class="text-[11px] text-gray-300">Gordinho Brindes · Faturamento corporativo</p>
            </div>
          </div>
          <button id="btn-close-cart-drawer" class="h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        <!-- Cart Items List -->
        <div class="flex-1 p-5 overflow-y-auto" id="cart-drawer-items-list">
        </div>

        <!-- Coupon Input Box -->
        <div class="px-5 py-3 bg-[#F8FAFC] border-t border-gray-200">
          <div class="flex gap-2">
            <input type="text" id="cart-coupon-input" placeholder="Cupom de Desconto (ex: GORDINHO5)" class="admin-input" style="padding: 7px 10px; font-size: 12px; flex: 1; text-transform: uppercase;">
            <button type="button" id="btn-apply-coupon" class="admin-btn admin-btn-secondary admin-btn-sm" style="font-size: 11px; font-weight: 700;">
              Aplicar
            </button>
          </div>
          <div id="cart-coupon-msg" style="font-size: 11px; margin-top: 4px; display: none;"></div>
        </div>

        <!-- Footer / Checkout -->
        <div class="p-5 border-t border-gray-200 bg-white">
          <div class="space-y-1.5 mb-3 text-xs">
            <div class="flex justify-between text-gray-500">
              <span>Subtotal estimado</span>
              <span id="cart-subtotal-val" class="font-semibold text-gray-800">R$ 0,00</span>
            </div>
            <div class="flex justify-between text-gray-500" id="cart-discount-row" style="display: none;">
              <span id="cart-discount-label">Desconto</span>
              <span id="cart-discount-val" class="font-bold text-emerald-600">- R$ 0,00</span>
            </div>
            <div class="flex justify-between text-sm font-extrabold text-[#06180E] pt-2 border-t border-gray-100">
              <span>Total Estimado</span>
              <span id="cart-total-val" class="text-base text-[#06180E]">R$ 0,00</span>
            </div>
            <div class="flex justify-between text-xs font-bold text-emerald-600">
              <span>À vista no Pix (${db.getSettings().pixDiscountPercent}% OFF)</span>
              <span id="cart-pix-val">R$ 0,00</span>
            </div>
          </div>

          <div class="space-y-2">
            <button id="btn-cart-whatsapp-checkout" class="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.82 2.791.82 3.181 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.806-5.768-5.806zm7.251 5.766c-.001 4.004-3.257 7.258-7.251 7.258-1.22 0-2.385-.306-3.411-.854l-3.769.988 1.006-3.676c-.633-1.076-.98-2.327-.98-3.716 0-4.004 3.256-7.259 7.251-7.259 3.996 0 7.253 3.255 7.253 7.259z"/></svg>
              <span>Enviar Proposta no WhatsApp</span>
            </button>
            <div class="flex gap-2">
              <button id="btn-clear-cart" class="flex-1 py-2 text-center text-xs text-gray-500 hover:text-red-500 transition-colors font-medium">
                Limpar Sacola
              </button>
              <button id="btn-continue-shopping" class="flex-1 py-2 text-center text-xs text-[#06180E] hover:underline font-bold">
                + Adicionar mais
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);

    drawer.addEventListener('click', closeCartDrawer);
    document.getElementById('btn-close-cart-drawer')?.addEventListener('click', closeCartDrawer);
    document.getElementById('btn-continue-shopping')?.addEventListener('click', closeCartDrawer);

    document.getElementById('btn-clear-cart')?.addEventListener('click', () => {
      if (confirm('Deseja realmente limpar todos os itens da sacola?')) {
        db.clearCart();
        renderCartDrawer();
      }
    });

    // Apply Coupon handler
    let appliedCouponCode = '';
    document.getElementById('btn-apply-coupon')?.addEventListener('click', () => {
      const input = document.getElementById('cart-coupon-input');
      const msg = document.getElementById('cart-coupon-msg');
      const code = input ? input.value.trim().toUpperCase() : '';
      if (!code) return;

      const calc = db.getCartTotals(code);
      if (calc.appliedCoupon) {
        appliedCouponCode = code;
        if (msg) {
          msg.textContent = `✓ Cupom ${code} aplicado! ${calc.discountPercent}% de desconto.`;
          msg.style.color = '#16A34A';
          msg.style.display = 'block';
        }
      } else {
        appliedCouponCode = '';
        if (msg) {
          msg.textContent = `✕ Cupom "${code}" inválido ou expirado. Tente GORDINHO5.`;
          msg.style.color = '#EF4444';
          msg.style.display = 'block';
        }
      }
      renderCartDrawer(appliedCouponCode);
    });

    // WhatsApp Checkout handler
    document.getElementById('btn-cart-whatsapp-checkout')?.addEventListener('click', async () => {
      const cart = db.getCart();
      if (cart.length === 0) {
        alert('Sua sacola está vazia.');
        return;
      }
      const calc = db.getCartTotals(appliedCouponCode);
      let itemsText = cart.map((item, idx) => 
        `${idx + 1}. *${item.name}* (SKU: ${item.sku || 'N/A'})\n   - Qtd: ${item.quantity} un. | Cor: ${item.color || 'Padrão'}\n   - Valor: R$ ${item.total.toFixed(2).replace('.', ',')} (R$ ${item.unitPrice.toFixed(2).replace('.', ',')}/un.)`
      ).join('\n\n');

      const message = `Olá, equipe Gordinho Brindes! Gostaria de formalizar uma proposta comercial com os seguintes itens da minha sacola:

${itemsText}

*Subtotal:* R$ ${calc.subtotal.toFixed(2).replace('.', ',')}
${calc.discountAmount > 0 ? `*Desconto (${calc.discountPercent}%):* -R$ ${calc.discountAmount.toFixed(2).replace('.', ',')}\n` : ''}*Total Estimado:* R$ ${calc.total.toFixed(2).replace('.', ',')}
*À vista no Pix:* R$ ${calc.pixTotal.toFixed(2).replace('.', ',')}

Aguardo retorno com o mockup digital e dados para faturamento!`;

      // Abre o WhatsApp já no clique (bloqueadores de pop-up barram janelas abertas depois de um await)
      const waWindow = window.open('about:blank', '_blank');

      // Save order to DB
      const profile = db.getCustomerProfile();
      let order = null;
      try {
        order = await db.addOrder({
        customer: { name: profile.name || 'Cliente WhatsApp', company: profile.company || '', phone: profile.phone || '', email: profile.email || '' },
        items: cart.map(({ productId, quantity, color, notes }) => ({ productId, quantity, color, notes })),
        couponCode: appliedCouponCode,
        paymentMethod: `Pix à vista (${db.getSettings().pixDiscountPercent}% OFF) ou Boleto Faturado`,
        notes: 'Pedido gerado via Sacola de Orçamentos do Storefront.',
      });
      } catch (err) {
        // O orçamento segue pelo WhatsApp mesmo se o registro no banco falhar
        console.error('[pedido] não registrado:', err);
      }

      const finalMessage = order ? `${message}

*Proposta:* #${order.id}` : message;
      if (waWindow) waWindow.location.href = whatsappUrl(finalMessage);
      else window.open(whatsappUrl(finalMessage), '_blank');
      closeCartDrawer();
      showToast(order ? `Proposta #${order.id} gerada! Abrindo WhatsApp...` : 'Abrindo WhatsApp...', 'success');
    });
  }

  // Bind all cart toggle buttons across header and nav
  document.querySelectorAll('a[href="/carrinho"], button[aria-label*="carrinho"], button[aria-label*="sacola"], #header-cart-btn, .cart-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });
}

function openCartDrawer() {
  const drawer = document.getElementById('gordinho-cart-drawer');
  if (!drawer) return;
  renderCartDrawer();
  drawer.classList.remove('hidden');
}

function closeCartDrawer() {
  const drawer = document.getElementById('gordinho-cart-drawer');
  if (drawer) drawer.classList.add('hidden');
}

function renderCartDrawer(couponCode = '') {
  const container = document.getElementById('cart-drawer-items-list');
  if (!container) return;

  const cart = db.getCart();
  const calc = db.getCartTotals(couponCode);

  // Update summary totals
  const subtotalEl = document.getElementById('cart-subtotal-val');
  const totalEl = document.getElementById('cart-total-val');
  const pixEl = document.getElementById('cart-pix-val');
  const discountRow = document.getElementById('cart-discount-row');
  const discountVal = document.getElementById('cart-discount-val');
  const discountLabel = document.getElementById('cart-discount-label');

  if (subtotalEl) subtotalEl.textContent = `R$ ${calc.subtotal.toFixed(2).replace('.', ',')}`;
  if (totalEl) totalEl.textContent = `R$ ${calc.total.toFixed(2).replace('.', ',')}`;
  if (pixEl) pixEl.textContent = `R$ ${calc.pixTotal.toFixed(2).replace('.', ',')}`;

  if (discountRow && discountVal) {
    if (calc.discountAmount > 0) {
      discountRow.style.display = 'flex';
      discountVal.textContent = `- R$ ${calc.discountAmount.toFixed(2).replace('.', ',')}`;
      if (discountLabel) discountLabel.textContent = `Desconto (${calc.discountPercent}%)`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 px-4">
        <div class="w-16 h-16 rounded-full bg-amber-50 text-[#FAB818] flex items-center justify-center mx-auto mb-3">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        </div>
        <h3 class="text-sm font-bold text-gray-800 mb-1">Sua sacola de orçamentos está vazia</h3>
        <p class="text-xs text-gray-500 mb-5">Navegue pelas 50 opções de brindes corporativos e adicione para cotar.</p>
        <button type="button" class="admin-btn admin-btn-primary admin-btn-sm" onclick="document.getElementById('gordinho-cart-drawer').classList.add('hidden'); window.scrollTo({top: 800, behavior: 'smooth'});">
          Explorar Brindes
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="divide-y divide-gray-100">
      ${cart.map((item, idx) => `
        <div class="py-4 flex gap-3 items-center">
          <img src="${item.image || '/favicon.png'}" alt="${item.name}" class="h-16 w-16 object-contain rounded-xl border border-gray-200 bg-white p-1">
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-xs text-[#06180E] truncate">${item.name}</h4>
            <div class="text-[11px] text-gray-500 mt-0.5">
              Cor: <strong class="text-gray-700">${item.color || 'Padrão'}</strong>
            </div>
            <div class="text-xs font-bold text-emerald-600 mt-1">
              R$ ${item.unitPrice.toFixed(2).replace('.', ',')} / un.
            </div>

            <!-- Stepper -->
            <div class="flex items-center gap-2 mt-2">
              <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                <button type="button" class="cart-qty-btn btn-cart-minus" data-idx="${idx}">-</button>
                <span class="px-2.5 text-xs font-bold tabular-nums text-gray-800">${item.quantity}</span>
                <button type="button" class="cart-qty-btn btn-cart-plus" data-idx="${idx}">+</button>
              </div>
              <button type="button" class="text-[11px] text-red-500 hover:underline btn-cart-remove ml-2" data-idx="${idx}">
                Remover
              </button>
            </div>
          </div>
          <div class="font-extrabold text-sm text-[#06180E]">
            R$ ${item.total.toFixed(2).replace('.', ',')}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Attach quantity modification events
  container.querySelectorAll('.btn-cart-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      const current = cart[idx].quantity;
      if (current > 10) {
        db.updateCartItem(idx, current - 10);
      } else if (current > 1) {
        db.updateCartItem(idx, current - 1);
      } else {
        db.removeFromCart(idx);
      }
      renderCartDrawer(couponCode);
    });
  });

  container.querySelectorAll('.btn-cart-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      db.updateCartItem(idx, cart[idx].quantity + 10);
      renderCartDrawer(couponCode);
    });
  });

  container.querySelectorAll('.btn-cart-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      db.removeFromCart(idx);
      renderCartDrawer(couponCode);
    });
  });
}

// ------------------------------------------------------------------
// 10. CATEGORY FILTERING & MEGA MENU CLICKS
// ------------------------------------------------------------------
function setupCategoryFiltering() {
  document.addEventListener('click', (e) => {
    const catLink = e.target.closest('a[href^="/categoria/"], a[href="/todos-produtos"], .nav-category-item');
    if (!catLink) return;

    e.preventDefault();
    const href = catLink.getAttribute('href');

    if (href === '/todos-produtos') {
      filterProductsByCategory('all');
      showToast('Exibindo todos os 50 brindes do catálogo!', 'info');
      scrollToProducts();
      return;
    }

    const slug = href.replace('/categoria/', '').trim();
    filterProductsByCategory(slug);
    scrollToProducts();
  });
}

function filterProductsByCategory(slug) {
  const cards = document.querySelectorAll('[data-listing-product-id], .group.relative.flex.flex-col');
  const products = db.getProducts();

  if (slug === 'all') {
    cards.forEach(card => card.style.display = '');
    return;
  }

  let visibleCount = 0;
  cards.forEach(card => {
    const productId = card.getAttribute('data-db-product-id');
    const titleEl = card.querySelector('h3');
    const title = titleEl ? titleEl.textContent.trim().toUpperCase() : '';

    const p = products.find(prod => 
      prod.id === productId || 
      prod.name.toUpperCase() === title || 
      (prod.sku && title.includes(prod.sku))
    );

    if (p) {
      const catSlug = (p.category || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-');
      if (catSlug.includes(slug) || slug.includes(catSlug) || (p.category && p.category.toLowerCase().includes(slug.replace(/-/g, ' ')))) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    }
  });

  showToast(`Filtrado: ${visibleCount} produto(s) encontrados.`, 'info');
}

function scrollToProducts() {
  const target = document.querySelector('section[aria-labelledby="mais-vendidos-heading"]') || document.querySelector('[data-listing-product-id]')?.closest('section');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ------------------------------------------------------------------
// 11. INSTITUTIONAL & CLIENT LINKS (ZERO 404S)
// ------------------------------------------------------------------
function setupInstitutionalLinks() {
  const institutionalPages = {
    '/p/quem-somos': {
      title: 'Quem Somos · Gordinho Brindes',
      content: `
        <p class="mb-3">A <strong>Gordinho Brindes</strong> é a unidade de soluções corporativas e personalização premium do Grupo Gordinho, sediada em <strong>Itajaí - Santa Catarina</strong>.</p>
        <p class="mb-3">Especializada em transformar brindes promocionais em ferramentas de autoridade de marca, oferecemos mais de 50 opções de produtos técnicos, canetas, squeezes, copos térmicos, mochilas, blocos ecológicos e kits executivos com personalização a laser de precisão, serigrafia e transfer digital.</p>
        <p class="mb-3">Atendemos empresas de todo o Brasil com condições comerciais facilitadas, faturamento corporativo para pessoas jurídicas e prazos de entrega rigorosamente pontuais.</p>
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px; margin-top: 12px; font-size: 12px;">
          📍 <strong>Endereço:</strong> Rua Brusque, 890 - Centro, Itajaí - SC<br>
          📞 <strong>Central:</strong> (47) 98496-5444 | contato@gordinhobrindes.com.br
        </div>
      `,
    },
    '/p/como-comprar': {
      title: 'Como Comprar e Orçar',
      content: `
        <div style="display: flex; flex-direction: column; gap: 14px; font-size: 13px;">
          <div style="display: flex; gap: 10px;">
            <span style="width: 28px; height: 28px; border-radius: 50%; background: #FAB818; color: #06180E; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">1</span>
            <div><strong>Escolha seus Brindes:</strong> Navegue pelo catálogo, selecione as quantidades e cores desejadas e monte sua sacola de orçamentos.</div>
          </div>
          <div style="display: flex; gap: 10px;">
            <span style="width: 28px; height: 28px; border-radius: 50%; background: #FAB818; color: #06180E; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">2</span>
            <div><strong>Envie a sua Logomarca:</strong> Encaminhe o arquivo da sua marca (vetor em AI, PDF ou PNG alta resolução) para nossa equipe de design.</div>
          </div>
          <div style="display: flex; gap: 10px;">
            <span style="width: 28px; height: 28px; border-radius: 50%; background: #FAB818; color: #06180E; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">3</span>
            <div><strong>Aprovação do Mockup Digital:</strong> Desenvolvemos uma maquete 3D virtual sem custos para você aprovar o posicionamento exato da gravação antes de iniciar a produção.</div>
          </div>
          <div style="display: flex; gap: 10px;">
            <span style="width: 28px; height: 28px; border-radius: 50%; background: #FAB818; color: #06180E; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">4</span>
            <div><strong>Produção e Envio Seguro:</strong> Produzimos seus brindes e enviamos com seguro de carga e código de rastreio para todo o território nacional.</div>
          </div>
        </div>
      `,
    },
    '/p/prazos-e-entrega': {
      title: 'Prazos de Produção e Frete',
      content: `
        <p class="mb-3">Nosso compromisso é com a pontualidade do seu evento ou ação de marketing:</p>
        <ul style="list-style-type: disc; padding-left: 20px; font-size: 13px; line-height: 1.6; margin-bottom: 12px;">
          <li><strong>Tempo de Produção:</strong> Média de 5 a 10 dias úteis após a aprovação do mockup virtual.</li>
          <li><strong>Pedidos Urgentes:</strong> Consulte nossa equipe via WhatsApp para opções com taxa de urgência (Fast-Track).</li>
          <li><strong>Transporte:</strong> Parceria com as principais transportadoras do país (Jadlog, Braspress, Correios e frete rodoviário dedicado).</li>
          <li><strong>Frete Grátis:</strong> Válido para pedidos corporativos acima de R$ 1.500,00 na região Sul e Sudeste.</li>
        </ul>
      `,
    },
    '/p/politica-de-privacidade': {
      title: 'Política de Privacidade e Proteção de Dados (LGPD)',
      content: `
        <p class="mb-3">A Gordinho Brindes respeita a privacidade de seus clientes e parceiros corporativos. Em conformidade com a LGPD (Lei nº 13.709/2018):</p>
        <ul style="list-style-type: disc; padding-left: 20px; font-size: 13px; line-height: 1.6;">
          <li>Os dados coletados (nome, CNPJ, telefone, e-mail) são utilizados estritamente para confecção de propostas, emissão de Notas Fiscais e contato operacional.</li>
          <li>Não comercializamos nem compartilhamos suas informações com terceiros não autorizados.</li>
          <li>Você pode solicitar a qualquer momento a exclusão ou atualização dos seus dados através do nosso canal de atendimento.</li>
        </ul>
      `,
    },
    '/p/termos-e-condicoes': {
      title: 'Termos e Condições Gerais',
      content: `
        <p class="mb-3">Condições gerais para fornecimento corporativo:</p>
        <ul style="list-style-type: disc; padding-left: 20px; font-size: 13px; line-height: 1.6;">
          <li>Os valores exibidos no catálogo consideram faixas progressivas por atacado e personalização em 1 cor / 1 posição (laser ou serigrafia).</li>
          <li>Cores adicionais ou gravações especiais podem ter acréscimo informado previamente na proposta comercial.</li>
          <li>A produção somente é iniciada após confirmação formal do pedido e validação do layout digital pelo cliente.</li>
        </ul>
      `,
    },
    '/cliente/pedidos': {
      title: 'Acompanhar Minhas Propostas & Pedidos',
      isTracker: true,
    },
    '/cliente/rastreio': {
      title: 'Rastrear Envio de Brindes',
      isTracker: true,
    },
  };

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="/p/"], a[href^="/cliente/"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (href === '/cliente/atendimento') {
      e.preventDefault();
      window.open(whatsappUrl(`Olá, gostaria de falar com o atendimento da ${db.getSettings().storeName}!`), '_blank');
      return;
    }

    const pageInfo = institutionalPages[href];
    if (pageInfo) {
      e.preventDefault();
      openInstitutionalModal(pageInfo);
    }
  });
}

function openInstitutionalModal({ title, content, isTracker }) {
  let modalBackdrop = document.getElementById('store-institutional-modal-backdrop');
  if (!modalBackdrop) {
    modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'store-institutional-modal-backdrop';
    modalBackdrop.className = 'admin-modal-backdrop';
    document.body.appendChild(modalBackdrop);
  }

  modalBackdrop.classList.remove('hidden');

  if (isTracker) {
    modalBackdrop.innerHTML = `
      <div class="admin-modal" onclick="event.stopPropagation()" style="max-width: 520px;">
        <div class="admin-modal-header" style="background: #06180E; color: #fff; border-bottom: 2px solid #FAB818;">
          <div>
            <span style="font-size: 11px; font-weight: 800; color: #FAB818; text-transform: uppercase;">Central do Cliente</span>
            <h2 style="font-size: 16px; font-weight: 700; margin: 2px 0 0 0; color: #fff;">${title}</h2>
          </div>
          <button type="button" id="btn-close-inst-modal" class="admin-btn admin-btn-secondary admin-btn-sm" style="color: #fff;">✕</button>
        </div>
        <div class="admin-modal-body" style="padding: 20px;">
          <p style="font-size: 13px; color: #64748B; margin-bottom: 14px;">
            Digite o número do seu pedido (ex: <strong>#PED-10842</strong>) ou seu telefone cadastrado para consultar o status em tempo real:
          </p>
          <div style="display: flex; gap: 8px; margin-bottom: 16px;">
            <input type="text" id="track-order-query" placeholder="Número do pedido ou WhatsApp" class="admin-input" style="flex: 1;">
            <button type="button" id="btn-search-order" class="admin-btn admin-btn-primary">
              Buscar
            </button>
          </div>
          <div id="track-results-container"></div>
        </div>
      </div>
    `;

    document.getElementById('btn-close-inst-modal')?.addEventListener('click', () => modalBackdrop.classList.add('hidden'));
    modalBackdrop.addEventListener('click', () => modalBackdrop.classList.add('hidden'));

    document.getElementById('btn-search-order')?.addEventListener('click', async () => {
      const q = document.getElementById('track-order-query')?.value.trim();
      const resContainer = document.getElementById('track-results-container');
      if (!q || !resContainer) return;

      let matches;
      try {
        matches = await db.trackOrders(q);
      } catch (err) {
        resContainer.innerHTML = `<div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 10px; padding: 14px; text-align: center; color: #991B1B; font-size: 13px;">${escapeHtml(err.message)}</div>`;
        return;
      }

      if (matches.length === 0) {
        resContainer.innerHTML = `
          <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 10px; padding: 14px; text-align: center; color: #991B1B; font-size: 13px;">
            Nenhum pedido encontrado com "${escapeHtml(q)}". Informe o número do pedido ou o WhatsApp completo com DDD, ou fale com nosso time no WhatsApp.
          </div>
        `;
      } else {
        resContainer.innerHTML = matches.map(o => `
          <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 14px; margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-weight: 800; color: #06180E; font-size: 14px;">#${escapeHtml(o.id)}</span>
              <span class="admin-status-badge ${o.status === 'Concluído' ? 'admin-status-completed' : o.status === 'Em Produção' ? 'admin-status-in-production' : 'admin-status-pending'}">
                ${escapeHtml(o.status)}
              </span>
            </div>
            <div style="font-size: 12px; color: #64748B;">Data: ${escapeHtml(o.date)}</div>
            <div style="font-size: 13px; font-weight: 700; color: #06180E; margin-top: 4px;">Total: R$ ${parseFloat(o.total).toFixed(2).replace('.', ',')}</div>
            <div style="font-size: 12px; color: #64748B; margin-top: 4px;">${o.itemCount} item(ns)${o.customerFirstName ? ` · Cliente: ${escapeHtml(o.customerFirstName)}` : ''}</div>
          </div>
        `).join('');
      }
    });

    return;
  }

  modalBackdrop.innerHTML = `
    <div class="admin-modal" onclick="event.stopPropagation()" style="max-width: 560px;">
      <div class="admin-modal-header" style="background: #06180E; color: #fff; border-bottom: 2px solid #FAB818;">
        <div>
          <span style="font-size: 11px; font-weight: 800; color: #FAB818; text-transform: uppercase;">Institucional Gordinho</span>
          <h2 style="font-size: 16px; font-weight: 700; margin: 2px 0 0 0; color: #fff;">${title}</h2>
        </div>
        <button type="button" id="btn-close-inst-modal" class="admin-btn admin-btn-secondary admin-btn-sm" style="color: #fff;">✕</button>
      </div>
      <div class="admin-modal-body" style="padding: 24px; font-size: 13.5px; line-height: 1.6; color: #334155;">
        ${content}
      </div>
      <div class="admin-modal-footer" style="padding: 14px 20px; background: #F8FAFC; border-top: 1px solid #E2E8F0; display: flex; justify-content: flex-end;">
        <button type="button" id="btn-close-inst-modal-2" class="admin-btn admin-btn-primary">
          Entendido
        </button>
      </div>
    </div>
  `;

  document.getElementById('btn-close-inst-modal')?.addEventListener('click', () => modalBackdrop.classList.add('hidden'));
  document.getElementById('btn-close-inst-modal-2')?.addEventListener('click', () => modalBackdrop.classList.add('hidden'));
  modalBackdrop.addEventListener('click', () => modalBackdrop.classList.add('hidden'));
}

// ------------------------------------------------------------------
// 12. HERO BANNER SLIDER
// ------------------------------------------------------------------
function setupHeroBannerSlider() {
  const bannerSection = document.querySelector('section[aria-roledescription="carousel"]');
  if (!bannerSection) return;

  const track = bannerSection.querySelector('.flex.-ml-0');
  const slides = bannerSection.querySelectorAll('[role="group"][aria-roledescription="slide"]');
  const prevBtn = bannerSection.querySelector('button[aria-label="Banner anterior"]');
  const nextBtn = bannerSection.querySelector('button[aria-label="Próximo banner"]');
  const dots = bannerSection.querySelectorAll('.absolute.bottom-2\\.5 button, .absolute.bottom-2 button, .absolute.bottom-6 button');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;

  function goToSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    track.style.transition = 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)';
    track.style.transform = `translate3d(-${currentIndex * 100}%, 0px, 0px)`;

    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add('bg-white', 'w-8');
        dot.classList.remove('bg-white/40', 'w-2');
      } else {
        dot.classList.remove('bg-white', 'w-8');
        dot.classList.add('bg-white/40', 'w-2');
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(currentIndex + 1);
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(i);
    });
  });

  let timer = setInterval(() => goToSlide(currentIndex + 1), 6000);
  bannerSection.addEventListener('mouseenter', () => clearInterval(timer));
  bannerSection.addEventListener('mouseleave', () => {
    clearInterval(timer);
    timer = setInterval(() => goToSlide(currentIndex + 1), 6000);
  });
}

// ------------------------------------------------------------------
// 13. PRODUCT CAROUSELS
// ------------------------------------------------------------------
function setupProductCarousels() {
  document.querySelectorAll('section[aria-labelledby]').forEach(section => {
    const prevBtn = section.querySelector('button[aria-label="Produto anterior"], button[aria-label="Anterior"]');
    const nextBtn = section.querySelector('button[aria-label="Próximo produto"], button[aria-label="Próximo"]');
    const container = section.querySelector('.overflow-x-auto, .overflow-hidden .flex');

    if (container && prevBtn && nextBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        container.scrollBy({ left: -320, behavior: 'smooth' });
      });
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        container.scrollBy({ left: 320, behavior: 'smooth' });
      });
    }
  });
}

// ------------------------------------------------------------------
// 14. FAQ ACCORDION
// ------------------------------------------------------------------
function setupFaqAccordion() {
  document.querySelectorAll('section[aria-labelledby="faq-heading"] button[aria-controls]').forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !isExpanded);

      const panelId = btn.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : btn.parentElement.querySelector('div[role="region"]');
      if (panel) {
        panel.style.display = isExpanded ? 'none' : 'block';
      }
    });
  });
}

// ------------------------------------------------------------------
// 15. COOKIE BANNER
// ------------------------------------------------------------------
function setupCookieBanner() {
  const cookieDialog = document.querySelector('div[role="dialog"][aria-label="Aviso de cookies"]');
  if (cookieDialog) {
    cookieDialog.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        cookieDialog.style.display = 'none';
        localStorage.setItem('gordinho_cookies_accepted', 'true');
      });
    });
    if (localStorage.getItem('gordinho_cookies_accepted') === 'true') {
      cookieDialog.style.display = 'none';
    }
  }
}

// ------------------------------------------------------------------
// 17. TOAST NOTIFICATION UTILITY
// ------------------------------------------------------------------
function showToast(message, type = 'success') {
  let container = document.getElementById('gordinho-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'gordinho-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `gordinho-toast gordinho-toast-${type}`;
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 200ms ease';
    setTimeout(() => toast.remove(), 250);
  }, 3500);
}
