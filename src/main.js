import { db } from './db.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Coconut Ice initialized with full interactive capabilities');

  // --- 0. Dynamic Sync with Database ---
  syncStorefrontWithDB();
  db.subscribe(() => {
    syncStorefrontWithDB();
  });

  function syncStorefrontWithDB() {
    const settings = db.getSettings();

    // 0.1 Update top announcement
    const announcementEl = document.querySelector('.bg-\\[\\#F7E8DF\\] .text-\\[\\#A96739\\]');
    if (announcementEl && settings.announcementText) {
      announcementEl.textContent = settings.announcementText;
    }

    // 0.2 Update Cashback popup texts
    const cashbackTitles = document.querySelectorAll('#entry-popup-title');
    cashbackTitles.forEach(title => {
      title.innerHTML = `Ganhe <span class="italic text-[#F1D7C2]">${settings.cashbackPercent}% de cashback</span>`;
    });

    // 0.3 Update product cards based on DB
    const products = db.getProducts();
    products.forEach(p => {
      const allH3 = document.querySelectorAll('h3');
      allH3.forEach(h3 => {
        if (h3.textContent.trim().toUpperCase() === p.name.toUpperCase() || (p.sku && h3.textContent.includes(p.sku))) {
          const card = h3.closest('.flex.flex-1.flex-col')?.parentElement || h3.closest('[data-listing-product-id]');
          if (card) {
            const priceEl = card.querySelector('.text-xl.md\\:text-3xl.font-extrabold');
            if (priceEl) {
              priceEl.textContent = `R$ ${parseFloat(p.basePrice).toFixed(2).replace('.', ',')}`;
            }
          }
        }
      });
    });
  }

  // --- 1. Entry Popup / Banner (Cashback Oferta de Boas-Vindas) ---
  const entryPopup = document.getElementById('entry-popup');
  const closePopupBtn = document.getElementById('btn-close-entry-popup');
  const claimBtn = document.getElementById('btn-claim-cashback');
  const continueBtn = document.getElementById('btn-continue-browsing');

  function openEntryPopup() {
    if (entryPopup) {
      entryPopup.style.display = 'flex';
      entryPopup.classList.remove('hidden');
    }
  }

  function closeEntryPopup() {
    if (entryPopup) {
      entryPopup.style.display = 'none';
      entryPopup.classList.add('hidden');
    }
  }

  // 1.1 Close when clicking on the X button
  if (closePopupBtn) {
    closePopupBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeEntryPopup();
    });
  }

  // Also bind all close buttons inside entryPopup
  if (entryPopup) {
    entryPopup.querySelectorAll('button[aria-label="Fechar"], .lucide-x').forEach(el => {
      const btn = el.closest('button') || el;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeEntryPopup();
      });
    });
  }

  // 1.2 Close when clicking OUTSIDE the banner card (on the backdrop overlay)
  if (entryPopup) {
    entryPopup.addEventListener('click', (e) => {
      const card = entryPopup.querySelector('.relative.w-full') || entryPopup.firstElementChild;
      if (e.target === entryPopup || (card && !card.contains(e.target))) {
        closeEntryPopup();
      }
    });

    const card = entryPopup.querySelector('.relative.w-full');
    if (card) {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('button[aria-label="Fechar"], #btn-close-entry-popup, #btn-continue-browsing, #btn-claim-cashback')) {
          e.stopPropagation();
        }
      });
    }
  }

  // 1.3 Close when clicking action buttons
  if (claimBtn) {
    claimBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeEntryPopup();
    });
  }

  if (continueBtn) {
    continueBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeEntryPopup();
    });
  }

  // PT button toggles EntryPopup
  const allButtons = document.querySelectorAll('button');
  allButtons.forEach(btn => {
    if (btn.textContent.trim() === 'PT' || btn.querySelector('span[translate="no"]')?.textContent.trim() === 'PT') {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (entryPopup && entryPopup.style.display !== 'none' && !entryPopup.classList.contains('hidden')) {
          closeEntryPopup();
        } else {
          openEntryPopup();
        }
      });
    }
    if (btn.textContent.includes('Central de Atendimento')) {
      btn.addEventListener('click', () => {
        closeEntryPopup();
      });
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeEntryPopup();
      closeMobileDrawer();
      closeMobileSearch();
      closeMegaMenu();
      closeOrderModal();
      closeCartDrawer();
    }
  });

  // --- 2. PRODUTOS MegaMenu ---
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

  allButtons.forEach(btn => {
    const text = btn.textContent.trim().toUpperCase();
    if (text.startsWith('PRODUTOS') || btn.classList.contains('nav-link') && text.includes('PRODUTOS')) {
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

  // --- 3. Mobile Navigation Drawer ("Abrir menu") ---
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
    if (openMenuBtn) {
      openMenuBtn.setAttribute('aria-expanded', 'true');
      openMenuBtn.setAttribute('data-state', 'open');
    }
  }

  function closeMobileDrawer() {
    if (mobileDrawerBackdrop) mobileDrawerBackdrop.classList.add('hidden');
    if (mobileDrawer) {
      mobileDrawer.classList.add('closed');
      mobileDrawer.setAttribute('data-state', 'closed');
    }
    if (openMenuBtn) {
      openMenuBtn.setAttribute('aria-expanded', 'false');
      openMenuBtn.setAttribute('data-state', 'closed');
    }
  }

  if (openMenuBtn) openMenuBtn.addEventListener('click', openMobileDrawer);
  if (closeMobileDrawerBtn) closeMobileDrawerBtn.addEventListener('click', closeMobileDrawer);
  if (mobileDrawerBackdrop) mobileDrawerBackdrop.addEventListener('click', closeMobileDrawer);

  // --- 4. Mobile Search Dialog ("Buscar produtos") ---
  const mobileSearchBackdrop = document.getElementById('mobile-search-backdrop');
  const mobileSearchDialog = document.getElementById('mobile-search-dialog');
  const closeMobileSearchBtn = document.getElementById('btn-close-mobile-search');
  const mobileSearchInput = document.getElementById('mobile-search-input');

  function openMobileSearch() {
    if (mobileSearchBackdrop) mobileSearchBackdrop.classList.remove('hidden');
    if (mobileSearchDialog) mobileSearchDialog.classList.remove('hidden');
    if (mobileSearchInput) {
      setTimeout(() => mobileSearchInput.focus(), 100);
    }
  }

  function closeMobileSearch() {
    if (mobileSearchBackdrop) mobileSearchBackdrop.classList.add('hidden');
    if (mobileSearchDialog) mobileSearchDialog.classList.add('hidden');
  }

  if (closeMobileSearchBtn) closeMobileSearchBtn.addEventListener('click', closeMobileSearch);
  if (mobileSearchBackdrop) mobileSearchBackdrop.addEventListener('click', closeMobileSearch);

  const searchInputs = document.querySelectorAll('input[placeholder="Buscar produtos"]');
  searchInputs.forEach(input => {
    input.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        openMobileSearch();
      }
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = input.value.trim().toLowerCase();
        if (query) {
          const matchingH3 = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.toLowerCase().includes(query));
          if (matchingH3) {
            matchingH3.scrollIntoView({ behavior: 'smooth', block: 'center' });
            closeMobileSearch();
          }
        }
      }
    });
  });

  const searchButtons = document.querySelectorAll('button');
  searchButtons.forEach(btn => {
    if (btn.getAttribute('aria-label') === 'Buscar produtos' || btn.querySelector('svg.lucide-search')) {
      btn.addEventListener('click', () => {
        if (window.innerWidth < 1024) {
          openMobileSearch();
        }
      });
    }
  });

  const searchTags = document.querySelectorAll('.search-tag');
  searchTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const term = tag.textContent.trim();
      if (mobileSearchInput) mobileSearchInput.value = term;
      const matchingH3 = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.toLowerCase().includes(term.toLowerCase()));
      if (matchingH3) {
        matchingH3.scrollIntoView({ behavior: 'smooth', block: 'center' });
        closeMobileSearch();
      }
    });
  });

  // --- 5. Product Card "Detalhes" Accordion ---
  const allDetalhesButtons = document.querySelectorAll('button');
  allDetalhesButtons.forEach(btn => {
    if (btn.textContent.trim().startsWith('Detalhes')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !isExpanded);
        
        const svg = btn.querySelector('svg');
        if (svg) {
          if (!isExpanded) {
            svg.classList.add('rotate-180');
          } else {
            svg.classList.remove('rotate-180');
          }
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

  // --- 6. Product Card "Preço por quantidade" Accordion & Tier Selection ---
  allButtons.forEach(btn => {
    const text = btn.textContent.toLowerCase();
    if (text.includes('preço por qtd') || text.includes('preço por quantidade')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !isExpanded);

        const svg = btn.querySelector('svg.lucide-chevron-down');
        if (svg) {
          if (!isExpanded) {
            svg.classList.add('rotate-180');
          } else {
            svg.classList.remove('rotate-180');
          }
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

  const tierButtons = document.querySelectorAll('.grid.transition-\\[grid-template-rows\\,opacity\\,margin\\] button');
  tierButtons.forEach(tierBtn => {
    tierBtn.addEventListener('click', (e) => {
      e.preventDefault();
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

  // --- 7. Cookie Consent Banner ---
  const cookieDialog = document.querySelector('div[role="dialog"][aria-label="Aviso de cookies"]');
  if (cookieDialog) {
    const cookieButtons = cookieDialog.querySelectorAll('button');
    cookieButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        cookieDialog.style.display = 'none';
      });
    });
  }

  // --- 8. FAQ Accordion ---
  const faqButtons = document.querySelectorAll('section[aria-labelledby="faq-heading"] button[aria-controls]');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !isExpanded);

      const panelId = btn.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : btn.parentElement.querySelector('div[role="region"]');
      if (panel) {
        if (!isExpanded) {
          panel.style.display = 'block';
        } else {
          panel.style.display = 'none';
        }
      }
    });
  });

  // --- 9. Hero Banner Slider & Auto-rotation ---
  setupHeroBannerSlider();

  // --- 10. Carousel Sliders (Mais Vendidos, Destaques, Lançamentos, Testemunhos) ---
  setupProductCarousels();

  // --- 11. Product Favorite Heart Toggle ---
  setupFavorites();

  // --- 12. Product Color Swatches ---
  setupColorSwatches();

  // --- 13. Shopping Cart Drawer ---
  setupCartDrawer();

  // --- 14. Interactive Order / Quote Modal ---
  setupProductOrderFlow();

  // --- 15. Inject Floating Admin Launcher (Bottom-Left) ---
  injectAdminLauncher();
});

