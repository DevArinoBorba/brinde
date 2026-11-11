// Gordinho Brindes — camada de dados do navegador
// Catálogo, categorias, configurações e pedidos vivem no banco (API /api). Aqui fica um cache em
// memória para que leituras continuem síncronas; gravações do painel vão para a API e, em caso de
// erro, o cache é recarregado do servidor. Sacola, favoritos e perfil do cliente ficam no navegador.
import { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS, DEFAULT_SETTINGS } from './seed-data.js';
import { unitPriceForQty, isPriceOnRequest } from './pricing.js';

const API_BASE = '/api';

const STORAGE_KEYS = {
  AUTH: 'gordinho_brindes_auth_v2',
  CART: 'gordinho_brindes_cart_v1',
  FAVORITES: 'gordinho_brindes_favorites_v1',
  CUSTOMER: 'gordinho_brindes_customer_v1',
};

// Chaves da v1 (dados guardados só no navegador), removidas na primeira carga
const LEGACY_KEYS = [
  'gordinho_brindes_products_v1',
  'gordinho_brindes_orders_v1',
  'gordinho_brindes_categories_v1',
  'gordinho_brindes_settings_v1',
  'gordinho_brindes_auth_v1',
];

// Avisa outras abas (admin <-> loja) que o banco mudou
const CHANNEL_NAME = 'gordinho-brindes-db';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class Database {
  constructor() {
    this.listeners = new Set();
    this.errorListeners = new Set();
    this.cache = {
      products: DEFAULT_PRODUCTS,
      categories: DEFAULT_CATEGORIES,
      settings: DEFAULT_SETTINGS,
      orders: [],
    };
    this.online = false;

    if (typeof localStorage !== 'undefined') {
      LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
    }

    if (typeof window !== 'undefined') {
      // Sacola/favoritos alterados em outra aba
      const ownKeys = new Set(Object.values(STORAGE_KEYS));
      window.addEventListener('storage', (e) => {
        if (!e.key || !ownKeys.has(e.key)) return;
        this._notify(e.key, this._getItem(e.key, null));
      });

      if ('BroadcastChannel' in window) {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = () => this.refresh();
      }
    }

    this.ready = this.refresh();
  }

  // --- INFRA ---
  _getItem(key, fallback) {
    if (typeof localStorage === 'undefined') return fallback;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn('Storage read failed:', e);
      return fallback;
    }
  }

  _setItem(key, value) {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this._notify(key, value);
    } catch (e) {
      console.error('Storage write failed:', e);
    }
  }

  async _api(path, { method = 'GET', body, auth = false } = {}) {
    const headers = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (auth) {
      const token = this.getAuthSession().token;
      if (token) headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const data = res.status === 204 ? null : await res.json().catch(() => null);
    if (!res.ok) {
      if (res.status === 401 && auth) this.logout();
      throw new ApiError(data?.error || `Erro ${res.status} ao falar com o servidor.`, res.status);
    }
    return data;
  }

  // Grava no servidor em segundo plano; se falhar, avisa e restaura o estado do banco
  _persist(request) {
    return request
      .then((result) => {
        this.channel?.postMessage('changed');
        return result;
      })
      .catch((err) => {
        console.error('[db] gravação falhou:', err);
        this._emitError(err.message || 'Não foi possível salvar no servidor.');
        return this.refresh();
      });
  }

  /** Recarrega catálogo, configurações (e pedidos, se logado no painel) do servidor. */
  async refresh() {
    try {
      const data = await this._api('/store');
      this.cache.products = data.products;
      this.cache.categories = data.categories;
      this.cache.settings = { ...DEFAULT_SETTINGS, ...data.settings };
      this.online = true;
      if (this.isAuthenticated()) {
        this.cache.orders = await this._api('/admin/orders', { auth: true }).catch((err) => {
          if (err.status !== 401) throw err;
          return [];
        });
      }
    } catch (err) {
      this.online = false;
      console.warn('[db] API indisponível, usando catálogo padrão:', err.message);
    }
    this._notify('store', this.cache);
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  onError(fn) {
    this.errorListeners.add(fn);
    return () => this.errorListeners.delete(fn);
  }

  _notify(key, data) {
    this.listeners.forEach(fn => {
      try {
        fn({ key, data, timestamp: Date.now() });
      } catch (err) {
        console.error('Subscriber error:', err);
      }
    });
  }

  _emitError(message) {
    this.errorListeners.forEach((fn) => {
      try { fn(message); } catch (err) { console.error('Error listener failed:', err); }
    });
  }

  // --- PRODUCTS CRUD ---
  getProducts() {
    return this.cache.products;
  }

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id || p.slug === id || p.sku === id) || null;
  }

  getUnitPriceForQty(product, qty = 100) {
    return unitPriceForQty(product, qty);
  }

  isPriceOnRequest(product) {
    return isPriceOnRequest(product);
  }

  buildDefaultTiers(basePrice, originalPrice, maxDiscount = 60) {
    const bp = parseFloat(basePrice) || 19.90;
    const op = parseFloat(originalPrice) || parseFloat((bp * 2.5).toFixed(2));
    return [
      { label: '1–9', minQty: 1, maxQty: 9, price: op, discount: 0 },
      { label: '10–49', minQty: 10, maxQty: 49, price: parseFloat((bp * 1.45).toFixed(2)), discount: Math.round((1 - (bp * 1.45) / op) * 100) },
      { label: '50–99', minQty: 50, maxQty: 99, price: parseFloat((bp * 1.18).toFixed(2)), discount: Math.round((1 - (bp * 1.18) / op) * 100) },
      { label: '100–499', minQty: 100, maxQty: 499, price: bp, discount: maxDiscount || Math.round((1 - bp / op) * 100) },
      { label: '500–999', minQty: 500, maxQty: 999, price: parseFloat((bp * 0.92).toFixed(2)), discount: Math.min(95, (maxDiscount || 60) + 2) },
      { label: '1000+', minQty: 1000, maxQty: '+', price: parseFloat((bp * 0.88).toFixed(2)), discount: Math.min(95, (maxDiscount || 60) + 4) },
    ];
  }

  saveProduct(productData) {
    const products = [...this.getProducts()];
    const existingIndex = products.findIndex(p => p.id === productData.id);
    const existing = existingIndex >= 0 ? products[existingIndex] : null;

    const basePrice = parseFloat(productData.basePrice) || 0;
    // Sem preço no admin: produto "sob consulta" (sem faixas; valor combinado no WhatsApp)
    const priceOnRequest = !(basePrice > 0);
    const originalPrice = priceOnRequest ? 0 : parseFloat(productData.originalPrice) || parseFloat((basePrice * 2.2).toFixed(2));
    const maxDiscount = priceOnRequest ? 0 : parseInt(productData.maxDiscount, 10) || Math.max(0, Math.round((1 - basePrice / originalPrice) * 100));

    let tiers = productData.tiers || (existing ? existing.tiers : null);
    if (priceOnRequest) {
      tiers = [];
    } else if (!Array.isArray(tiers) || tiers.length === 0) {
      tiers = this.buildDefaultTiers(basePrice, originalPrice, maxDiscount);
    } else if (existing && existing.basePrice !== basePrice && !productData.customTiersEdited) {
      // Scale tiers proportionally when basePrice is changed in Admin
      const ratio = existing.basePrice > 0 ? basePrice / existing.basePrice : 1;
      tiers = tiers.map(t => ({
        ...t,
        price: t.minQty === 100 ? basePrice : parseFloat((t.price * ratio).toFixed(2)),
      }));
    }

    const sections = Array.isArray(productData.sections) && productData.sections.length > 0
      ? productData.sections
      : (existing && existing.sections ? existing.sections : ['mais-vendidos', 'destaques']);

    const product = {
      ...(existing || {}),
      ...productData,
      basePrice,
      originalPrice,
      maxDiscount,
      priceOnRequest,
      stockQuantity: parseInt(productData.stockQuantity ?? (existing ? existing.stockQuantity : 1000), 10) || 0,
      sections,
      tiers,
      colors: Array.isArray(productData.colors) && productData.colors.length > 0
        ? productData.colors
        : (existing?.colors || ['#0F3822', '#FAB818', '#111111']),
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      products[existingIndex] = product;
    } else {
      product.id = product.id || 'prod-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
      product.slug = product.slug || product.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-');
      product.createdAt = new Date().toISOString();
      products.unshift(product);
    }

    this.cache.products = products;
    this._notify('products', products);
    this._persist(this._api(`/admin/products/${encodeURIComponent(product.id)}`, { method: 'PUT', body: product, auth: true }));
    return product;
  }

  deleteProduct(id) {
    this.cache.products = this.getProducts().filter(p => p.id !== id);
    this._notify('products', this.cache.products);
    this._persist(this._api(`/admin/products/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true }));
    return true;
  }

  // --- CART (navegador) ---
  getCart() {
    return this._getItem(STORAGE_KEYS.CART, []);
  }

  addToCart({ productId, quantity = 100, color = '', notes = '' }) {
    const product = this.getProductById(productId);
    if (!product) return null;

    const cart = this.getCart();
    const qty = Math.max(1, parseInt(quantity, 10) || 100);
    const selectedColor = color || (product.colorNames?.[0]?.name) || 'Padrão';

    const priceOnRequest = isPriceOnRequest(product);
    const existingIndex = cart.findIndex(item => item.productId === product.id && item.color === selectedColor);
    if (existingIndex >= 0) {
      const newQty = cart[existingIndex].quantity + qty;
      const unitPrice = priceOnRequest ? 0 : this.getUnitPriceForQty(product, newQty);
      cart[existingIndex].quantity = newQty;
      cart[existingIndex].unitPrice = unitPrice;
      cart[existingIndex].total = parseFloat((newQty * unitPrice).toFixed(2));
      cart[existingIndex].priceOnRequest = priceOnRequest;
      if (notes) cart[existingIndex].notes = notes;
    } else {
      const unitPrice = priceOnRequest ? 0 : this.getUnitPriceForQty(product, qty);
      cart.push({
        priceOnRequest,
        id: 'item-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
        productId: product.id,
        name: product.name,
        sku: product.sku,
        image: product.image,
        quantity: qty,
        color: selectedColor,
        unitPrice,
        total: parseFloat((qty * unitPrice).toFixed(2)),
        notes: notes || '',
      });
    }

    this._setItem(STORAGE_KEYS.CART, cart);
    return cart;
  }

  updateCartItem(itemIdOrIndex, updates = {}) {
    const cart = this.getCart();
    const idx = typeof itemIdOrIndex === 'number'
      ? itemIdOrIndex
      : cart.findIndex(i => i.id === itemIdOrIndex || i.productId === itemIdOrIndex);
    if (idx < 0 || !cart[idx]) return cart;

    const item = cart[idx];
    const product = this.getProductById(item.productId);
    const newQty = Math.max(1, parseInt(updates.quantity ?? item.quantity, 10) || 1);
    const priceOnRequest = product ? isPriceOnRequest(product) : !!item.priceOnRequest;
    const unitPrice = priceOnRequest ? 0 : product ? this.getUnitPriceForQty(product, newQty) : item.unitPrice;

    cart[idx] = {
      ...item,
      ...updates,
      quantity: newQty,
      priceOnRequest,
      unitPrice,
      total: parseFloat((newQty * unitPrice).toFixed(2)),
    };
    this._setItem(STORAGE_KEYS.CART, cart);
    return cart;
  }

  removeFromCart(itemIdOrIndex) {
    let cart = this.getCart();
    if (typeof itemIdOrIndex === 'number') {
      cart.splice(itemIdOrIndex, 1);
    } else {
      cart = cart.filter(i => i.id !== itemIdOrIndex && i.productId !== itemIdOrIndex);
    }
    this._setItem(STORAGE_KEYS.CART, cart);
    return cart;
  }

  clearCart() {
    this._setItem(STORAGE_KEYS.CART, []);
    return [];
  }

  getCartTotals(couponCode = '') {
    const cart = this.getCart();
    const settings = this.getSettings();
    const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    const totalItems = cart.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0);

    let discountPercent = 0;
    let appliedCoupon = null;
    if (couponCode) {
      const cleanCode = couponCode.trim().toUpperCase();
      const coupons = settings.coupons || DEFAULT_SETTINGS.coupons;
      const found = coupons.find(c => c.active && c.code.toUpperCase() === cleanCode);
      if (found) {
        discountPercent = parseFloat(found.discountPercent) || 0;
        appliedCoupon = found;
      }
    }

    const discountAmount = parseFloat(((subtotal * discountPercent) / 100).toFixed(2));
    const total = Math.max(0, parseFloat((subtotal - discountAmount).toFixed(2)));
    const pixTotal = parseFloat((total * (1 - (settings.pixDiscountPercent ?? 5) / 100)).toFixed(2));

    return {
      itemCount: cart.length,
      onRequestCount: cart.filter(item => item.priceOnRequest).length,
      totalUnits: totalItems,
      subtotal,
      discountPercent,
      discountAmount,
      appliedCoupon,
      total,
      pixTotal,
    };
  }

  // --- FAVORITES (navegador) ---
  getFavorites() {
    return this._getItem(STORAGE_KEYS.FAVORITES, []);
  }

  isFavorite(productId) {
    return this.getFavorites().includes(productId);
  }

  toggleFavorite(productId) {
    const favs = this.getFavorites();
    const idx = favs.indexOf(productId);
    if (idx >= 0) {
      favs.splice(idx, 1);
    } else {
      favs.push(productId);
    }
    this._setItem(STORAGE_KEYS.FAVORITES, favs);
    return favs.includes(productId);
  }

  // --- CUSTOMER PROFILE (navegador) ---
  getCustomerProfile() {
    return this._getItem(STORAGE_KEYS.CUSTOMER, {
      name: '',
      company: '',
      cnpj: '',
      email: '',
      phone: '',
    });
  }

  saveCustomerProfile(profile) {
    const current = this.getCustomerProfile();
    const updated = { ...current, ...profile };
    this._setItem(STORAGE_KEYS.CUSTOMER, updated);
    return updated;
  }

  // --- ORDERS ---
  // Lista completa só existe no painel (após login)
  getOrders() {
    return this.cache.orders;
  }

  getOrderById(id) {
    const clean = String(id || '').trim().toUpperCase().replace(/^#/, '');
    return this.getOrders().find(o => o.id.toUpperCase() === clean) || null;
  }

  searchOrdersByCustomer(query) {
    if (!query) return [];
    const q = query.trim().toLowerCase().replace(/^#/, '');
    return this.getOrders().filter(o =>
      o.id.toLowerCase().includes(q) ||
      (o.customer?.name && o.customer.name.toLowerCase().includes(q)) ||
      (o.customer?.email && o.customer.email.toLowerCase().includes(q)) ||
      (o.customer?.phone && o.customer.phone.replace(/\D/g, '').includes(q.replace(/\D/g, ''))) ||
      (o.customer?.company && o.customer.company.toLowerCase().includes(q))
    );
  }

  /** Rastreio público (loja): número do pedido ou WhatsApp completo. */
  trackOrders(query) {
    return this._api(`/orders/track?q=${encodeURIComponent(query)}`);
  }

  /**
   * Registra um pedido no banco. O servidor gera número e data e recalcula os preços
   * (na loja). Retorna o pedido salvo; lança erro se o servidor recusar.
   */
  async addOrder(orderData) {
    const admin = this.isAuthenticated();
    const order = await this._api(admin ? '/admin/orders' : '/orders', { method: 'POST', body: orderData, auth: admin });
    if (admin) {
      this.cache.orders = [order, ...this.getOrders()];
      this._notify('orders', this.cache.orders);
      this.channel?.postMessage('changed');
    }
    return order;
  }

  updateOrder(orderId, updates) {
    const orders = [...this.getOrders()];
    const index = orders.findIndex(o => o.id === orderId);
    if (index < 0) return null;
    orders[index] = { ...orders[index], ...updates, updatedAt: new Date().toISOString() };
    this.cache.orders = orders;
    this._notify('orders', orders);
    this._persist(this._api(`/admin/orders/${encodeURIComponent(orderId)}`, { method: 'PUT', body: updates, auth: true }));
    return orders[index];
  }

  updateOrderStatus(orderId, newStatus) {
    return this.updateOrder(orderId, { status: newStatus });
  }

  deleteOrder(orderId) {
    this.cache.orders = this.getOrders().filter(o => o.id !== orderId);
    this._notify('orders', this.cache.orders);
    this._persist(this._api(`/admin/orders/${encodeURIComponent(orderId)}`, { method: 'DELETE', auth: true }));
    return true;
  }

  // --- CATEGORIES CRUD ---
  getCategories() {
    return this.cache.categories;
  }

  saveCategory(catData) {
    const categories = [...this.getCategories()];
    const name = (catData.name || '').trim();
    if (!name) return null;
    const slug = catData.slug || name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-');

    let category;
    const idx = catData.id ? categories.findIndex(c => c.id === catData.id) : -1;
    if (idx >= 0) {
      const oldName = categories[idx].name;
      category = { ...categories[idx], name, slug, icon: catData.icon || categories[idx].icon || 'tag' };
      categories[idx] = category;
      // O servidor renomeia a categoria nos produtos; o cache acompanha
      if (oldName !== name) {
        this.cache.products = this.getProducts().map(p => p.category === oldName ? { ...p, category: name } : p);
      }
    } else {
      category = { id: 'cat-' + Date.now().toString(36), name, slug, icon: catData.icon || 'tag' };
      categories.push(category);
    }

    this.cache.categories = categories;
    this._notify('categories', categories);
    this._persist(this._api(`/admin/categories/${encodeURIComponent(category.id)}`, { method: 'PUT', body: category, auth: true }));
    return category;
  }

  addCategory(name) {
    return this.saveCategory({ name });
  }

  deleteCategory(id) {
    this.cache.categories = this.getCategories().filter(c => c.id !== id);
    this._notify('categories', this.cache.categories);
    this._persist(this._api(`/admin/categories/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true }));
    return true;
  }

  // --- SETTINGS (CMS) ---
  getSettings() {
    return this.cache.settings;
  }

  saveSettings(newSettings) {
    const updated = { ...this.getSettings(), ...newSettings };
    this.cache.settings = updated;
    this._notify('settings', updated);
    this._persist(this._api('/admin/settings', { method: 'PUT', body: newSettings, auth: true }));
    return updated;
  }

  // --- DASHBOARD METRICS ---
  getMetrics() {
    const products = this.getProducts();
    const orders = this.getOrders();
    const categories = this.getCategories();
    const settings = this.getSettings();

    const validOrders = orders.filter(o => o.status !== 'Cancelado');
    const totalRevenue = validOrders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
    const avgTicket = validOrders.length > 0 ? totalRevenue / validOrders.length : 0;

    const pendingOrders = orders.filter(o => o.status === 'Pendente').length;
    const inProductionOrders = orders.filter(o => o.status === 'Em Produção' || o.status === 'Aprovado').length;
    const completedOrders = orders.filter(o => o.status === 'Concluído' || o.status === 'Enviado').length;

    return {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.inStock).length,
      outOfStockProducts: products.filter(p => !p.inStock).length,
      totalCategories: categories.length,
      totalOrders: orders.length,
      pendingOrders,
      inProductionOrders,
      completedOrders,
      totalRevenue,
      avgTicket,
      cashbackPercent: settings.cashbackPercent,
    };
  }

  // --- AUTHENTICATION (painel) ---
  isAuthenticated() {
    const auth = this.getAuthSession();
    return !!auth.token && auth.expiresAt > Date.now();
  }

  getAuthSession() {
    return this._getItem(STORAGE_KEYS.AUTH, { token: null, expiresAt: 0 });
  }

  async login(pin) {
    try {
      const session = await this._api('/auth/login', { method: 'POST', body: { pin } });
      this._setItem(STORAGE_KEYS.AUTH, session);
      await this.refresh();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /** Envia um arquivo (vídeo/capa dos reels) para o banco. Retorna { id, url }. */
  async uploadMedia(file) {
    const res = await fetch(`${API_BASE}/admin/media`, {
      method: 'POST',
      headers: { 'Content-Type': file.type, Authorization: `Bearer ${this.getAuthSession().token}` },
      body: file,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      if (res.status === 401) this.logout();
      throw new ApiError(data?.error || `Erro ${res.status} ao enviar o arquivo.`, res.status);
    }
    return data;
  }

  // --- INSTAGRAM (API oficial, token guardado só no servidor) ---
  instagramStatus() {
    return this._api('/admin/instagram', { auth: true });
  }

  connectInstagram(token) {
    return this._api('/admin/instagram', { method: 'PUT', body: { token }, auth: true });
  }

  disconnectInstagram() {
    return this._api('/admin/instagram', { method: 'DELETE', auth: true });
  }

  /** Importa um reel da conta conectada pelo link. Retorna { videoId, posterId, title, permalink }. */
  importInstagramReel(url) {
    return this._api('/admin/instagram/import', { method: 'POST', body: { url }, auth: true });
  }

  async changePin(newPin) {
    const session = await this._api('/admin/pin', { method: 'PUT', body: { pin: newPin }, auth: true });
    this._setItem(STORAGE_KEYS.AUTH, session);
    return true;
  }

  logout() {
    this._setItem(STORAGE_KEYS.AUTH, { token: null, expiresAt: 0 });
    this.cache.orders = [];
  }
}

export const db = new Database();
export default db;
