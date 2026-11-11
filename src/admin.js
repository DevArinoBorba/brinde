// Gordinho Brindes — Admin Management Panel Controller
import { db } from './db.js';

let currentTab = 'dashboard';
let editingProductId = null;
let subscribed = false;

export async function initAdmin(containerId = 'admin-app-root') {
  const container = document.getElementById(containerId);
  if (!container) return;

  await db.ready;

  if (!subscribed) {
    subscribed = true;
    // Subscribe to DB updates (uma vez só, mesmo após sair e entrar de novo)
    db.subscribe(() => {
      if (!db.isAuthenticated()) {
        // Sessão expirou ou foi encerrada: volta para a tela de PIN
        if (!container.querySelector('#admin-auth-form')) renderAuthScreen(container);
        return;
      }
      renderCurrentTab();
    });
    db.onError((message) => showToast(message, 'error'));
  }

  if (!db.isAuthenticated()) {
    renderAuthScreen(container);
    return;
  }

  renderAdmin(container);
}

// ----------------------------------------------------
// 0. AUTH SCREEN (PIN DE SEGURANÇA 2026)
// ----------------------------------------------------
function renderAuthScreen(container) {
  container.innerHTML = `
    <div class="admin-auth-overlay">
      <div class="admin-auth-card">
        <img src="/assets/mascot.png" alt="Mascote Gordinho Brindes" class="auth-logo-img" onerror="this.src='/favicon.png'">
        <h2 class="auth-title">Gordinho <span>Brindes</span></h2>
        <p class="auth-subtitle">Painel Administrativo & Central de Catálogo 2026</p>

        <form id="admin-auth-form" class="auth-form" autocomplete="off">
          <div class="admin-form-group">
            <label for="admin-auth-pin" class="admin-form-label" style="color: #D2E4D8; text-align: center;">Digite o PIN de Acesso</label>
            <div class="auth-input-wrap">
              <input type="password" id="admin-auth-pin" class="auth-input" placeholder="••••" maxlength="12" required autofocus>
            </div>
          </div>

          <div id="admin-auth-error" class="auth-error">PIN incorreto. Tente novamente.</div>

          <button type="submit" class="btn-auth-submit">
            <span>Acessar Painel</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </form>

        <a href="/" class="auth-back-link">&larr; Voltar para a Loja Pública</a>
      </div>
    </div>
  `;

  const form = container.querySelector('#admin-auth-form');
  const pinInput = container.querySelector('#admin-auth-pin');
  const errorMsg = container.querySelector('#admin-auth-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pin = pinInput.value.trim();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    const res = await db.login(pin);
    submitBtn.disabled = false;
    if (res.success) {
      renderAdmin(container);
    } else {
      errorMsg.textContent = res.error || 'PIN incorreto. Tente novamente.';
      errorMsg.style.display = 'block';
      pinInput.value = '';
      pinInput.focus();
    }
  });
}

// ----------------------------------------------------
// 1. RENDER MAIN ADMIN INTERFACE
// ----------------------------------------------------
function renderAdmin(container) {
  const settings = db.getSettings();

  container.innerHTML = `
    <div class="admin-layout">
      <!-- Mobile Backdrop -->
      <div class="admin-mobile-backdrop" id="admin-mobile-backdrop"></div>

      <!-- Sidebar -->
      <aside class="admin-sidebar" id="admin-sidebar">
        <div class="admin-sidebar-header">
          <img src="/assets/mascot.png" alt="Gordinho Brindes" onerror="this.src='/favicon.png'">
          <div>
            <div style="font-weight: 900; font-family: var(--admin-font-heading); font-size: 15px; color: #FFFFFF; line-height: 1.1;">
              GORDINHO <span style="color: var(--admin-primary);">BRINDES</span>
            </div>
            <span class="admin-brand-tag">Central de Controle</span>
          </div>
        </div>

        <nav class="admin-nav">
          <button class="admin-nav-item ${currentTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            Visão Geral
          </button>
          
          <button class="admin-nav-item ${currentTab === 'products' ? 'active' : ''}" data-tab="products">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
            Produtos & Estoque (${db.getProducts().length})
          </button>

          <button class="admin-nav-item ${currentTab === 'orders' ? 'active' : ''}" data-tab="orders">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            Pedidos & Vendas
          </button>

          <button class="admin-nav-item ${currentTab === 'categories' ? 'active' : ''}" data-tab="categories">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><circle cx="7" cy="7" r=".5" fill="currentColor"/></svg>
            Categorias
          </button>

          <button class="admin-nav-item ${currentTab === 'settings' ? 'active' : ''}" data-tab="settings">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            Configurações & CMS
          </button>

        </nav>

        <div class="admin-sidebar-footer">
          <a href="/" class="admin-btn admin-btn-secondary" style="width: 100%; font-size: 12px; background: rgba(255, 255, 255, 0.08); color: #FFFFFF; border-color: rgba(255, 255, 255, 0.15);">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Voltar para a Loja
          </a>
          <button id="btn-admin-logout" class="admin-btn admin-btn-danger admin-btn-sm" style="width: 100%; font-size: 11px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sair do Painel
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="admin-main">
        <header class="admin-topbar">
          <div style="display: flex; align-items: center; gap: 14px;">
            <button id="admin-mobile-menu-toggle" class="admin-btn admin-btn-secondary admin-btn-sm" aria-label="Abrir menu" style="display: none;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <h1 id="admin-top-title" style="font-family: var(--admin-font-heading); font-size: 18px; font-weight: 800; margin: 0; color: #0F172A;">
              Painel de Controle
            </h1>
          </div>

          <div style="display: flex; align-items: center; gap: 10px;">
            <button id="btn-quick-new-product" class="admin-btn admin-btn-primary admin-btn-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Novo Produto
            </button>

            <button id="btn-quick-new-order" class="admin-btn admin-btn-forest admin-btn-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Novo Pedido
            </button>

            <a href="/" target="_blank" class="admin-btn admin-btn-secondary admin-btn-sm" title="Abrir catálogo em nova aba">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Ver Loja
            </a>
          </div>
        </header>

        <div class="admin-content" id="admin-tab-content">
          <!-- Dynamically filled by renderCurrentTab() -->
        </div>
      </main>
    </div>

    <!-- Modals Container -->
    <div id="admin-modals-container"></div>
    <div class="admin-toast-container" id="admin-toasts"></div>
  `;

  // Attach navigation events
  container.querySelectorAll('.admin-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      switchTab(tab);
      closeMobileSidebar();
    });
  });

  // Mobile drawer toggle
  const mobileToggle = container.querySelector('#admin-mobile-menu-toggle');
  const sidebar = container.querySelector('#admin-sidebar');
  const backdrop = container.querySelector('#admin-mobile-backdrop');

  function openMobileSidebar() {
    sidebar.classList.add('open');
    backdrop.classList.add('open');
  }

  function closeMobileSidebar() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('open');
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileSidebar);
  if (backdrop) backdrop.addEventListener('click', closeMobileSidebar);

  // Quick action buttons in header
  container.querySelector('#btn-quick-new-product')?.addEventListener('click', () => openProductModal());
  container.querySelector('#btn-quick-new-order')?.addEventListener('click', () => openManualOrderModal());
  container.querySelector('#btn-admin-logout')?.addEventListener('click', () => {
    if (confirm('Deseja encerrar a sessão do painel?')) {
      db.logout();
      renderAuthScreen(container);
    }
  });

  renderCurrentTab();
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.admin-nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
  });
  renderCurrentTab();
}

function renderCurrentTab() {
  const contentEl = document.getElementById('admin-tab-content');
  if (!contentEl) return;

  const titleEl = document.getElementById('admin-top-title');

  switch (currentTab) {
    case 'dashboard':
      if (titleEl) titleEl.textContent = 'Visão Geral & Métricas';
      renderDashboardView(contentEl);
      break;
    case 'products':
      if (titleEl) titleEl.textContent = 'Gerenciamento de Produtos & Estoque';
      renderProductsView(contentEl);
      break;
    case 'orders':
      if (titleEl) titleEl.textContent = 'Pedidos & Orçamentos Recebidos';
      renderOrdersView(contentEl);
      break;
    case 'categories':
      if (titleEl) titleEl.textContent = 'Categorias de Produtos';
      renderCategoriesView(contentEl);
      break;
    case 'settings':
      if (titleEl) titleEl.textContent = 'Configurações da Loja & Conteúdo';
      renderSettingsView(contentEl);
      break;
  }
}