// ------------------------------------------------------------------
// HERO BANNER SLIDER
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

  let timer = setInterval(() => {
    goToSlide(currentIndex + 1);
  }, 6000);

  bannerSection.addEventListener('mouseenter', () => clearInterval(timer));
  bannerSection.addEventListener('mouseleave', () => {
    clearInterval(timer);
    timer = setInterval(() => goToSlide(currentIndex + 1), 6000);
  });
}

// ------------------------------------------------------------------
// PRODUCT & SECTION CAROUSELS
// ------------------------------------------------------------------
function setupProductCarousels() {
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    const prevBtn = section.querySelector('button[aria-label="Anterior"]');
    const nextBtn = section.querySelector('button[aria-label="Próximo"]');

    if (!prevBtn || !nextBtn) return;

    const scrollContainer = section.querySelector('.overflow-x-auto') || 
                            section.querySelector('.overflow-hidden > .flex') ||
                            section.querySelector('[role="region"]') ||
                            section.querySelector('.flex.gap-2\\.5');

    if (scrollContainer) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        scrollContainer.scrollBy({ left: -320, behavior: 'smooth' });
      });

      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        scrollContainer.scrollBy({ left: 320, behavior: 'smooth' });
      });
    }
  });
}

// ------------------------------------------------------------------
// FAVORITES (HEART BUTTONS)
// ------------------------------------------------------------------
function setupFavorites() {
  const favButtons = document.querySelectorAll('button[aria-label="Salvar nos favoritos"]');
  favButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isPressed = btn.getAttribute('aria-pressed') === 'true';
      btn.setAttribute('aria-pressed', !isPressed);

      const svg = btn.querySelector('svg');
      if (svg) {
        if (!isPressed) {
          svg.style.fill = '#A96739';
          svg.style.stroke = '#A96739';
          btn.style.transform = 'scale(1.2)';
          setTimeout(() => btn.style.transform = '', 200);
        } else {
          svg.style.fill = 'none';
          svg.style.stroke = 'currentColor';
        }
      }
    });
  });
}

