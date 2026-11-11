// Coconut Ice - Admin Management Panel Controller
import { db } from './db.js';

let currentTab = 'dashboard';
let editingProductId = null;

export function initAdmin(containerId = 'admin-app-root') {
  const container = document.getElementById(containerId);
  if (!container) return;

  renderAdmin(container);

  // Subscribe to DB updates
  db.subscribe(({ key }) => {
    // Re-render current tab if it affects current view
    renderCurrentTab();
  });
}

function renderAdmin(container) {
  container.innerHTML = `
    <div class="admin-layout">
      <!-- Sidebar -->
      <aside class="admin-sidebar" id="admin-sidebar">
        <div class="admin-sidebar-header">
          <img src="/assets/logo-Mmxs5xoc.webp" alt="Coconut Ice" style="height: 32px; width: auto;" onerror="this.src='/favicon.png'">
          <div>
            <div style="font-weight: 700; font-size: 14px; color: #27211D; line-height: 1.2;">Coconut Ice</div>
            <span class="admin-brand-tag">Admin CMS</span>
          </div>
        </div>

        <nav class="admin-nav">
          <button class="admin-nav-item ${currentTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            Visão Geral
          </button>
          
          <button class="admin-nav-item ${currentTab === 'products' ? 'active' : ''}" data-tab="products">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
            Produtos & Estoque
          </button>

          <button class="admin-nav-item ${currentTab === 'orders' ? 'active' : ''}" data-tab="orders">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            Pedidos & Vendas
          </button>

          <button class="admin-nav-item ${currentTab === 'settings' ? 'active' : ''}" data-tab="settings">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            Configurações do Site
          </button>

          <button class="admin-nav-item ${currentTab === 'database' ? 'active' : ''}" data-tab="database">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
            Banco de Dados & Backup
          </button>
        </nav>

        <div style="padding: 16px; border-top: 1px solid var(--admin-border);">
          <a href="/" class="admin-btn admin-btn-secondary" style="width: 100%;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Voltar para a Loja
          </a>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="admin-main">
        <header class="admin-topbar">
          <div style="display: flex; align-items: center; gap: 14px;">
            <button id="admin-mobile-menu-toggle" class="admin-btn admin-btn-secondary admin-btn-sm" style="display: none;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <h1 id="admin-top-title" style="font-size: 18px; font-weight: 700; margin: 0; color: #27211D;">Painel Administrativo</h1>
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            <button id="btn-quick-new-product" class="admin-btn admin-btn-primary admin-btn-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Novo Produto
            </button>

            <a href="/" target="_blank" class="admin-btn admin-btn-secondary admin-btn-sm" title="Abrir loja em nova aba">
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
    });
  });

  const quickNewProductBtn = container.querySelector('#btn-quick-new-product');
  if (quickNewProductBtn) {
    quickNewProductBtn.addEventListener('click', () => openProductModal());
  }

  // Initial tab render
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
      if (titleEl) titleEl.textContent = 'Gerenciamento de Produtos';
      renderProductsView(contentEl);
      break;
    case 'orders':
      if (titleEl) titleEl.textContent = 'Pedidos & Orçamentos';
      renderOrdersView(contentEl);
      break;
    case 'settings':
      if (titleEl) titleEl.textContent = 'Configurações da Loja';
      renderSettingsView(contentEl);
      break;
    case 'database':
      if (titleEl) titleEl.textContent = 'Banco de Dados & Backups';
      renderDatabaseView(contentEl);
      break;
  }
}

// ----------------------------------------------------
// 1. DASHBOARD VIEW
// ----------------------------------------------------
function renderDashboardView(container) {
  const metrics = db.getMetrics();
  const recentOrders = db.getOrders().slice(0, 5);

  container.innerHTML = `
    <!-- KPI Metrics -->
    <div class="admin-metrics-grid">
      <div class="admin-metric-card">
        <div>
          <div class="admin-metric-label">Faturamento Total</div>
          <div class="admin-metric-value">R$ ${metrics.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          <div style="font-size: 11px; color: #3E7921; font-weight: 600; margin-top: 4px;">↑ Em pedidos corporativos</div>
        </div>
        <div class="admin-metric-icon" style="background: #eaf3e6; color: #3E7921;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
      </div>

      <div class="admin-metric-card">
        <div>
          <div class="admin-metric-label">Pedidos Registrados</div>
          <div class="admin-metric-value">${metrics.totalOrders}</div>
          <div style="font-size: 11px; color: #786C65; margin-top: 4px;">${metrics.pendingOrders} pendentes de aprovação</div>
        </div>
        <div class="admin-metric-icon" style="background: #f7ede6; color: #A96739;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        </div>
      </div>

      <div class="admin-metric-card">
        <div>
          <div class="admin-metric-label">Produtos no Catálogo</div>
          <div class="admin-metric-value">${metrics.totalProducts}</div>
          <div style="font-size: 11px; color: #3E7921; margin-top: 4px;">${metrics.activeProducts} ativos com pronta entrega</div>
        </div>
        <div class="admin-metric-icon" style="background: #eef2ff; color: #4338ca;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg>
        </div>
      </div>

      <div class="admin-metric-card">
        <div>
          <div class="admin-metric-label">Cashback de Boas-Vindas</div>
          <div class="admin-metric-value">${metrics.cashbackPercent}%</div>
          <div style="font-size: 11px; color: #A96739; margin-top: 4px;">Ativo no pop-up inicial</div>
        </div>
        <div class="admin-metric-icon" style="background: #fef8e7; color: #b45309;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>
        </div>
      </div>
    </div>

    <!-- Quick Actions Banner -->
    <div class="admin-card" style="background: linear-gradient(135deg, #FAF4EF 0%, #F5EAE0 100%); border-color: rgba(169, 103, 57, 0.2);">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 style="font-size: 16px; font-weight: 700; color: #27211D; margin: 0 0 4px 0;">Painel de Controle em Tempo Real</h2>
          <p style="font-size: 13px; color: #786C65; margin: 0;">Todas as alterações feitas nos produtos, preços ou banners refletem instantaneamente no site principal.</p>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button id="dash-btn-new-product" class="admin-btn admin-btn-primary">
            + Cadastrar Novo Produto
          </button>
          <button id="dash-btn-simulate-order" class="admin-btn admin-btn-secondary">
            Simular Novo Pedido
          </button>
        </div>
      </div>
    </div>

    <!-- Recent Orders Table -->
    <div class="admin-card">
      <div class="admin-card-header">
        <h2 class="admin-card-title">Pedidos Recentes</h2>
        <button class="admin-btn admin-btn-secondary admin-btn-sm" id="dash-btn-view-all-orders">Ver Todos</button>
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
                <td><strong>${order.id}</strong></td>
                <td>
                  <div style="font-weight: 600;">${order.customer.name}</div>
                  <div style="font-size: 11px; color: #786C65;">${order.customer.company || 'Pessoa Física'}</div>
                </td>
                <td>${order.items.map(i => `${i.quantity}x ${i.name}`).join('<br>')}</td>
                <td><strong style="color: #3E7921;">R$ ${parseFloat(order.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></td>
                <td><span class="admin-badge ${getStatusBadgeClass(order.status)}">${order.status}</span></td>
                <td style="color: #786C65; font-size: 12px;">${order.date}</td>
                <td style="text-align: right;">
                  <button class="admin-btn admin-btn-secondary admin-btn-sm" onclick="window.viewOrderDetails('${order.id}')">Detalhes</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Attach dashboard buttons
  const newProdBtn = container.querySelector('#dash-btn-new-product');
  if (newProdBtn) newProdBtn.addEventListener('click', () => openProductModal());

  const viewAllOrdersBtn = container.querySelector('#dash-btn-view-all-orders');
  if (viewAllOrdersBtn) viewAllOrdersBtn.addEventListener('click', () => switchTab('orders'));

  const simOrderBtn = container.querySelector('#dash-btn-simulate-order');
  if (simOrderBtn) simOrderBtn.addEventListener('click', () => simulateTestOrder());
}

// ----------------------------------------------------
// 2. PRODUCTS VIEW (CATÁLOGO CRUD)
// ----------------------------------------------------
function renderProductsView(container) {
  const products = db.getProducts();
  const categories = db.getCategories();

  container.innerHTML = `
    <div class="admin-card">
      <div class="admin-card-header">
        <div>
          <h2 class="admin-card-title">Catálogo de Produtos (${products.length})</h2>
          <p style="font-size: 12px; color: #786C65; margin: 4px 0 0 0;">Adicione, edite preços ou remova produtos que aparecem no site.</p>
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
              <th style="width: 60px;">Foto</th>
              <th>Produto</th>
              <th>SKU</th>
              <th>Categoria</th>
              <th>Preço Unitário</th>
              <th>Desconto Máx.</th>
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
    return `<tr><td colspan="8" style="text-align: center; padding: 32px; color: #786C65;">Nenhum produto encontrado.</td></tr>`;
  }

  return products.map(prod => `
    <tr>
      <td>
        <img src="${prod.image || '/favicon.png'}" alt="${prod.name}" style="width: 44px; height: 44px; object-fit: contain; border-radius: 8px; border: 1px solid #E8E2D9; background: #fff;">
      </td>
      <td>
        <div style="font-weight: 600; color: #27211D;">${prod.name}</div>
        <div style="font-size: 11px; color: #786C65; max-width: 320px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${prod.description || ''}</div>
      </td>
      <td><code style="background: #F5EFEA; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600; color: #A96739;">${prod.sku || '-'}</code></td>
      <td><span class="admin-badge badge-gray">${prod.category || 'Geral'}</span></td>
      <td>
        <div style="font-weight: 700; color: #27211D;">R$ ${parseFloat(prod.basePrice).toFixed(2).replace('.', ',')}</div>
        ${prod.originalPrice ? `<div style="font-size: 10px; text-decoration: line-through; color: #9CA3AF;">R$ ${parseFloat(prod.originalPrice).toFixed(2).replace('.', ',')}</div>` : ''}
      </td>
      <td>
        ${prod.maxDiscount ? `<span class="admin-badge badge-green">-${prod.maxDiscount}%</span>` : '-'}
      </td>
      <td>
        ${prod.inStock 
          ? `<span class="admin-badge badge-green">Em Estoque</span>` 
          : `<span class="admin-badge badge-yellow">Esgotado</span>`}
      </td>
      <td style="text-align: right;">
        <div style="display: inline-flex; gap: 6px;">
          <button class="admin-btn admin-btn-secondary admin-btn-sm" onclick="window.editProduct('${prod.id}')" title="Editar Produto">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Editar
          </button>
          <button class="admin-btn admin-btn-danger admin-btn-sm" onclick="window.deleteProduct('${prod.id}')" title="Excluir">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ----------------------------------------------------
// 3. ORDERS VIEW (PEDIDOS CMS)
// ----------------------------------------------------
function renderOrdersView(container) {
  const orders = db.getOrders();

  container.innerHTML = `
    <div class="admin-card">
      <div class="admin-card-header">
        <div>
          <h2 class="admin-card-title">Gestão de Pedidos & Orçamentos (${orders.length})</h2>
          <p style="font-size: 12px; color: #786C65; margin: 4px 0 0 0;">Acompanhe solicitações de clientes corporativos e atualize o status da produção.</p>
        </div>
        <div>
          <button id="btn-create-order" class="admin-btn admin-btn-primary">
            + Novo Pedido Manual
          </button>
        </div>
      </div>

      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data/Hora</th>
              <th>Cliente & Empresa</th>
              <th>Contato</th>
              <th>Itens do Pedido</th>
              <th>Total</th>
              <th>Status do Pedido</th>
              <th style="text-align: right;">Ações</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map(o => `
              <tr>
                <td><strong>${o.id}</strong></td>
                <td style="font-size: 12px; color: #786C65;">${o.date}</td>
                <td>
                  <div style="font-weight: 600;">${o.customer.name}</div>
                  <div style="font-size: 11px; color: #A96739; font-weight: 600;">${o.customer.company || 'Pessoa Física'}</div>
                </td>
                <td style="font-size: 12px;">
                  <div>${o.customer.phone || '-'}</div>
                  <div style="color: #786C65; font-size: 11px;">${o.customer.email || '-'}</div>
                </td>
                <td style="font-size: 12px;">
                  ${o.items.map(it => `<div><strong>${it.quantity}x</strong> ${it.name}</div>`).join('')}
                </td>
                <td>
                  <strong style="color: #3E7921; font-size: 14px;">R$ ${parseFloat(o.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                  <div style="font-size: 10px; color: #786C65;">${o.paymentMethod || 'À vista'}</div>
                </td>
                <td>
                  <select class="admin-select" style="font-size: 12px; padding: 4px 8px; width: 130px;" onchange="window.updateOrderStatus('${o.id}', this.value)">
                    <option value="Pendente" ${o.status === 'Pendente' ? 'selected' : ''}>⏳ Pendente</option>
                    <option value="Aprovado" ${o.status === 'Aprovado' ? 'selected' : ''}>✓ Aprovado</option>
                    <option value="Em Produção" ${o.status === 'Em Produção' ? 'selected' : ''}>⚙️ Em Produção</option>
                    <option value="Enviado" ${o.status === 'Enviado' ? 'selected' : ''}>🚚 Enviado</option>
                    <option value="Concluído" ${o.status === 'Concluído' ? 'selected' : ''}>⭐ Concluído</option>
                    <option value="Cancelado" ${o.status === 'Cancelado' ? 'selected' : ''}>✕ Cancelado</option>
                  </select>
                </td>
                <td style="text-align: right;">
                  <button class="admin-btn admin-btn-danger admin-btn-sm" onclick="window.deleteOrder('${o.id}')" title="Excluir Pedido">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  const createOrderBtn = container.querySelector('#btn-create-order');
  if (createOrderBtn) createOrderBtn.addEventListener('click', () => simulateTestOrder());
}

// ----------------------------------------------------
// 4. SETTINGS VIEW (CMS DO SITE)
// ----------------------------------------------------
function renderSettingsView(container) {
  const settings = db.getSettings();

  container.innerHTML = `
    <div class="admin-card" style="max-width: 800px;">
      <div class="admin-card-header">
        <div>
          <h2 class="admin-card-title">Configurações Gerais & Conteúdo da Loja</h2>
          <p style="font-size: 12px; color: #786C65; margin: 4px 0 0 0;">Altere mensagens promocionais, cashback e formas de contato.</p>
        </div>
      </div>

      <form id="settings-form">
        <div class="admin-form-group">
          <label class="admin-form-label">Faixa de Anúncio Superior (Aviso no Topo do Site)</label>
          <input type="text" id="setting-announcement" class="admin-input" value="${settings.announcementText || ''}">
          <div class="admin-form-help">Texto exibido na barra superior em todas as páginas da loja.</div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="admin-form-group">
            <label class="admin-form-label">Porcentagem de Cashback de Boas-Vindas (%)</label>
            <input type="number" id="setting-cashback" class="admin-input" value="${settings.cashbackPercent || 3}" min="1" max="50">
            <div class="admin-form-help">Atualiza o pop-up de boas-vindas do site automaticamente.</div>
          </div>

          <div class="admin-form-group">
            <label class="admin-form-label">Desconto no Pix à Vista (%)</label>
            <input type="number" id="setting-pix" class="admin-input" value="${settings.pixDiscountPercent || 5}" min="0" max="30">
            <div class="admin-form-help">Desconto concedido nas compras à vista.</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="admin-form-group">
            <label class="admin-form-label">WhatsApp Comercial (com DDD)</label>
            <input type="text" id="setting-whatsapp" class="admin-input" value="${settings.whatsappNumber || ''}">
            <div class="admin-form-help">Número para o botão flutuante de atendimento.</div>
          </div>

          <div class="admin-form-group">
            <label class="admin-form-label">E-mail de Suporte</label>
            <input type="email" id="setting-email" class="admin-input" value="${settings.supportEmail || ''}">
          </div>
        </div>

        <div class="admin-form-group">
          <label class="admin-form-label">Nome da Empresa / Loja</label>
          <input type="text" id="setting-store-name" class="admin-input" value="${settings.storeName || ''}">
        </div>

        <div style="margin-top: 24px; display: flex; justify-content: flex-end;">
          <button type="submit" class="admin-btn admin-btn-primary" style="padding: 10px 24px;">
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  `;

  const form = container.querySelector('#settings-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const updated = {
        announcementText: container.querySelector('#setting-announcement').value,
        cashbackPercent: parseInt(container.querySelector('#setting-cashback').value, 10) || 3,
        pixDiscountPercent: parseInt(container.querySelector('#setting-pix').value, 10) || 5,
        whatsappNumber: container.querySelector('#setting-whatsapp').value,
        supportEmail: container.querySelector('#setting-email').value,
        storeName: container.querySelector('#setting-store-name').value,
      };

      db.saveSettings(updated);
      showToast('Configurações salvas e aplicadas com sucesso!', 'success');
    });
  }
}

// ----------------------------------------------------
// 5. DATABASE & BACKUP VIEW
// ----------------------------------------------------
function renderDatabaseView(container) {
  const metrics = db.getMetrics();

  container.innerHTML = `
    <div class="admin-card" style="max-width: 800px;">
      <div class="admin-card-header">
        <div>
          <h2 class="admin-card-title">Gestão do Banco de Dados & Backups</h2>
          <p style="font-size: 12px; color: #786C65; margin: 4px 0 0 0;">O banco de dados do Coconut Ice armazena produtos, pedidos e configurações com persistência local instantânea.</p>
        </div>
      </div>

      <div style="background: #FDFBF9; border: 1px solid #E8E2D9; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
        <h3 style="font-size: 14px; font-weight: 700; color: #27211D; margin: 0 0 10px 0;">Status do Banco de Dados</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; font-size: 13px;">
          <div><strong>${metrics.totalProducts}</strong> Produtos registrados</div>
          <div><strong>${metrics.totalOrders}</strong> Pedidos salvos</div>
          <div><strong>7</strong> Categorias ativas</div>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div>
          <h4 style="font-size: 14px; font-weight: 700; margin: 0 0 6px 0;">1. Exportar Backup Completo (JSON)</h4>
          <p style="font-size: 12px; color: #786C65; margin: 0 0 10px 0;">Baixe uma cópia integral do catálogo e pedidos para arquivamento ou migração.</p>
          <button id="btn-export-backup" class="admin-btn admin-btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Baixar Arquivo JSON de Backup
          </button>
        </div>

        <hr style="border: none; border-top: 1px solid #E8E2D9;">

        <div>
          <h4 style="font-size: 14px; font-weight: 700; margin: 0 0 6px 0;">2. Importar / Restaurar Backup</h4>
          <p style="font-size: 12px; color: #786C65; margin: 0 0 10px 0;">Selecione um arquivo de backup em JSON ou cole o conteúdo para substituir os dados atuais.</p>
          <textarea id="import-json-text" class="admin-textarea" rows="4" placeholder="Cole o código JSON do backup aqui..."></textarea>
          <div style="margin-top: 10px; display: flex; gap: 10px;">
            <button id="btn-import-backup" class="admin-btn admin-btn-primary">
              Restaurar Dados do JSON
            </button>
          </div>
        </div>

        <hr style="border: none; border-top: 1px solid #E8E2D9;">

        <div>
          <h4 style="font-size: 14px; font-weight: 700; color: #b91c1c; margin: 0 0 6px 0;">3. Restaurar Padrões de Fábrica</h4>
          <p style="font-size: 12px; color: #786C65; margin: 0 0 10px 0;">Restaura o catálogo oficial da Coconut Ice com todos os produtos originais e pedidos demonstrativos.</p>
          <button id="btn-reset-factory" class="admin-btn admin-btn-danger">
            Restaurar Catálogo Original
          </button>
        </div>
      </div>
    </div>
  `;

  // Attach buttons
  const exportBtn = container.querySelector('#btn-export-backup');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const backupStr = db.exportBackup();
      const blob = new Blob([backupStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `coconut-ice-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Backup exportado com sucesso!', 'success');
    });
  }

  const importBtn = container.querySelector('#btn-import-backup');
  if (importBtn) {
    importBtn.addEventListener('click', () => {
      const text = container.querySelector('#import-json-text').value.trim();
      if (!text) {
        showToast('Cole o conteúdo JSON para importar.', 'error');
        return;
      }
      const res = db.importBackup(text);
      if (res.success) {
        showToast('Banco de dados restaurado com sucesso!', 'success');
        renderCurrentTab();
      } else {
        showToast('Erro ao importar JSON: ' + res.error, 'error');
      }
    });
  }

  const resetBtn = container.querySelector('#btn-reset-factory');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Tem certeza de que deseja restaurar os dados originais? Todas as alterações serão redefinidas.')) {
        db.resetToDefaults();
        showToast('Catálogo restaurado para os dados de fábrica!', 'success');
        renderCurrentTab();
      }
    });
  }
}

// ----------------------------------------------------
// PRODUCT MODAL (CRIAR / EDITAR)
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
    description: '',
    image: 'https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/6cea5fd8-5789-492c-98ac-350cdc14902a-1789132069129.png?width=500&quality=72&resize=contain',
    inStock: true,
    featured: true,
  };

  const categories = db.getCategories();

  const modalContainer = document.getElementById('admin-modals-container');
  if (!modalContainer) return;

  modalContainer.innerHTML = `
    <div class="admin-modal-backdrop" id="product-modal-backdrop">
      <div class="admin-modal" onclick="event.stopPropagation()">
        <div class="admin-modal-header">
          <h2 style="font-size: 16px; font-weight: 700; margin: 0; color: #27211D;">
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

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px;">
            <div class="admin-form-group">
              <label class="admin-form-label">Preço Base (R$) *</label>
              <input type="number" step="0.01" id="prod-price" class="admin-input" required value="${product.basePrice}">
            </div>

            <div class="admin-form-group">
              <label class="admin-form-label">Preço De (R$)</label>
              <input type="number" step="0.01" id="prod-original-price" class="admin-input" value="${product.originalPrice || ''}">
            </div>

            <div class="admin-form-group">
              <label class="admin-form-label">Desconto Máx. (%)</label>
              <input type="number" id="prod-discount" class="admin-input" value="${product.maxDiscount || 0}">
            </div>
          </div>

          <div class="admin-form-group">
            <label class="admin-form-label">URL da Imagem do Produto</label>
            <input type="url" id="prod-image" class="admin-input" value="${escapeHtml(product.image || '')}">
            <div style="display: flex; gap: 8px; margin-top: 6px; align-items: center;">
              <span style="font-size: 11px; color: #786C65;">Sugestões de fotos:</span>
              <button type="button" class="admin-btn admin-btn-secondary admin-btn-sm" style="font-size: 10px; padding: 2px 6px;" onclick="document.getElementById('prod-image').value='https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/6cea5fd8-5789-492c-98ac-350cdc14902a-1789132069129.png?width=500&quality=72&resize=contain'">Squeeze Inox</button>
              <button type="button" class="admin-btn admin-btn-secondary admin-btn-sm" style="font-size: 10px; padding: 2px 6px;" onclick="document.getElementById('prod-image').value='https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/2ab75319-0940-4840-80c7-450a6f03a274-1786948490046.png?width=500&quality=72&resize=contain'">Mochila USB</button>
            </div>
          </div>

          <div class="admin-form-group">
            <label class="admin-form-label">Descrição do Produto</label>
            <textarea id="prod-desc" class="admin-textarea" rows="3">${escapeHtml(product.description || '')}</textarea>
          </div>

          <div style="display: flex; gap: 20px; align-items: center; margin-top: 10px;">
            <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
              <input type="checkbox" id="prod-instock" ${product.inStock ? 'checked' : ''}>
              Disponível em Estoque
            </label>

            <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
              <input type="checkbox" id="prod-featured" ${product.featured ? 'checked' : ''}>
              Destaque na Página Inicial
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

  const closeBtn = document.getElementById('btn-close-product-modal');
  const cancelBtn = document.getElementById('btn-cancel-product-modal');
  const saveBtn = document.getElementById('btn-save-product-modal');
  const backdrop = document.getElementById('product-modal-backdrop');

  function closeModal() {
    modalContainer.innerHTML = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const name = document.getElementById('prod-name').value.trim();
      if (!name) {
        showToast('Informe o nome do produto', 'error');
        return;
      }

      const productData = {
        id: editingProductId,
        name,
        sku: document.getElementById('prod-sku').value.trim(),
        category: document.getElementById('prod-category').value,
        basePrice: parseFloat(document.getElementById('prod-price').value) || 0,
        originalPrice: parseFloat(document.getElementById('prod-original-price').value) || 0,
        maxDiscount: parseInt(document.getElementById('prod-discount').value, 10) || 0,
        image: document.getElementById('prod-image').value.trim(),
        description: document.getElementById('prod-desc').value.trim(),
        inStock: document.getElementById('prod-instock').checked,
        featured: document.getElementById('prod-featured').checked,
      };

      db.saveProduct(productData);
      showToast(editingProductId ? 'Produto atualizado com sucesso!' : 'Novo produto cadastrado!', 'success');
      closeModal();
      renderCurrentTab();
    });
  }
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
    showToast('Produto excluído.', 'success');
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

  modalContainer.innerHTML = `
    <div class="admin-modal-backdrop" id="order-modal-backdrop">
      <div class="admin-modal" onclick="event.stopPropagation()">
        <div class="admin-modal-header">
          <h2 style="font-size: 16px; font-weight: 700; margin: 0; color: #27211D;">Detalhes do Pedido ${order.id}</h2>
          <button type="button" id="btn-close-order-modal" class="admin-btn admin-btn-secondary admin-btn-sm">✕</button>
        </div>

        <div class="admin-modal-body">
          <div style="background: #FDFBF9; border: 1px solid #E8E2D9; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px;">
              <div>
                <div style="color: #786C65; font-size: 11px;">CLIENTE / EMPRESA</div>
                <strong style="color: #27211D;">${order.customer.name}</strong>
                <div>${order.customer.company || 'Pessoa Física'}</div>
              </div>
              <div>
                <div style="color: #786C65; font-size: 11px;">CONTATO</div>
                <div>${order.customer.phone || '-'}</div>
                <div>${order.customer.email || '-'}</div>
              </div>
            </div>
          </div>

          <h3 style="font-size: 14px; font-weight: 700; margin: 0 0 10px 0;">Itens Solicitados</h3>
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
                  <td><strong>${it.name}</strong></td>
                  <td>${it.quantity} un.</td>
                  <td>R$ ${parseFloat(it.unitPrice).toFixed(2).replace('.', ',')}</td>
                  <td><strong>R$ ${(it.quantity * it.unitPrice).toFixed(2).replace('.', ',')}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="text-align: right; font-size: 16px; font-weight: 700; color: #3E7921; margin-bottom: 16px;">
            Total do Pedido: R$ ${parseFloat(order.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>

          ${order.notes ? `
            <div style="background: #FFF9E6; border: 1px solid #FDE68A; border-radius: 8px; padding: 12px; font-size: 12px; color: #92400E;">
              <strong>Observação da Personalização:</strong> ${order.notes}
            </div>
          ` : ''}
        </div>

        <div class="admin-modal-footer">
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

function simulateTestOrder() {
  const companies = ['Itaú Unibanco', 'Nubank', 'QuintoAndar', 'XP Investimentos', 'Ambev'];
  const names = ['Guilherme Prado', 'Beatriz Costa', 'Fernanda Lima', 'Mateus Souza', 'Julia Alencar'];
  
  const randomCompany = companies[Math.floor(Math.random() * companies.length)];
  const randomName = names[Math.floor(Math.random() * names.length)];

  const products = db.getProducts();
  const sampleProd = products[Math.floor(Math.random() * products.length)] || products[0];
  const qty = [50, 100, 200, 500][Math.floor(Math.random() * 4)];
  const total = qty * sampleProd.basePrice;

  const newOrder = db.addOrder({
    customer: {
      name: randomName,
      company: randomCompany,
      email: `${randomName.toLowerCase().replace(' ', '.')}@empresa.com.br`,
      phone: '(11) 9' + Math.floor(10000000 + Math.random() * 90000000),
    },
    items: [
      { productId: sampleProd.id, name: sampleProd.name, quantity: qty, unitPrice: sampleProd.basePrice, total }
    ],
    total,
    paymentMethod: 'Pix à vista (5% OFF)',
    notes: 'Gravação da logomarca corporativa colorida em serigrafia.',
  });

  showToast(`Novo pedido ${newOrder.id} simulado com sucesso!`, 'success');
  renderCurrentTab();
}

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
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