// ----------------------------------------------------
// 2. DASHBOARD VIEW
// ----------------------------------------------------
function renderDashboardView(container) {
  const metrics = db.getMetrics();
  const recentOrders = db.getOrders().slice(0, 6);

  container.innerHTML = `
    <!-- KPI Metrics -->
    <div class="admin-metrics-grid">
      <div class="admin-metric-card">
        <div>
          <div class="admin-metric-label">Faturamento Total</div>
          <div class="admin-metric-value" style="color: #16A34A;">R$ ${metrics.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          <div style="font-size: 11px; color: #16A34A; font-weight: 700; margin-top: 4px;">↑ Em pedidos corporativos</div>
        </div>
        <div class="admin-metric-icon" style="background: #eaf5ea; color: #16A34A;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
      </div>

      <div class="admin-metric-card">
        <div>
          <div class="admin-metric-label">Pedidos Registrados</div>
          <div class="admin-metric-value">${metrics.totalOrders}</div>
          <div style="font-size: 11px; color: #B45309; font-weight: 600; margin-top: 4px;">${metrics.pendingOrders} pendentes · ${metrics.inProductionOrders} em produção</div>
        </div>
        <div class="admin-metric-icon" style="background: rgba(250, 184, 24, 0.18); color: #B45309;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        </div>
      </div>

      <div class="admin-metric-card">
        <div>
          <div class="admin-metric-label">Produtos no Catálogo</div>
          <div class="admin-metric-value">${metrics.totalProducts}</div>
          <div style="font-size: 11px; color: #0F3822; font-weight: 600; margin-top: 4px;">${metrics.activeProducts} ativos · ${metrics.totalCategories} categorias</div>
        </div>
        <div class="admin-metric-icon" style="background: rgba(15, 56, 34, 0.1); color: #0F3822;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg>
        </div>
      </div>

      <div class="admin-metric-card">
        <div>
          <div class="admin-metric-label">Ticket Médio</div>
          <div class="admin-metric-value">R$ ${metrics.avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div style="font-size: 11px; color: #64748B; margin-top: 4px;">Por solicitação de orçamento</div>
        </div>
        <div class="admin-metric-icon" style="background: #f1f5f9; color: #475569;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
      </div>
    </div>

    <!-- Quick Actions Banner -->
    <div class="admin-card" style="background: linear-gradient(135deg, #0F3822 0%, #06180E 100%); border-color: rgba(250, 184, 24, 0.25); color: #FFFFFF;">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; background: rgba(250, 184, 24, 0.2); color: #FAB818; padding: 2px 8px; border-radius: 9999px;">
              Sincronia em Tempo Real
            </span>
          </div>
          <h2 style="font-family: var(--admin-font-heading); font-size: 18px; font-weight: 800; color: #FFFFFF; margin: 6px 0 4px 0;">
            Gordinho Brindes — Parque Gráfico & Operações 2026
          </h2>
          <p style="font-size: 13px; color: #D2E4D8; margin: 0; max-width: 650px;">
            Qualquer alteração em preços, produtos, faixas de desconto ou banners reflete instantaneamente na loja pública.
          </p>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button id="dash-btn-new-product" class="admin-btn admin-btn-primary">
            + Cadastrar Produto
          </button>
          <button id="dash-btn-manual-order" class="admin-btn" style="background: rgba(255, 255, 255, 0.12); color: #FFFFFF; border: 1px solid rgba(255, 255, 255, 0.2);">
            + Criar Pedido Manual
          </button>
        </div>
      </div>
    </div>

    <!-- Recent Orders Table -->
    <div class="admin-card">
      <div class="admin-card-header">
        <h2 class="admin-card-title">Pedidos e Orçamentos Recentes</h2>
        <button class="admin-btn admin-btn-secondary admin-btn-sm" id="dash-btn-view-all-orders">Ver Todos os Pedidos →</button>
      </div>

      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Cliente / Empresa</th>
              <th>Itens</th>
              <th>Valor Total</th>
              <th>Status</th>
              <th>Data</th>
              <th style="text-align: right;">Ações</th>
            </tr>
          </thead>
          <tbody>
            ${recentOrders.map(order => `
              <tr>
                <td><strong style="color: #0F172A;">${order.id}</strong></td>
                <td>
                  <div style="font-weight: 700; color: #0F172A;">${escapeHtml(order.customer.name)}</div>
                  <div style="font-size: 11px; color: #16A34A; font-weight: 700;">${escapeHtml(order.customer.company || 'Pessoa Física')}</div>
                </td>
                <td style="font-size: 12px;">${order.items.map(i => `<div><strong>${i.quantity}x</strong> ${escapeHtml(i.name)}</div>`).join('')}</td>
                <td><strong style="color: #16A34A; font-size: 14px;">R$ ${parseFloat(order.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></td>
                <td><span class="admin-badge ${getStatusBadgeClass(order.status)}">${order.status}</span></td>
                <td style="color: #64748B; font-size: 12px;">${order.date}</td>
                <td style="text-align: right;">
                  <button class="admin-btn admin-btn-secondary admin-btn-sm" onclick="window.viewOrderDetails('${order.id}')">Ver Detalhes</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  container.querySelector('#dash-btn-new-product')?.addEventListener('click', () => openProductModal());
  container.querySelector('#dash-btn-manual-order')?.addEventListener('click', () => openManualOrderModal());
  container.querySelector('#dash-btn-view-all-orders')?.addEventListener('click', () => switchTab('orders'));
}

// ----------------------------------------------------
// 3. PRODUCTS VIEW (CATÁLOGO COMPLETO CRUD)
// ----------------------------------------------------
function renderProductsView(container) {
  const products = db.getProducts();
  const categories = db.getCategories();

  container.innerHTML = `
    <div class="admin-card">
      <div class="admin-card-header">
        <div>
          <h2 class="admin-card-title">Catálogo Completo de Produtos (${products.length})</h2>
          <p style="font-size: 12px; color: #64748B; margin: 4px 0 0 0;">
            Gerencie fotos, preços progressivos por atacado, estoque, cores e visibilidade na loja.
          </p>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <input type="text" id="product-search-input" class="admin-input" placeholder="Buscar por nome ou SKU..." style="width: 220px;">
          <select id="product-category-filter" class="admin-select" style="width: 180px;">
            <option value="">Todas as Categorias</option>
            ${categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
          </select>
          <button id="btn-add-product" class="admin-btn admin-btn-primary">
            + Novo Produto
          </button>
        </div>
      </div>

      <div class="admin-table-container">
        <table class="admin-table" id="products-table">
          <thead>
            <tr>
              <th style="width: 54px;">Foto</th>
              <th>Produto</th>
              <th>SKU</th>
              <th>Categoria</th>
              <th>Preço Base (100 un.)</th>
              <th>Economize Até</th>
              <th>Estoque</th>
              <th>Status</th>
              <th style="text-align: right;">Ações</th>
            </tr>
          </thead>
          <tbody id="products-table-body">
            ${renderProductRows(products)}
          </tbody>
        </table>
      </div>
    </div>
  `;

  const addBtn = container.querySelector('#btn-add-product');
  if (addBtn) addBtn.addEventListener('click', () => openProductModal());

  const searchInput = container.querySelector('#product-search-input');
  const catFilter = container.querySelector('#product-category-filter');

  function filterTable() {
    const query = (searchInput?.value || '').toLowerCase().trim();
    const cat = catFilter?.value || '';

    const filtered = products.filter(p => {
      const matchQuery = !query || p.name.toLowerCase().includes(query) || (p.sku && p.sku.toLowerCase().includes(query));
      const matchCat = !cat || p.category === cat;
      return matchQuery && matchCat;
    });

    const tbody = container.querySelector('#products-table-body');
    if (tbody) tbody.innerHTML = renderProductRows(filtered);
  }

  if (searchInput) searchInput.addEventListener('input', filterTable);
  if (catFilter) catFilter.addEventListener('change', filterTable);
}

function renderProductRows(products) {
  if (!products.length) {
    return `<tr><td colspan="9" style="text-align: center; padding: 36px; color: #64748B;">Nenhum produto encontrado.</td></tr>`;
  }

  return products.map(prod => `
    <tr>
      <td>
        <img src="${prod.image || '/favicon.png'}" alt="${escapeHtml(prod.name)}" style="width: 44px; height: 44px; object-fit: contain; border-radius: 8px; border: 1px solid #E2E8F0; background: #fff;" onerror="this.src='/favicon.png'">
      </td>
      <td>
        <div style="font-weight: 700; color: #0F172A;">${escapeHtml(prod.name)}</div>
        <div style="font-size: 11px; color: #64748B; max-width: 320px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          ${escapeHtml(prod.description || '')}
        </div>
      </td>
      <td><code style="background: #F1F5F9; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 700; color: #0F3822;">${prod.sku || '-'}</code></td>
      <td><span class="admin-badge badge-gray">${escapeHtml(prod.category || 'Geral')}</span></td>
      <td>
        <div style="font-weight: 800; color: #16A34A;">R$ ${parseFloat(prod.basePrice).toFixed(2).replace('.', ',')}</div>
        ${prod.originalPrice ? `<div style="font-size: 10px; text-decoration: line-through; color: #94A3B8;">R$ ${parseFloat(prod.originalPrice).toFixed(2).replace('.', ',')}</div>` : ''}
      </td>
      <td>
        ${prod.maxDiscount ? `<span class="admin-badge badge-green">-${prod.maxDiscount}%</span>` : '-'}
      </td>
      <td>
        <span style="font-size: 12px; font-weight: 700; color: #0F172A;">${prod.stockQuantity ?? 1000} un.</span>
      </td>
      <td>
        ${prod.inStock 
          ? `<span class="admin-badge badge-green">Em Estoque</span>` 
          : `<span class="admin-badge badge-yellow">Esgotado</span>`}
      </td>
      <td style="text-align: right;">
        <div style="display: inline-flex; gap: 6px;">
          <button class="admin-btn admin-btn-secondary admin-btn-sm" onclick="window.editProduct('${prod.id}')" title="Editar Produto">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Editar
          </button>
          <button class="admin-btn admin-btn-danger admin-btn-sm" onclick="window.deleteProduct('${prod.id}')" title="Excluir">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ----------------------------------------------------
// 4. ORDERS VIEW (GESTÃO DE PEDIDOS & ORÇAMENTOS)
// ----------------------------------------------------
function renderOrdersView(container) {
  const orders = db.getOrders();

  container.innerHTML = `
    <div class="admin-card">
      <div class="admin-card-header">
        <div>
          <h2 class="admin-card-title">Gestão de Pedidos & Orçamentos (${orders.length})</h2>
          <p style="font-size: 12px; color: #64748B; margin: 4px 0 0 0;">
            Acompanhe solicitações de clientes, faturamento, produção e contato direto via WhatsApp.
          </p>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <input type="text" id="order-search-input" class="admin-input" placeholder="Buscar por cliente, ID ou empresa..." style="width: 250px;">
          <select id="order-status-filter" class="admin-select" style="width: 170px;">
            <option value="">Todos os Status</option>
            <option value="Pendente">⏳ Pendente</option>
            <option value="Aprovado">✓ Aprovado</option>
            <option value="Em Produção">⚙️ Em Produção</option>
            <option value="Enviado">🚚 Enviado</option>
            <option value="Concluído">⭐ Concluído</option>
            <option value="Cancelado">✕ Cancelado</option>
          </select>
          <button id="btn-create-order" class="admin-btn admin-btn-primary">
            + Novo Pedido Manual
          </button>
        </div>
      </div>

      <div class="admin-table-container">
        <table class="admin-table" id="orders-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Data/Hora</th>
              <th>Cliente & Empresa</th>
              <th>Contato & WhatsApp</th>
              <th>Itens</th>
              <th>Total</th>
              <th>Status</th>
              <th style="text-align: right;">Ações</th>
            </tr>
          </thead>
          <tbody id="orders-table-body">
            ${renderOrderRows(orders)}
          </tbody>
        </table>
      </div>
    </div>
  `;

  const searchInput = container.querySelector('#order-search-input');
  const statusFilter = container.querySelector('#order-status-filter');

  function filterOrders() {
    const query = (searchInput?.value || '').toLowerCase().trim();
    const status = statusFilter?.value || '';

    const filtered = orders.filter(o => {
      const matchQuery = !query ||
        o.id.toLowerCase().includes(query) ||
        (o.customer?.name && o.customer.name.toLowerCase().includes(query)) ||
        (o.customer?.company && o.customer.company.toLowerCase().includes(query)) ||
        (o.customer?.phone && o.customer.phone.includes(query));
      const matchStatus = !status || o.status === status;
      return matchQuery && matchStatus;
    });

    const tbody = container.querySelector('#orders-table-body');
    if (tbody) tbody.innerHTML = renderOrderRows(filtered);
  }

  if (searchInput) searchInput.addEventListener('input', filterOrders);
  if (statusFilter) statusFilter.addEventListener('change', filterOrders);

  container.querySelector('#btn-create-order')?.addEventListener('click', () => openManualOrderModal());
}

function renderOrderRows(orders) {
  if (!orders.length) {
    return `<tr><td colspan="8" style="text-align: center; padding: 36px; color: #64748B;">Nenhum pedido encontrado.</td></tr>`;
  }

  return orders.map(o => {
    const rawPhone = (o.customer.phone || '').replace(/\D/g, '');
    const waUrl = rawPhone ? `https://wa.me/55${rawPhone}?text=${encodeURIComponent(`Olá ${o.customer.name}! Sou da equipe Gordinho Brindes referente ao seu pedido #${o.id}.`)}` : '';

    return `
      <tr>
        <td><strong style="color: #0F172A;">${o.id}</strong></td>
        <td style="font-size: 12px; color: #64748B;">${o.date}</td>
        <td>
          <div style="font-weight: 700; color: #0F172A;">${escapeHtml(o.customer.name)}</div>
          <div style="font-size: 11px; color: #16A34A; font-weight: 700;">${escapeHtml(o.customer.company || 'Pessoa Física')}</div>
        </td>
        <td style="font-size: 12px;">
          <div>${escapeHtml(o.customer.phone || '-')}</div>
          <div style="color: #64748B; font-size: 11px;">${escapeHtml(o.customer.email || '-')}</div>
        </td>
        <td style="font-size: 12px;">
          ${o.items.map(it => `<div><strong>${it.quantity}x</strong> ${escapeHtml(it.name)}</div>`).join('')}
        </td>
        <td>
          <strong style="color: #16A34A; font-size: 14px;">R$ ${parseFloat(o.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
          <div style="font-size: 10px; color: #64748B;">${escapeHtml(o.paymentMethod || 'À vista')}</div>
        </td>
        <td>
          <select class="admin-select" style="font-size: 12px; padding: 5px 8px; width: 135px;" onchange="window.updateOrderStatus('${o.id}', this.value)">
            <option value="Pendente" ${o.status === 'Pendente' ? 'selected' : ''}>⏳ Pendente</option>
            <option value="Aprovado" ${o.status === 'Aprovado' ? 'selected' : ''}>✓ Aprovado</option>
            <option value="Em Produção" ${o.status === 'Em Produção' ? 'selected' : ''}>⚙️ Em Produção</option>
            <option value="Enviado" ${o.status === 'Enviado' ? 'selected' : ''}>🚚 Enviado</option>
            <option value="Concluído" ${o.status === 'Concluído' ? 'selected' : ''}>⭐ Concluído</option>
            <option value="Cancelado" ${o.status === 'Cancelado' ? 'selected' : ''}>✕ Cancelado</option>
          </select>
        </td>
        <td style="text-align: right;">
          <div style="display: inline-flex; gap: 6px;">
            <button class="admin-btn admin-btn-secondary admin-btn-sm" onclick="window.viewOrderDetails('${o.id}')" title="Ver Detalhes do Pedido">
              Detalhes
            </button>
            ${waUrl ? `
              <a href="${waUrl}" target="_blank" rel="noopener" class="admin-btn admin-btn-sm" style="background: #25D366; color: #FFFFFF;" title="Conversar no WhatsApp">
                WA
              </a>
            ` : ''}
            <button class="admin-btn admin-btn-danger admin-btn-sm" onclick="window.deleteOrder('${o.id}')" title="Excluir">
              ✕
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ----------------------------------------------------
// 5. CATEGORIES VIEW
// ----------------------------------------------------
function renderCategoriesView(container) {
  const categories = db.getCategories();
  const products = db.getProducts();

  container.innerHTML = `
    <div class="admin-card" style="max-width: 900px;">
      <div class="admin-card-header">
        <div>
          <h2 class="admin-card-title">Categorias do Catálogo (${categories.length})</h2>
          <p style="font-size: 12px; color: #64748B; margin: 4px 0 0 0;">
            Adicione novas linhas de produtos ou edite as existentes para organizar a loja.
          </p>
        </div>
        <div>
          <button id="btn-add-category" class="admin-btn admin-btn-primary">
            + Nova Categoria
          </button>
        </div>
      </div>

      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Nome da Categoria</th>
              <th>Slug / Link</th>
              <th>Qtd. de Produtos</th>
              <th style="text-align: right;">Ações</th>
            </tr>
          </thead>
          <tbody>
            ${categories.map(c => {
              const count = products.filter(p => p.category === c.name).length;
              return `
                <tr>
                  <td><strong style="color: #0F172A; font-size: 14px;">${escapeHtml(c.name)}</strong></td>
                  <td><code style="background: #F1F5F9; padding: 2px 8px; border-radius: 4px; font-size: 11px; color: #0F3822;">/categoria/${c.slug}</code></td>
                  <td><span class="admin-badge badge-forest">${count} produtos</span></td>
                  <td style="text-align: right;">
                    <div style="display: inline-flex; gap: 6px;">
                      <button class="admin-btn admin-btn-secondary admin-btn-sm" onclick="window.editCategory('${c.id}')">Editar</button>
                      <button class="admin-btn admin-btn-danger admin-btn-sm" onclick="window.deleteCategory('${c.id}')">Excluir</button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  container.querySelector('#btn-add-category')?.addEventListener('click', () => openCategoryModal());
}

// ----------------------------------------------------
// 6. SETTINGS VIEW (CMS DO SITE)
// ----------------------------------------------------
function renderSettingsView(container) {
  const settings = db.getSettings();
  // Rascunho da lista de reels: só vai para o banco ao clicar em "Salvar Alterações"
  const reelsDraft = (settings.reels || []).map((r) => ({ ...r }));

  const sectionTitle = (title, help) => `
    <div style="grid-column: 1 / -1; margin: 22px 0 4px; padding-top: 18px; border-top: 1px solid #E2E8F0;">
      <h3 style="font-family: var(--admin-font-heading); font-size: 15px; font-weight: 800; color: #0F172A; margin: 0;">${title}</h3>
      ${help ? `<p style="font-size: 12px; color: #64748B; margin: 4px 0 0 0;">${help}</p>` : ''}
    </div>`;

  const field = (id, label, value, { type = 'text', help = '', attrs = '' } = {}) => `
    <div class="admin-form-group">
      <label class="admin-form-label" for="${id}">${label}</label>
      <input type="${type}" id="${id}" class="admin-input" value="${escapeHtml(value ?? '')}" ${attrs}>
      ${help ? `<div class="admin-form-help">${help}</div>` : ''}
    </div>`;

  container.innerHTML = `
    <div class="admin-card" style="max-width: 860px;">
      <div class="admin-card-header">
        <div>
          <h2 class="admin-card-title">Configurações Gerais & Conteúdo da Loja</h2>
          <p style="font-size: 12px; color: #64748B; margin: 4px 0 0 0;">
            Tudo o que for salvo aqui é aplicado em todo o site: cabeçalho, rodapé, botões de WhatsApp, links das redes sociais e textos promocionais.
          </p>
        </div>
      </div>

      <form id="settings-form">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px;">
          ${sectionTitle('Identidade da loja')}
          ${field('setting-store-name', 'Nome da Marca / Loja', settings.storeName, { help: 'Usado no título da página, rodapé e textos institucionais.' })}
          ${field('setting-store-subtitle', 'Subtítulo / Slogan', settings.storeSubtitle)}

          ${sectionTitle('Dados legais', 'Exibidos no rodapé do site.')}
          ${field('setting-legal-name', 'Razão Social', settings.companyLegalName)}
          ${field('setting-cnpj', 'CNPJ', settings.cnpj, { attrs: 'placeholder="00.000.000/0000-00"' })}
          ${field('setting-state-registration', 'Inscrição Estadual', settings.stateRegistration, { help: 'Deixe vazio para ocultar.' })}
          ${field('setting-address', 'Endereço da Fábrica / Loja Física', settings.address)}

          ${sectionTitle('Atendimento')}
          ${field('setting-whatsapp', 'WhatsApp Comercial (somente números, com DDI e DDD)', settings.whatsappNumber, { help: 'Exemplo: 5547984965444. Atualiza todos os botões e links de WhatsApp.' })}
          ${field('setting-whatsapp-display', 'Telefone / WhatsApp Formatado', settings.whatsappDisplay, { help: 'Como o número aparece escrito no site.' })}
          ${field('setting-email', 'E-mail de Suporte / Vendas', settings.supportEmail, { type: 'email', help: 'Deixe vazio para ocultar o e-mail no rodapé.' })}
          ${field('setting-hours', 'Horário de Atendimento', settings.businessHours)}

          ${sectionTitle('Redes sociais')}
          ${field('setting-instagram', 'Instagram Oficial', settings.instagramHandle, { help: 'Aceita @usuario ou o link do perfil. Atualiza todos os links e menções ao Instagram.' })}
          ${field('setting-facebook', 'Facebook (link)', settings.facebookUrl, { type: 'url' })}
          ${field('setting-youtube', 'YouTube (link)', settings.youtubeUrl, { type: 'url' })}
          ${field('setting-tiktok', 'TikTok (link)', settings.tiktokUrl, { type: 'url' })}

          ${sectionTitle('Reels da loja (vídeos)', 'Na loja aparece só o vídeo, sem o layout do Instagram. Importe pelo link do reel ou envie o arquivo MP4 (até 80 MB). Sem vídeos, a seção fica oculta.')}
          <div class="admin-form-group" style="grid-column: 1 / -1;">
            <div class="reels-instagram-box">
              <div id="ig-connection-status" class="admin-form-help">Verificando conexão com o Instagram...</div>
              <div id="ig-connect-form" class="reels-inline-form" hidden>
                <input type="password" id="ig-token-input" class="admin-input" placeholder="Cole aqui o token de acesso da API do Instagram" autocomplete="off">
                <button type="button" id="btn-ig-connect" class="admin-btn admin-btn-forest admin-btn-sm">Conectar</button>
              </div>
              <div id="ig-import-form" class="reels-inline-form" hidden>
                <input type="url" id="ig-reel-url" class="admin-input" placeholder="Cole o link do reel (https://www.instagram.com/reel/...)">
                <button type="button" id="btn-ig-import" class="admin-btn admin-btn-primary admin-btn-sm">Importar vídeo</button>
                <button type="button" id="btn-ig-disconnect" class="admin-btn admin-btn-secondary admin-btn-sm">Desconectar</button>
              </div>
            </div>
            <div id="reels-admin-list" class="reels-admin-list"></div>
            <label class="admin-btn admin-btn-secondary" style="margin-top: 10px; cursor: pointer;">
              <input type="file" id="reel-upload-input" accept="video/mp4,video/webm" multiple hidden>
              + Enviar arquivo de vídeo
            </label>
            <div id="reel-upload-status" class="admin-form-help"></div>
          </div>

          ${sectionTitle('Promoções e pagamento')}
          <div class="admin-form-group" style="grid-column: 1 / -1;">
            <label class="admin-form-label" for="setting-announcement">Faixa de Aviso Promocional no Topo do Site</label>
            <input type="text" id="setting-announcement" class="admin-input" value="${escapeHtml(settings.announcementText || '')}">
            <label style="display: inline-flex; align-items: center; gap: 8px; margin-top: 8px; font-size: 12px; color: #334155;">
              <input type="checkbox" id="setting-announcement-visible" ${settings.announcementVisible !== false ? 'checked' : ''}>
              Exibir a faixa de aviso no topo da loja
            </label>
          </div>
          ${field('setting-cashback', 'Cashback de Boas-Vindas (%)', settings.cashbackPercent, { type: 'number', attrs: 'min="0" max="50"' })}
          ${field('setting-pix', 'Desconto no Pix à Vista (%)', settings.pixDiscountPercent, { type: 'number', attrs: 'min="0" max="30"' })}
          ${field('setting-installments', 'Parcelas sem juros (máx.)', settings.maxInstallments, { type: 'number', attrs: 'min="1" max="24"' })}

          ${sectionTitle('Segurança')}
          ${field('setting-pin', 'Novo PIN do Painel Admin', '', { type: 'password', attrs: 'maxlength="64" autocomplete="new-password" placeholder="Deixe vazio para manter o atual"', help: 'Mínimo de 4 caracteres. Ao trocar, outras sessões abertas do painel são encerradas.' })}
        </div>

        <div style="margin-top: 24px; display: flex; justify-content: flex-end;">
          <button type="submit" class="admin-btn admin-btn-primary" style="padding: 11px 28px;">
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  `;

  const form = container.querySelector('#settings-form');
  if (!form) return;

  setupReelsEditor(container, reelsDraft);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const val = (id) => container.querySelector(`#${id}`).value.trim();
    const num = (id, fallback) => {
      const n = parseInt(val(id), 10);
      return Number.isFinite(n) ? n : fallback;
    };

    const instagram = normalizeInstagram(val('setting-instagram'));
    if (!instagram) {
      showToast('Informe um Instagram válido (@usuario ou link do perfil).', 'error');
      return;
    }

    db.saveSettings({
      storeName: val('setting-store-name') || 'Gordinho Brindes',
      storeSubtitle: val('setting-store-subtitle'),
      companyLegalName: val('setting-legal-name'),
      cnpj: val('setting-cnpj'),
      stateRegistration: val('setting-state-registration'),
      address: val('setting-address'),
      whatsappNumber: val('setting-whatsapp').replace(/\D/g, ''),
      whatsappDisplay: val('setting-whatsapp-display'),
      supportEmail: val('setting-email'),
      businessHours: val('setting-hours'),
      instagramHandle: instagram.handle,
      instagramUrl: instagram.url,
      reels: reelsDraft.map(({ id, videoId, posterId, title }) => ({ id, videoId, posterId, title })),
      facebookUrl: val('setting-facebook'),
      youtubeUrl: val('setting-youtube'),
      tiktokUrl: val('setting-tiktok'),
      announcementText: val('setting-announcement'),
      announcementVisible: container.querySelector('#setting-announcement-visible').checked,
      cashbackPercent: num('setting-cashback', 5),
      pixDiscountPercent: num('setting-pix', 5),
      maxInstallments: num('setting-installments', 10),
    });

    const newPin = val('setting-pin');
    if (newPin) {
      if (newPin.length < 4) {
        showToast('O PIN precisa ter pelo menos 4 caracteres.', 'error');
        return;
      }
      try {
        await db.changePin(newPin);
        showToast('PIN do painel alterado.', 'success');
      } catch (err) {
        showToast(`Não foi possível trocar o PIN: ${err.message}`, 'error');
      }
    }
    showToast('Configurações salvas e aplicadas à loja pública com sucesso!', 'success');
  });
}

// Aceita "@usuario", "usuario" ou "https://www.instagram.com/usuario/"
function normalizeInstagram(input) {
  const match = String(input || '').trim().match(/^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)?@?([A-Za-z0-9._]{1,30})\/?(?:\?.*)?$/);
  if (!match) return null;
  const user = match[1];
  return { handle: `@${user}`, url: `https://www.instagram.com/${user}/` };
}

// ----------------------------------------------------
// Reels: lista editável (ordem, título, remover) e upload dos vídeos
// ----------------------------------------------------
function setupReelsEditor(container, reelsDraft) {
  const list = container.querySelector('#reels-admin-list');
  const input = container.querySelector('#reel-upload-input');
  const status = container.querySelector('#reel-upload-status');
  if (!list || !input) return;

  const render = () => {
    list.innerHTML = reelsDraft.length ? reelsDraft.map((reel, i) => `
      <div class="reels-admin-item" data-index="${i}">
        <video src="/media/${escapeHtml(reel.videoId)}" ${reel.posterId ? `poster="/media/${escapeHtml(reel.posterId)}"` : ''} muted playsinline preload="metadata"></video>
        <input type="text" class="admin-input reel-title-input" placeholder="Título sobre o vídeo (opcional)" maxlength="120" value="${escapeHtml(reel.title || '')}">
        <div class="reels-admin-actions">
          <button type="button" class="admin-btn admin-btn-secondary admin-btn-sm" data-action="up" ${i === 0 ? 'disabled' : ''} aria-label="Mover para cima">↑</button>
          <button type="button" class="admin-btn admin-btn-secondary admin-btn-sm" data-action="down" ${i === reelsDraft.length - 1 ? 'disabled' : ''} aria-label="Mover para baixo">↓</button>
          <button type="button" class="admin-btn admin-btn-danger admin-btn-sm" data-action="remove">Remover</button>
        </div>
      </div>`).join('') : '<div class="admin-form-help">Nenhum vídeo cadastrado: a seção de reels não aparece na loja.</div>';
  };

  list.addEventListener('input', (e) => {
    const item = e.target.closest('.reels-admin-item');
    if (item && e.target.classList.contains('reel-title-input')) reelsDraft[item.dataset.index].title = e.target.value;
  });

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const i = Number(btn.closest('.reels-admin-item').dataset.index);
    if (btn.dataset.action === 'remove') reelsDraft.splice(i, 1);
    if (btn.dataset.action === 'up' && i > 0) [reelsDraft[i - 1], reelsDraft[i]] = [reelsDraft[i], reelsDraft[i - 1]];
    if (btn.dataset.action === 'down' && i < reelsDraft.length - 1) [reelsDraft[i + 1], reelsDraft[i]] = [reelsDraft[i], reelsDraft[i + 1]];
    render();
  });

  input.addEventListener('change', async () => {
    const files = [...input.files];
    input.value = '';
    for (const [n, file] of files.entries()) {
      if (!['video/mp4', 'video/webm'].includes(file.type)) {
        showToast(`"${file.name}" não é MP4/WebM.`, 'error');
        continue;
      }
      if (file.size > 80 * 1024 * 1024) {
        showToast(`"${file.name}" passa de 80 MB.`, 'error');
        continue;
      }
      status.textContent = `Enviando ${n + 1} de ${files.length}: ${file.name}...`;
      try {
        const poster = await captureVideoPoster(file);
        const video = await db.uploadMedia(file);
        const posterMedia = poster ? await db.uploadMedia(poster) : null;
        reelsDraft.push({ id: crypto.randomUUID(), videoId: video.id, posterId: posterMedia?.id || '', title: '' });
        render();
      } catch (err) {
        showToast(`Falha ao enviar "${file.name}": ${err.message}`, 'error');
      }
    }
    status.textContent = files.length ? 'Envio concluído. Clique em "Salvar Alterações" para publicar na loja.' : '';
  });

  setupInstagramImport(container, (reel) => {
    reelsDraft.push(reel);
    render();
  });

  render();
}

// Conexão com a API oficial do Instagram + importação de reel pelo link
function setupInstagramImport(container, onImported) {
  const statusEl = container.querySelector('#ig-connection-status');
  const connectForm = container.querySelector('#ig-connect-form');
  const importForm = container.querySelector('#ig-import-form');
  if (!statusEl) return;

  const showState = (state) => {
    connectForm.hidden = state.connected;
    importForm.hidden = !state.connected;
    statusEl.textContent = state.connected
      ? `Instagram conectado: @${state.username}. Cole o link de um reel desta conta para importar o vídeo.`
      : `Instagram não conectado.${state.error ? ` (${state.error})` : ''} Para importar pelo link, cole o token de acesso da API do Instagram da conta.`;
  };

  db.instagramStatus().then(showState).catch((err) => {
    statusEl.textContent = `Não foi possível verificar o Instagram: ${err.message}`;
  });

  container.querySelector('#btn-ig-connect')?.addEventListener('click', async (e) => {
    const input = container.querySelector('#ig-token-input');
    e.currentTarget.disabled = true;
    try {
      showState(await db.connectInstagram(input.value.trim()));
      input.value = '';
      showToast('Instagram conectado.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      e.currentTarget.disabled = false;
    }
  });

  container.querySelector('#btn-ig-disconnect')?.addEventListener('click', async () => {
    if (!confirm('Desconectar a conta do Instagram? Os vídeos já importados continuam na loja.')) return;
    showState(await db.disconnectInstagram());
  });

  container.querySelector('#btn-ig-import')?.addEventListener('click', async (e) => {
    const input = container.querySelector('#ig-reel-url');
    const url = input.value.trim();
    if (!url) return;
    const btn = e.currentTarget;
    btn.disabled = true;
    btn.textContent = 'Importando...';
    try {
      const reel = await db.importInstagramReel(url);
      onImported({ id: crypto.randomUUID(), videoId: reel.videoId, posterId: reel.posterId, title: reel.title || '' });
      input.value = '';
      showToast('Vídeo importado. Clique em "Salvar Alterações" para publicar na loja.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Importar vídeo';
    }
  });
}

// Gera uma capa JPEG a partir de um quadro do vídeo (o card não fica preto antes do play)
function captureVideoPoster(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    let finished = false;
    const done = (blob) => {
      if (finished) return;
      finished = true;
      URL.revokeObjectURL(url);
      resolve(blob);
    };
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.addEventListener('loadeddata', () => {
      video.currentTime = Math.min(1, (video.duration || 2) / 2);
    }, { once: true });
    video.addEventListener('seeked', () => {
      const width = Math.min(720, video.videoWidth || 720);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = Math.round(width * ((video.videoHeight || 16) / (video.videoWidth || 9)));
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(done, 'image/jpeg', 0.82);
    }, { once: true });
    video.addEventListener('error', () => done(null), { once: true });
    setTimeout(() => done(null), 15000);
    video.src = url;
  });
}

// ----------------------------------------------------
// 7. MODAIS (PRODUTO, PEDIDO MANUAL, CATEGORIA, DETALHES)
// ----------------------------------------------------
function openProductModal(productId = null) {
  editingProductId = productId;
  const product = productId ? db.getProductById(productId) : {
    name: '',
    sku: '',
    category: 'Garrafas & Copos',
    basePrice: 19.90,
    originalPrice: 39.90,
    maxDiscount: 50,
    stockQuantity: 1000,
    description: '',
    image: 'https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/6cea5fd8-5789-492c-98ac-350cdc14902a-1789132069129.png?width=500&quality=72&resize=contain',
    hoverImage: '',
    inStock: true,
    featured: true,
    sections: ['mais-vendidos'],
    colors: ['#0F3822', '#FAB818', '#111111'],
  };

  const categories = db.getCategories();
  const modalContainer = document.getElementById('admin-modals-container');
  if (!modalContainer) return;

  modalContainer.innerHTML = `
    <div class="admin-modal-backdrop" id="product-modal-backdrop">
      <div class="admin-modal" onclick="event.stopPropagation()">
        <div class="admin-modal-header">
          <h2 style="font-family: var(--admin-font-heading); font-size: 16px; font-weight: 800; margin: 0; color: #0F172A;">
            ${productId ? 'Editar Produto' : 'Cadastrar Novo Produto'}
          </h2>
          <button type="button" id="btn-close-product-modal" class="admin-btn admin-btn-secondary admin-btn-sm" style="padding: 4px 8px;">✕</button>
        </div>

        <form id="product-modal-form" class="admin-modal-body">
          <div class="admin-form-group">
            <label class="admin-form-label">Nome do Produto *</label>
            <input type="text" id="prod-name" class="admin-input" required value="${escapeHtml(product.name)}">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="admin-form-group">
              <label class="admin-form-label">Código SKU</label>
              <input type="text" id="prod-sku" class="admin-input" value="${escapeHtml(product.sku || '')}">
            </div>

            <div class="admin-form-group">
              <label class="admin-form-label">Categoria</label>
              <select id="prod-category" class="admin-select">
                ${categories.map(c => `
                  <option value="${c.name}" ${product.category === c.name ? 'selected' : ''}>${c.name}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px;">
            <div class="admin-form-group">
              <label class="admin-form-label">Preço Base (R$) *</label>
              <input type="number" step="0.01" id="prod-price" class="admin-input" required value="${product.basePrice}">
              <div class="admin-form-help">Preço para 100 un.</div>
            </div>

            <div class="admin-form-group">
              <label class="admin-form-label">Preço Unit. Varejo (R$)</label>
              <input type="number" step="0.01" id="prod-original-price" class="admin-input" value="${product.originalPrice || ''}">
              <div class="admin-form-help">Faixa 1 a 9 un.</div>
            </div>

            <div class="admin-form-group">
              <label class="admin-form-label">Desconto Máx. (%)</label>
              <input type="number" id="prod-discount" class="admin-input" value="${product.maxDiscount || 50}">
            </div>

            <div class="admin-form-group">
              <label class="admin-form-label">Qtd. em Estoque</label>
              <input type="number" id="prod-stock" class="admin-input" value="${product.stockQuantity || 1000}">
            </div>
          </div>

          <div class="admin-form-group">
            <label class="admin-form-label">URL da Foto Principal</label>
            <input type="url" id="prod-image" class="admin-input" value="${escapeHtml(product.image || '')}">
          </div>

          <div class="admin-form-group">
            <label class="admin-form-label">Descrição do Produto</label>
            <textarea id="prod-desc" class="admin-textarea" rows="3">${escapeHtml(product.description || '')}</textarea>
          </div>

          <div class="admin-form-group">
            <label class="admin-form-label">Seções onde o produto é exibido na Loja:</label>
            <div style="display: flex; gap: 16px; flex-wrap: wrap;">
              <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer;">
                <input type="checkbox" id="sec-mais-vendidos" ${(product.sections || []).includes('mais-vendidos') ? 'checked' : ''}>
                Mais Vendidos
              </label>
              <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer;">
                <input type="checkbox" id="sec-destaques" ${(product.sections || []).includes('destaques') ? 'checked' : ''}>
                Destaques
              </label>
              <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer;">
                <input type="checkbox" id="sec-lancamentos" ${(product.sections || []).includes('lancamentos') ? 'checked' : ''}>
                Lançamentos
              </label>
            </div>
          </div>

          <div style="display: flex; gap: 20px; align-items: center; margin-top: 10px;">
            <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
              <input type="checkbox" id="prod-instock" ${product.inStock ? 'checked' : ''}>
              <strong>Disponível em Estoque</strong>
            </label>

            <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
              <input type="checkbox" id="prod-featured" ${product.featured ? 'checked' : ''}>
              <strong>Destaque na Página Inicial</strong>
            </label>
          </div>
        </form>

        <div class="admin-modal-footer">
          <button type="button" id="btn-cancel-product-modal" class="admin-btn admin-btn-secondary">Cancelar</button>
          <button type="button" id="btn-save-product-modal" class="admin-btn admin-btn-primary">Salvar Produto</button>
        </div>
      </div>
    </div>
  `;

  const closeModal = () => { modalContainer.innerHTML = ''; };
  document.getElementById('btn-close-product-modal')?.addEventListener('click', closeModal);
  document.getElementById('btn-cancel-product-modal')?.addEventListener('click', closeModal);
  document.getElementById('product-modal-backdrop')?.addEventListener('click', closeModal);

  document.getElementById('btn-save-product-modal')?.addEventListener('click', () => {
    const name = document.getElementById('prod-name').value.trim();
    if (!name) {
      showToast('Informe o nome do produto', 'error');
      return;
    }

    const sections = [];
    if (document.getElementById('sec-mais-vendidos')?.checked) sections.push('mais-vendidos');
    if (document.getElementById('sec-destaques')?.checked) sections.push('destaques');
    if (document.getElementById('sec-lancamentos')?.checked) sections.push('lancamentos');

    const productData = {
      id: editingProductId,
      name,
      sku: document.getElementById('prod-sku').value.trim(),
      category: document.getElementById('prod-category').value,
      basePrice: parseFloat(document.getElementById('prod-price').value) || 0,
      originalPrice: parseFloat(document.getElementById('prod-original-price').value) || 0,
      maxDiscount: parseInt(document.getElementById('prod-discount').value, 10) || 50,
      stockQuantity: parseInt(document.getElementById('prod-stock').value, 10) || 1000,
      image: document.getElementById('prod-image').value.trim(),
      description: document.getElementById('prod-desc').value.trim(),
      sections: sections.length ? sections : ['mais-vendidos'],
      inStock: document.getElementById('prod-instock').checked,
      featured: document.getElementById('prod-featured').checked,
    };

    db.saveProduct(productData);
    showToast(editingProductId ? 'Produto atualizado com sucesso!' : 'Novo produto cadastrado!', 'success');
    closeModal();
    renderCurrentTab();
  });
}

function openManualOrderModal() {
  const modalContainer = document.getElementById('admin-modals-container');
  if (!modalContainer) return;

  const products = db.getProducts();

  modalContainer.innerHTML = `
    <div class="admin-modal-backdrop" id="manual-order-backdrop">
      <div class="admin-modal" onclick="event.stopPropagation()" style="max-width: 600px;">
        <div class="admin-modal-header">
          <h2 style="font-family: var(--admin-font-heading); font-size: 16px; font-weight: 800; margin: 0; color: #0F172A;">
            Criar Novo Pedido / Orçamento Manual
          </h2>
          <button type="button" id="btn-close-manual-order" class="admin-btn admin-btn-secondary admin-btn-sm">✕</button>
        </div>

        <form id="manual-order-form" class="admin-modal-body">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="admin-form-group">
              <label class="admin-form-label">Nome do Cliente *</label>
              <input type="text" id="man-cust-name" class="admin-input" required placeholder="Ex: Roberto Mendes">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Empresa / Razão Social</label>
              <input type="text" id="man-cust-company" class="admin-input" placeholder="Ex: Portonave Logística">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="admin-form-group">
              <label class="admin-form-label">WhatsApp *</label>
              <input type="text" id="man-cust-phone" class="admin-input" required placeholder="(47) 99999-9999">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">E-mail</label>
              <input type="email" id="man-cust-email" class="admin-input" placeholder="contato@empresa.com.br">
            </div>
          </div>

          <div class="admin-form-group">
            <label class="admin-form-label">Selecione o Produto *</label>
            <select id="man-prod-select" class="admin-select" required>
              ${products.map(p => `
                <option value="${p.id}" data-price="${p.basePrice}">${p.name} (R$ ${parseFloat(p.basePrice).toFixed(2).replace('.', ',')})</option>
              `).join('')}
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
            <div class="admin-form-group">
              <label class="admin-form-label">Quantidade</label>
              <input type="number" id="man-order-qty" class="admin-input" value="100" min="1">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Preço Unit. (R$)</label>
              <input type="number" step="0.01" id="man-order-unit" class="admin-input" value="${products[0]?.basePrice || 19.90}">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Status Inicial</label>
              <select id="man-order-status" class="admin-select">
                <option value="Pendente">Pendente</option>
                <option value="Aprovado">Aprovado</option>
                <option value="Em Produção">Em Produção</option>
                <option value="Concluído">Concluído</option>
              </select>
            </div>
          </div>

          <div class="admin-form-group">
            <label class="admin-form-label">Forma de Pagamento</label>
            <select id="man-order-payment" class="admin-select">
              <option value="Pix à vista (5% OFF)">Pix à vista (5% OFF)</option>
              <option value="Boleto Faturado 30 dias">Boleto Faturado 30 dias</option>
              <option value="Cartão de Crédito até 10x">Cartão de Crédito até 10x</option>
              <option value="Transferência Bancária">Transferência Bancária</option>
            </select>
          </div>

          <div class="admin-form-group">
            <label class="admin-form-label">Instruções de Personalização / Observações</label>
            <input type="text" id="man-order-notes" class="admin-input" placeholder="Ex: Gravação a laser da logomarca frontal">
          </div>

          <div style="background: #eaf5ea; border: 1px solid #bbf7d0; border-radius: 10px; padding: 12px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 13px; font-weight: 700; color: #166534;">Total do Pedido:</span>
            <span id="man-order-total-display" style="font-size: 18px; font-weight: 800; color: #166534;">R$ 0,00</span>
          </div>
        </form>

        <div class="admin-modal-footer">
          <button type="button" id="btn-cancel-manual-order" class="admin-btn admin-btn-secondary">Cancelar</button>
          <button type="button" id="btn-save-manual-order" class="admin-btn admin-btn-primary">Criar Pedido</button>
        </div>
      </div>
    </div>
  `;

  const closeModal = () => { modalContainer.innerHTML = ''; };
  document.getElementById('btn-close-manual-order')?.addEventListener('click', closeModal);
  document.getElementById('btn-cancel-manual-order')?.addEventListener('click', closeModal);
  document.getElementById('manual-order-backdrop')?.addEventListener('click', closeModal);

  const prodSelect = document.getElementById('man-prod-select');
  const qtyInput = document.getElementById('man-order-qty');
  const unitInput = document.getElementById('man-order-unit');
  const totalDisplay = document.getElementById('man-order-total-display');

  function updateManualTotal() {
    const qty = parseInt(qtyInput.value, 10) || 1;
    const unit = parseFloat(unitInput.value) || 0;
    const total = qty * unit;
    totalDisplay.textContent = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }

  prodSelect.addEventListener('change', () => {
    const selected = products.find(p => p.id === prodSelect.value);
    if (selected) {
      unitInput.value = db.getUnitPriceForQty(selected, parseInt(qtyInput.value, 10) || 100);
      updateManualTotal();
    }
  });

  qtyInput.addEventListener('input', () => {
    const selected = products.find(p => p.id === prodSelect.value);
    if (selected) {
      unitInput.value = db.getUnitPriceForQty(selected, parseInt(qtyInput.value, 10) || 1);
    }
    updateManualTotal();
  });

  unitInput.addEventListener('input', updateManualTotal);
  updateManualTotal();

  document.getElementById('btn-save-manual-order')?.addEventListener('click', async (e) => {
    const name = document.getElementById('man-cust-name').value.trim();
    const phone = document.getElementById('man-cust-phone').value.trim();
    if (!name || !phone) {
      showToast('Preencha o nome e o WhatsApp do cliente.', 'error');
      return;
    }

    const selectedProduct = products.find(p => p.id === prodSelect.value);
    const qty = parseInt(qtyInput.value, 10) || 100;
    const unitPrice = parseFloat(unitInput.value) || 0;
    const total = parseFloat((qty * unitPrice).toFixed(2));

    const saveBtn = e.currentTarget;
    saveBtn.disabled = true;
    let newOrder;
    try {
    newOrder = await db.addOrder({
      customer: {
        name,
        company: document.getElementById('man-cust-company').value.trim(),
        phone,
        email: document.getElementById('man-cust-email').value.trim(),
      },
      items: [
        { productId: selectedProduct?.id || 'manual', name: selectedProduct?.name || 'Item Personalizado', quantity: qty, unitPrice, total }
      ],
      total,
      paymentMethod: document.getElementById('man-order-payment').value,
      status: document.getElementById('man-order-status').value,
      notes: document.getElementById('man-order-notes').value.trim(),
    });
    } catch (err) {
      saveBtn.disabled = false;
      showToast(`Não foi possível criar o pedido: ${err.message}`, 'error');
      return;
    }

    showToast(`Pedido ${newOrder.id} criado com sucesso!`, 'success');
    closeModal();
    renderCurrentTab();
  });
}

function openCategoryModal(catId = null) {
  const modalContainer = document.getElementById('admin-modals-container');
  if (!modalContainer) return;

  const categories = db.getCategories();
  const cat = catId ? categories.find(c => c.id === catId) : { name: '' };

  modalContainer.innerHTML = `
    <div class="admin-modal-backdrop" id="category-modal-backdrop">
      <div class="admin-modal" onclick="event.stopPropagation()" style="max-width: 440px;">
        <div class="admin-modal-header">
          <h2 style="font-family: var(--admin-font-heading); font-size: 16px; font-weight: 800; margin: 0; color: #0F172A;">
            ${catId ? 'Editar Categoria' : 'Nova Categoria'}
          </h2>
          <button type="button" id="btn-close-cat-modal" class="admin-btn admin-btn-secondary admin-btn-sm">✕</button>
        </div>

        <form id="category-modal-form" class="admin-modal-body">
          <div class="admin-form-group">
            <label class="admin-form-label">Nome da Categoria *</label>
            <input type="text" id="cat-name-input" class="admin-input" required value="${escapeHtml(cat.name)}" placeholder="Ex: Mochilas & Malas">
          </div>
        </form>

        <div class="admin-modal-footer">
          <button type="button" id="btn-cancel-cat-modal" class="admin-btn admin-btn-secondary">Cancelar</button>
          <button type="button" id="btn-save-cat-modal" class="admin-btn admin-btn-primary">Salvar Categoria</button>
        </div>
      </div>
    </div>
  `;

  const closeModal = () => { modalContainer.innerHTML = ''; };
  document.getElementById('btn-close-cat-modal')?.addEventListener('click', closeModal);
  document.getElementById('btn-cancel-cat-modal')?.addEventListener('click', closeModal);
  document.getElementById('category-modal-backdrop')?.addEventListener('click', closeModal);

  document.getElementById('btn-save-cat-modal')?.addEventListener('click', () => {
    const name = document.getElementById('cat-name-input').value.trim();
    if (!name) {
      showToast('Informe o nome da categoria.', 'error');
      return;
    }
    db.saveCategory({ id: catId, name });
    showToast('Categoria salva com sucesso!', 'success');
    closeModal();
    renderCurrentTab();
  });
}

// ----------------------------------------------------
// GLOBAL WINDOW ACTIONS (For inline onclicks)
// ----------------------------------------------------
window.editProduct = (id) => {
  openProductModal(id);
};

window.deleteProduct = (id) => {
  if (confirm('Deseja realmente remover este produto do catálogo?')) {
    db.deleteProduct(id);
    showToast('Produto excluído com sucesso.', 'success');
    renderCurrentTab();
  }
};

window.editCategory = (id) => {
  openCategoryModal(id);
};

window.deleteCategory = (id) => {
  if (confirm('Deseja excluir esta categoria? Os produtos continuarão no catálogo.')) {
    db.deleteCategory(id);
    showToast('Categoria removida.', 'success');
    renderCurrentTab();
  }
};

window.updateOrderStatus = (orderId, newStatus) => {
  db.updateOrderStatus(orderId, newStatus);
  showToast(`Pedido ${orderId} atualizado para "${newStatus}".`, 'success');
};

window.deleteOrder = (orderId) => {
  if (confirm(`Deseja excluir o pedido ${orderId}?`)) {
    db.deleteOrder(orderId);
    showToast(`Pedido ${orderId} removido.`, 'success');
    renderCurrentTab();
  }
};

window.viewOrderDetails = (orderId) => {
  const order = db.getOrderById(orderId);
  if (!order) return;

  const modalContainer = document.getElementById('admin-modals-container');
  if (!modalContainer) return;

  const rawPhone = (order.customer.phone || '').replace(/\D/g, '');
  const waUrl = rawPhone ? `https://wa.me/55${rawPhone}?text=${encodeURIComponent(`Olá ${order.customer.name}! Sou da equipe Gordinho Brindes referente ao seu pedido #${order.id} no valor de R$ ${parseFloat(order.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`)}` : '';

  modalContainer.innerHTML = `
    <div class="admin-modal-backdrop" id="order-modal-backdrop">
      <div class="admin-modal" onclick="event.stopPropagation()">
        <div class="admin-modal-header">
          <h2 style="font-family: var(--admin-font-heading); font-size: 16px; font-weight: 800; margin: 0; color: #0F172A;">
            Detalhes do Pedido ${order.id}
          </h2>
          <button type="button" id="btn-close-order-modal" class="admin-btn admin-btn-secondary admin-btn-sm">✕</button>
        </div>

        <div class="admin-modal-body">
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 13px;">
              <div>
                <div style="color: #64748B; font-size: 11px; font-weight: 700; text-transform: uppercase;">Cliente / Empresa</div>
                <strong style="color: #0F172A; font-size: 14px;">${escapeHtml(order.customer.name)}</strong>
                <div style="color: #16A34A; font-weight: 700;">${escapeHtml(order.customer.company || 'Pessoa Física')}</div>
              </div>
              <div>
                <div style="color: #64748B; font-size: 11px; font-weight: 700; text-transform: uppercase;">Contato</div>
                <div>${escapeHtml(order.customer.phone || '-')}</div>
                <div style="color: #64748B; font-size: 11px;">${escapeHtml(order.customer.email || '-')}</div>
              </div>
            </div>
          </div>

          <h3 style="font-family: var(--admin-font-heading); font-size: 14px; font-weight: 800; margin: 0 0 10px 0;">Itens Solicitados</h3>
          <table class="admin-table" style="margin-bottom: 20px;">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantidade</th>
                <th>Valor Unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(it => `
                <tr>
                  <td><strong>${escapeHtml(it.name)}</strong> ${it.color ? `<span style="font-size: 11px; color: #64748B;">(${escapeHtml(it.color)})</span>` : ''}</td>
                  <td>${it.quantity} un.</td>
                  <td>R$ ${parseFloat(it.unitPrice).toFixed(2).replace('.', ',')}</td>
                  <td><strong style="color: #16A34A;">R$ ${(it.quantity * it.unitPrice).toFixed(2).replace('.', ',')}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="display: flex; justify-content: space-between; align-items: center; background: #F8FAFC; padding: 12px 16px; border-radius: 10px; border: 1px solid #E2E8F0; margin-bottom: 16px;">
            <div>
              <div style="font-size: 11px; color: #64748B; font-weight: 700;">FORMA DE PAGAMENTO</div>
              <div style="font-size: 13px; font-weight: 700; color: #0F172A;">${escapeHtml(order.paymentMethod || 'Pix')}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 11px; color: #64748B; font-weight: 700;">TOTAL DO PEDIDO</div>
              <div style="font-size: 18px; font-weight: 800; color: #16A34A;">
                R$ ${parseFloat(order.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          ${order.notes ? `
            <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; padding: 12px; font-size: 12px; color: #92400E;">
              <strong>Observação da Personalização:</strong> ${escapeHtml(order.notes)}
            </div>
          ` : ''}
        </div>

        <div class="admin-modal-footer">
          ${waUrl ? `
            <a href="${waUrl}" target="_blank" rel="noopener" class="admin-btn" style="background: #25D366; color: #FFFFFF;">
              Conversar no WhatsApp
            </a>
          ` : ''}
          <button type="button" id="btn-close-order-modal-2" class="admin-btn admin-btn-secondary">Fechar</button>
        </div>
      </div>
    </div>
  `;

  const closeFn = () => { modalContainer.innerHTML = ''; };
  document.getElementById('btn-close-order-modal')?.addEventListener('click', closeFn);
  document.getElementById('btn-close-order-modal-2')?.addEventListener('click', closeFn);
  document.getElementById('order-modal-backdrop')?.addEventListener('click', closeFn);
};

function getStatusBadgeClass(status) {
  switch (status) {
    case 'Pendente': return 'badge-yellow';
    case 'Aprovado': return 'badge-blue';
    case 'Em Produção': return 'badge-primary';
    case 'Concluído': return 'badge-green';
    default: return 'badge-gray';
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('admin-toasts');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `admin-toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