// ------------------------------------------------------------------
// COLOR SWATCHES
// ------------------------------------------------------------------
function setupColorSwatches() {
  const colorButtons = document.querySelectorAll('button[aria-label^="Ver na cor"]');
  colorButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parent = btn.parentElement;
      if (parent) {
        parent.querySelectorAll('button').forEach(b => {
          b.classList.remove('ring-2', 'ring-primary', 'scale-110');
        });
      }
      btn.classList.add('ring-2', 'ring-primary', 'scale-110');
    });
  });
}

// ------------------------------------------------------------------
// SHOPPING CART DRAWER
// ------------------------------------------------------------------
function setupCartDrawer() {
  const cartButtons = document.querySelectorAll('button[aria-label="Carrinho"]');
  if (cartButtons.length === 0) return;

  let drawer = document.getElementById('coconut-cart-drawer');
  if (!drawer) {
    drawer = document.createElement('div');
    drawer.id = 'coconut-cart-drawer';
    drawer.className = 'fixed inset-0 z-[120] flex justify-end bg-black/40 backdrop-blur-sm transition-opacity duration-300 hidden';
    drawer.innerHTML = `
      <div class="relative w-full max-w-[420px] h-full bg-[#FDFBF9] shadow-2xl flex flex-col" onclick="event.stopPropagation()">
        <!-- Header -->
        <div class="p-5 border-b border-[#E8E2D9] flex items-center justify-between bg-white">
          <div class="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A96739" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            <h2 class="font-bold text-base text-[#27211D]">Sua Sacola de Orçamentos</h2>
          </div>
          <button id="btn-close-cart" class="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        <!-- Cart Items List -->
        <div class="flex-1 p-5 overflow-y-auto divide-y divide-gray-100" id="cart-items-container">
        </div>

        <!-- Footer / Checkout -->
        <div class="p-5 border-t border-[#E8E2D9] bg-white">
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs text-gray-500 uppercase font-bold tracking-wider">Subtotal estimado</span>
            <span class="text-lg font-extrabold text-[#3E7921]" id="cart-subtotal">R$ 1.425,00</span>
          </div>
          <div class="text-[11px] text-[#3E7921] font-semibold flex items-center gap-1.5 mb-4">
            <span>✓</span> Frete Grátis e 5% de desconto no Pix aplicáveis
          </div>
          <button id="btn-cart-checkout" class="w-full bg-[#A96739] hover:bg-[#8f5530] text-white font-bold py-3.5 rounded-full text-xs uppercase tracking-widest transition-colors shadow-md">
            Solicitar Proposta Comercial
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);

    drawer.addEventListener('click', closeCartDrawer);
    document.getElementById('btn-close-cart')?.addEventListener('click', closeCartDrawer);

    document.getElementById('btn-cart-checkout')?.addEventListener('click', () => {
      closeCartDrawer();
      const products = db.getProducts();
      openOrderModal(products[0]);
    });
  }

  cartButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });
}

function openCartDrawer() {
  const drawer = document.getElementById('coconut-cart-drawer');
  if (!drawer) return;

  const itemsContainer = document.getElementById('cart-items-container');
  const products = db.getProducts();
  const sampleProduct = products[0] || { name: 'Squeeze Alumínio 650ml', basePrice: 14.25 };

  if (itemsContainer) {
    itemsContainer.innerHTML = `
      <div class="py-4 flex gap-3 items-center">
        <img src="${sampleProduct.image || '/favicon.png'}" alt="${sampleProduct.name}" class="h-16 w-16 object-contain rounded-xl border border-gray-200 bg-white p-1">
        <div class="flex-1 min-w-0">
          <h4 class="font-bold text-xs text-[#27211D] truncate">${sampleProduct.name}</h4>
          <p class="text-[11px] text-gray-500">100 unidades · Gravação a Laser</p>
          <div class="text-xs font-bold text-[#3E7921] mt-1">R$ 14,25 / un.</div>
        </div>
        <div class="font-extrabold text-sm text-[#27211D]">R$ 1.425,00</div>
      </div>
    `;
  }

  drawer.classList.remove('hidden');
}

function closeCartDrawer() {
  const drawer = document.getElementById('coconut-cart-drawer');
  if (drawer) {
    drawer.classList.add('hidden');
  }
}

// ------------------------------------------------------------------
// INTERACTIVE ORDER / QUOTE MODAL
// ------------------------------------------------------------------
function setupProductOrderFlow() {
  const verMaisLinks = document.querySelectorAll('a');
  verMaisLinks.forEach(link => {
    if (link.textContent.includes('Ver mais') || link.querySelector('span')?.textContent.includes('Ver mais')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const card = link.closest('[data-listing-product-id]') || link.closest('.group');
        const titleEl = card ? card.querySelector('h3') : null;
        const productName = titleEl ? titleEl.textContent.trim() : 'Produto Personalizado';
        const imgEl = card ? card.querySelector('img') : null;
        const imgSrc = imgEl ? imgEl.src : '/assets/logo-Mmxs5xoc.webp';

        const products = db.getProducts();
        const matchedProduct = products.find(p => p.name.toUpperCase() === productName.toUpperCase()) || {
          id: 'prod-' + Date.now(),
          name: productName,
          basePrice: 14.25,
          image: imgSrc,
          sku: 'CB' + Math.floor(1000 + Math.random() * 9000),
        };

        openOrderModal(matchedProduct);
      });
    }
  });
}

function openOrderModal(product) {
  let modalBackdrop = document.getElementById('store-order-modal-backdrop');
  if (!modalBackdrop) {
    modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'store-order-modal-backdrop';
    modalBackdrop.className = 'admin-modal-backdrop';
    document.body.appendChild(modalBackdrop);
  }

  let selectedQty = 100;
  let unitPrice = product.basePrice || 14.25;

  function calcTotal() {
    return (selectedQty * unitPrice).toFixed(2).replace('.', ',');
  }

  modalBackdrop.classList.remove('hidden');
  modalBackdrop.innerHTML = `
    <div class="admin-modal" onclick="event.stopPropagation()" style="max-width: 520px;">
      <div class="admin-modal-header" style="background: #FDFBF9;">
        <div>
          <span style="font-size: 10px; font-weight: 700; color: #A96739; text-transform: uppercase; letter-spacing: 0.1em;">Solicitar Orçamento / Pedido</span>
          <h2 style="font-size: 16px; font-weight: 700; margin: 2px 0 0 0; color: #27211D;">${product.name}</h2>
        </div>
        <button type="button" id="btn-close-store-modal" class="admin-btn admin-btn-secondary admin-btn-sm" style="padding: 4px 8px;">✕</button>
      </div>

      <form id="store-order-form" class="admin-modal-body">
        <div style="display: flex; gap: 14px; align-items: center; background: #FAF7F4; border: 1px solid #E8E2D9; border-radius: 12px; padding: 12px; margin-bottom: 16px;">
          <img src="${product.image}" alt="${product.name}" style="width: 56px; height: 56px; object-fit: contain; border-radius: 8px; background: #fff;">
          <div>
            <div style="font-size: 11px; color: #786C65; font-weight: 600;">SKU: ${product.sku || 'N/A'}</div>
            <div style="font-size: 14px; font-weight: 700; color: #3E7921;">R$ ${parseFloat(unitPrice).toFixed(2).replace('.', ',')} / un.</div>
            <div style="font-size: 11px; color: #786C65;">Desconto progressivo aplicado para atacado</div>
          </div>
        </div>

        <div class="admin-form-group">
          <label class="admin-form-label">Quantidade de Peças</label>
          <div style="display: flex; gap: 8px;">
            ${[50, 100, 250, 500].map(q => `
              <button type="button" class="admin-btn ${q === 100 ? 'admin-btn-primary' : 'admin-btn-secondary'} admin-btn-sm btn-qty-select" data-qty="${q}" style="flex: 1;">
                ${q} un.
              </button>
            `).join('')}
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="admin-form-group">
            <label class="admin-form-label">Seu Nome *</label>
            <input type="text" id="order-cust-name" class="admin-input" required placeholder="Ex: Ana Silva">
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Nome da Empresa</label>
            <input type="text" id="order-cust-company" class="admin-input" placeholder="Ex: Google Brasil">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="admin-form-group">
            <label class="admin-form-label">WhatsApp / Telefone *</label>
            <input type="text" id="order-cust-phone" class="admin-input" required placeholder="(11) 99999-9999">
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">E-mail Corporativo *</label>
            <input type="email" id="order-cust-email" class="admin-input" required placeholder="contato@empresa.com">
          </div>
        </div>

        <div class="admin-form-group">
          <label class="admin-form-label">Instruções para Personalização</label>
          <input type="text" id="order-notes" class="admin-input" placeholder="Ex: Gravar logotipo em 1 cor frontal">
        </div>

        <div style="background: #eaf3e6; border: 1px solid #cce4c5; border-radius: 10px; padding: 12px; display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
          <div>
            <div style="font-size: 11px; color: #3E7921; font-weight: 600;">VALOR ESTIMADO DO PEDIDO</div>
            <div style="font-size: 11px; color: #5a7d50;">5% de desconto no Pix ou em até 10x sem juros</div>
          </div>
          <div id="modal-order-total" style="font-size: 18px; font-weight: 800; color: #3E7921;">
            R$ ${calcTotal()}
          </div>
        </div>
      </form>

      <div class="admin-modal-footer">
        <button type="button" id="btn-cancel-store-modal" class="admin-btn admin-btn-secondary">Cancelar</button>
        <button type="button" id="btn-submit-store-order" class="admin-btn admin-btn-primary">
          Confirmar Solicitação
        </button>
      </div>
    </div>
  `;

  document.getElementById('btn-close-store-modal')?.addEventListener('click', closeOrderModal);
  document.getElementById('btn-cancel-store-modal')?.addEventListener('click', closeOrderModal);
  modalBackdrop.addEventListener('click', closeOrderModal);

  modalBackdrop.querySelectorAll('.btn-qty-select').forEach(btn => {
    btn.addEventListener('click', () => {
      modalBackdrop.querySelectorAll('.btn-qty-select').forEach(b => {
        b.classList.remove('admin-btn-primary');
        b.classList.add('admin-btn-secondary');
      });
      btn.classList.add('admin-btn-primary');
      btn.classList.remove('admin-btn-secondary');
      selectedQty = parseInt(btn.getAttribute('data-qty'), 10);
      document.getElementById('modal-order-total').textContent = `R$ ${calcTotal()}`;
    });
  });

  document.getElementById('btn-submit-store-order')?.addEventListener('click', () => {
    const name = document.getElementById('order-cust-name').value.trim();
    const phone = document.getElementById('order-cust-phone').value.trim();
    const email = document.getElementById('order-cust-email').value.trim();
    const company = document.getElementById('order-cust-company').value.trim();
    const notes = document.getElementById('order-notes').value.trim();

    if (!name || !phone || !email) {
      alert('Por favor, preencha nome, whatsapp e e-mail para prosseguir.');
      return;
    }

    const total = parseFloat((selectedQty * unitPrice).toFixed(2));

    const newOrder = db.addOrder({
      customer: { name, company, phone, email },
      items: [
        { productId: product.id, name: product.name, quantity: selectedQty, unitPrice, total }
      ],
      total,
      paymentMethod: 'Pix à vista (5% OFF)',
      notes: notes || 'Gravação padrão com arte enviada pelo cliente.',
    });

    modalBackdrop.innerHTML = `
      <div class="admin-modal" onclick="event.stopPropagation()" style="max-width: 480px; text-align: center; padding: 32px 24px;">
        <div style="width: 54px; height: 54px; border-radius: 50%; background: #eaf3e6; color: #3E7921; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style="font-size: 20px; font-weight: 700; color: #27211D; margin: 0 0 8px 0;">Pedido Registrado com Sucesso!</h2>
        <p style="font-size: 13px; color: #786C65; margin: 0 0 18px 0; line-height: 1.5;">
          O pedido <strong>#${newOrder.id}</strong> foi gravado no banco de dados da Coconut Ice e já está visível para acompanhamento no Painel Administrativo.
        </p>

        <div style="display: flex; gap: 10px; justify-content: center;">
          <button type="button" class="admin-btn admin-btn-secondary" onclick="document.getElementById('store-order-modal-backdrop').remove()">
            Continuar no Site
          </button>
          <a href="/admin.html" class="admin-btn admin-btn-primary">
            Ver no Painel Admin →
          </a>
        </div>
      </div>
    `;
  });
}

function closeOrderModal() {
  const modal = document.getElementById('store-order-modal-backdrop');
  if (modal) {
    modal.classList.add('hidden');
  }
}

// ------------------------------------------------------------------
// INJECT FLOATING ADMIN LAUNCHER (BOTTOM-LEFT)
// ------------------------------------------------------------------
function injectAdminLauncher() {
  if (document.getElementById('coconut-floating-admin')) return;

  const launcher = document.createElement('a');
  launcher.id = 'coconut-floating-admin';
  launcher.href = '/admin.html';
  launcher.className = 'coconut-admin-launcher';
  launcher.title = 'Acessar Painel de Controle e Banco de Dados';
  launcher.innerHTML = `
    <span class="badge-pulse"></span>
    <span>⚙️ Painel Admin</span>
  `;
  document.body.appendChild(launcher);
}
