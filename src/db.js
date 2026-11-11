// Coconut Ice Database & Storage Layer (Client-Side Persistence)
// Provides full CRUD operations for Products, Orders, Categories, and Store Settings.

const STORAGE_KEYS = {
  PRODUCTS: 'coconut_db_products_v2',
  ORDERS: 'coconut_db_orders_v2',
  CATEGORIES: 'coconut_db_categories_v2',
  SETTINGS: 'coconut_db_settings_v2',
  AUTH: 'coconut_db_auth_v2',
};

const DEFAULT_SETTINGS = {
  storeName: 'Coconut Ice Brindes Personalizados',
  announcementText: 'Frete grátis para todo o Brasil em pedidos corporativos acima de R$ 500',
  announcementVisible: true,
  cashbackPercent: 3,
  pixDiscountPercent: 5,
  maxInstallments: 10,
  whatsappNumber: '5511999998888',
  supportEmail: 'atendimento@coconutice.com.br',
  minOrderValue: 200,
  currency: 'BRL',
};

const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'Garrafas & Copos', slug: 'garrafas-copos', icon: 'cup-soda' },
  { id: 'cat-2', name: 'Escritório & Papelaria', slug: 'escritorio', icon: 'briefcase' },
  { id: 'cat-3', name: 'Bolsas & Mochilas', slug: 'bolsas-mochilas', icon: 'bag' },
  { id: 'cat-4', name: 'Casa & Cozinha', slug: 'casa-cozinha', icon: 'utensils' },
  { id: 'cat-5', name: 'Tecnologia & Acessórios', slug: 'tecnologia', icon: 'smartphone' },
  { id: 'cat-6', name: 'Kits Corporativos & Onboarding', slug: 'kits-corporativos', icon: 'gift' },
  { id: 'cat-7', name: 'DTF Têxtil', slug: 'dtf-textil', icon: 'layers' },
];

const DEFAULT_PRODUCTS = [
  {
    id: 'prod-squeeze-650',
    name: 'SQUEEZE ALUMÍNIO BRILHANTE 650ML',
    sku: '12487B',
    category: 'Garrafas & Copos',
    basePrice: 14.25,
    originalPrice: 39.90,
    maxDiscount: 64,
    description: 'Squeeze em alumínio brilhante com tampa rosqueável e acabamento premium. Ideal para academias, eventos corporativos e brindes para colaboradores.',
    image: 'https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/6cea5fd8-5789-492c-98ac-350cdc14902a-1789132069129.png?width=500&quality=72&resize=contain',
    hoverImage: 'https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/5a4cbf90-38fd-4dfa-a15e-fb89f4674f51-1789208664150.png?width=500&quality=72&resize=contain',
    inStock: true,
    featured: true,
    colors: ['#e7d3b2', '#000000', '#2563eb', '#16a34a', '#dc2626'],
    stockQuantity: 1540,
    tiers: [
      { minQty: 1, maxQty: 9, price: 39.90, discount: 0 },
      { minQty: 10, maxQty: 49, price: 29.50, discount: 26 },
      { minQty: 50, maxQty: 99, price: 19.80, discount: 50 },
      { minQty: 100, maxQty: '+', price: 14.25, discount: 64 },
    ]
  },
  {
    id: 'prod-mochila-usb',
    name: 'MOCHILA CASUAL COM USB INTEGRADO',
    sku: '92144',
    category: 'Bolsas & Mochilas',
    basePrice: 26.99,
    originalPrice: 69.90,
    maxDiscount: 61,
    description: 'Mochila casual em poliéster resistente à água, compartimento acolchoado para notebook de até 15.6" e conector USB externo para recarga.',
    image: 'https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/2ab75319-0940-4840-80c7-450a6f03a274-1786948490046.png?width=500&quality=72&resize=contain',
    hoverImage: '',
    inStock: true,
    featured: true,
    colors: ['#1f2937', '#4b5563', '#1e3a8a'],
    stockQuantity: 820,
    tiers: [
      { minQty: 1, maxQty: 9, price: 69.90, discount: 0 },
      { minQty: 10, maxQty: 49, price: 49.90, discount: 28 },
      { minQty: 50, maxQty: 99, price: 34.50, discount: 50 },
      { minQty: 100, maxQty: '+', price: 26.99, discount: 61 },
    ]
  },
  {
    id: 'prod-copo-termico',
    name: 'COPO TÉRMICO 500ML COM ABRIDOR',
    sku: 'CP500T',
    category: 'Garrafas & Copos',
    basePrice: 22.50,
    originalPrice: 55.00,
    maxDiscount: 59,
    description: 'Copo térmico em parede dupla de aço inox com isolamento a vácuo e abridor embutido na tampa. Mantém bebidas geladas por até 6 horas.',
    image: 'https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/6cea5fd8-5789-492c-98ac-350cdc14902a-1789132069129.png?width=500&quality=72&resize=contain',
    hoverImage: '',
    inStock: true,
    featured: true,
    colors: ['#ffffff', '#000000', '#10b981', '#f59e0b'],
    stockQuantity: 1200,
    tiers: [
      { minQty: 1, maxQty: 9, price: 55.00, discount: 0 },
      { minQty: 10, maxQty: 49, price: 39.00, discount: 29 },
      { minQty: 50, maxQty: 99, price: 28.00, discount: 49 },
      { minQty: 100, maxQty: '+', price: 22.50, discount: 59 },
    ]
  },
  {
    id: 'prod-caderno-ecologico',
    name: 'CADERNETA ECOLÓGICA COM CANETA BAMBU',
    sku: 'CAD774',
    category: 'Escritório & Papelaria',
    basePrice: 8.90,
    originalPrice: 24.90,
    maxDiscount: 64,
    description: 'Caderneta ecológica tipo moleskine em capa kraft reciclada com elástico suporte e caneta esferográfica em bambu gravada a laser.',
    image: 'https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/2ab75319-0940-4840-80c7-450a6f03a274-1786948490046.png?width=500&quality=72&resize=contain',
    hoverImage: '',
    inStock: true,
    featured: true,
    colors: ['#d97706', '#78350f', '#065f46'],
    stockQuantity: 3400,
    tiers: [
      { minQty: 1, maxQty: 9, price: 24.90, discount: 0 },
      { minQty: 10, maxQty: 49, price: 16.50, discount: 33 },
      { minQty: 50, maxQty: 99, price: 11.90, discount: 52 },
      { minQty: 100, maxQty: '+', price: 8.90, discount: 64 },
    ]
  },
  {
    id: 'prod-ecobag-algodao',
    name: 'SACOLA DE ALGODÃO ECOBAG OXFORD',
    sku: 'ECO102',
    category: 'Bolsas & Mochilas',
    basePrice: 5.40,
    originalPrice: 15.00,
    maxDiscount: 64,
    description: 'Sacola ecológica confeccionada em algodão cru 100% biodegradável, alças reforçadas e excelente área para serigrafia ou DTF da marca.',
    image: 'https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/6cea5fd8-5789-492c-98ac-350cdc14902a-1789132069129.png?width=500&quality=72&resize=contain',
    hoverImage: '',
    inStock: true,
    featured: true,
    colors: ['#fef3c7', '#000000', '#15803d'],
    stockQuantity: 5000,
    tiers: [
      { minQty: 1, maxQty: 9, price: 15.00, discount: 0 },
      { minQty: 10, maxQty: 49, price: 9.90, discount: 34 },
      { minQty: 50, maxQty: 99, price: 7.20, discount: 52 },
      { minQty: 100, maxQty: '+', price: 5.40, discount: 64 },
    ]
  },
  {
    id: 'prod-caneta-finesse',
    name: 'CANETA METAL FINESSE TOUCH',
    sku: 'CN908',
    category: 'Escritório & Papelaria',
    basePrice: 3.85,
    originalPrice: 10.90,
    maxDiscount: 65,
    description: 'Caneta esferográfica em corpo metálico fosco com detalhes cromados e ponteira touch para telas capacitivas. Gravação a laser duradoura.',
    image: 'https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/2ab75319-0940-4840-80c7-450a6f03a274-1786948490046.png?width=500&quality=72&resize=contain',
    hoverImage: '',
    inStock: true,
    featured: false,
    colors: ['#000000', '#2563eb', '#991b1b', '#374151'],
    stockQuantity: 8400,
    tiers: [
      { minQty: 1, maxQty: 9, price: 10.90, discount: 0 },
      { minQty: 10, maxQty: 49, price: 7.50, discount: 31 },
      { minQty: 50, maxQty: 99, price: 5.20, discount: 52 },
      { minQty: 100, maxQty: '+', price: 3.85, discount: 65 },
    ]
  },
  {
    id: 'prod-kit-onboarding',
    name: 'KIT BOAS-VINDAS ONBOARDING EXECUTIVO',
    sku: 'KIT990',
    category: 'Kits Corporativos & Onboarding',
    basePrice: 89.90,
    originalPrice: 180.00,
    maxDiscount: 50,
    description: 'Caixa rígida personalizada contendo: Garrafa térmica em inox, Caderneta executiva com caneta metal, Chaveiro couro e Cartão de boas-vindas.',
    image: 'https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/6cea5fd8-5789-492c-98ac-350cdc14902a-1789132069129.png?width=500&quality=72&resize=contain',
    hoverImage: '',
    inStock: true,
    featured: true,
    colors: ['#0f172a', '#3b82f6', '#14532d'],
    stockQuantity: 450,
    tiers: [
      { minQty: 1, maxQty: 9, price: 180.00, discount: 0 },
      { minQty: 10, maxQty: 49, price: 135.00, discount: 25 },
      { minQty: 50, maxQty: 99, price: 109.00, discount: 39 },
      { minQty: 100, maxQty: '+', price: 89.90, discount: 50 },
    ]
  }
];

const DEFAULT_ORDERS = [
  {
    id: 'PED-10492',
    date: '11/11/2026, 09:30',
    customer: {
      name: 'Camila Mendonça',
      company: 'Nubank Tecnologia S.A.',
      email: 'camila.m@nubank.com.br',
      phone: '(11) 98765-4321',
    },
    items: [
      { productId: 'prod-squeeze-650', name: 'SQUEEZE ALUMÍNIO BRILHANTE 650ML', quantity: 200, unitPrice: 14.25, total: 2850.00 },
      { productId: 'prod-caderno-ecologico', name: 'CADERNETA ECOLÓGICA COM CANETA', quantity: 200, unitPrice: 8.90, total: 1780.00 },
    ],
    total: 4630.00,
    paymentMethod: 'Pix à vista (5% OFF)',
    status: 'Em Produção', // Pendente, Aprovado, Em Produção, Enviado, Concluído
    notes: 'Logotipo Nubank gravado a laser frontal.',
  },
  {
    id: 'PED-10491',
    date: '10/11/2026, 16:15',
    customer: {
      name: 'Rodrigo Siqueira',
      company: 'Stone Co.',
      email: 'rodrigo.s@stone.com.br',
      phone: '(21) 97654-3210',
    },
    items: [
      { productId: 'prod-mochila-usb', name: 'MOCHILA CASUAL COM USB INTEGRADO', quantity: 120, unitPrice: 26.99, total: 3238.80 },
    ],
    total: 3238.80,
    paymentMethod: 'Boleto Faturado 30 dias',
    status: 'Aprovado',
    notes: 'Entrega na matriz no Rio de Janeiro.',
  },
  {
    id: 'PED-10490',
    date: '09/11/2026, 11:20',
    customer: {
      name: 'Mariana Duarte',
      company: 'Mercado Livre Brasil',
      email: 'marianad@mercadolivre.com',
      phone: '(11) 99123-8899',
    },
    items: [
      { productId: 'prod-kit-onboarding', name: 'KIT BOAS-VINDAS ONBOARDING EXECUTIVO', quantity: 80, unitPrice: 109.00, total: 8720.00 },
    ],
    total: 8720.00,
    paymentMethod: 'Cartão Corporativo em 3x',
    status: 'Concluído',
    notes: 'Kit onboarding para novos líderes de Q4.',
  },
  {
    id: 'PED-10489',
    date: '08/11/2026, 14:45',
    customer: {
      name: 'Lucas Brandão',
      company: 'Cimed Farmacêutica',
      email: 'lucas.brandao@cimed.com.br',
      phone: '(35) 99876-1122',
    },
    items: [
      { productId: 'prod-copo-termico', name: 'COPO TÉRMICO 500ML COM ABRIDOR', quantity: 50, unitPrice: 28.00, total: 1400.00 },
    ],
    total: 1400.00,
    paymentMethod: 'Pix à vista',
    status: 'Pendente',
    notes: 'Aguardando envio do arquivo vetorizado da arte.',
  }
];

class Database {
  constructor() {
    this.listeners = new Set();
    this.init();
  }

  // Safe storage helper
  _getItem(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn('Storage read failed:', e);
      return fallback;
    }
  }

  _setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this._notify(key, value);
    } catch (e) {
      console.error('Storage write failed:', e);
    }
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      this._setItem(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      this._setItem(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      this._setItem(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this._setItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    }
  }

  // Event Subscription
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
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

  // --- PRODUCTS CRUD ---
  getProducts() {
    return this._getItem(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
  }

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id) || null;
  }

  saveProduct(productData) {
    const products = this.getProducts();
    const existingIndex = products.findIndex(p => p.id === productData.id);

    const product = {
      ...productData,
      basePrice: parseFloat(productData.basePrice) || 0,
      originalPrice: parseFloat(productData.originalPrice) || 0,
      maxDiscount: parseInt(productData.maxDiscount, 10) || 0,
      stockQuantity: parseInt(productData.stockQuantity, 10) || 0,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      products[existingIndex] = { ...products[existingIndex], ...product };
    } else {
      product.id = product.id || 'prod-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
      product.createdAt = new Date().toISOString();
      products.unshift(product);
    }

    this._setItem(STORAGE_KEYS.PRODUCTS, products);
    return product;
  }

  deleteProduct(id) {
    const products = this.getProducts().filter(p => p.id !== id);
    this._setItem(STORAGE_KEYS.PRODUCTS, products);
    return true;
  }

  // --- ORDERS CRUD ---
  getOrders() {
    return this._getItem(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
  }

  getOrderById(id) {
    const orders = this.getOrders();
    return orders.find(o => o.id === id) || null;
  }

  addOrder(orderData) {
    const orders = this.getOrders();
    const newOrder = {
      id: 'PED-' + Math.floor(10000 + Math.random() * 90000),
      date: new Date().toLocaleString('pt-BR'),
      status: 'Pendente',
      ...orderData,
      createdAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    this._setItem(STORAGE_KEYS.ORDERS, orders);
    return newOrder;
  }

  updateOrderStatus(orderId, newStatus) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      order.updatedAt = new Date().toISOString();
      this._setItem(STORAGE_KEYS.ORDERS, orders);
      return order;
    }
    return null;
  }

  deleteOrder(orderId) {
    const orders = this.getOrders().filter(o => o.id !== orderId);
    this._setItem(STORAGE_KEYS.ORDERS, orders);
    return true;
  }

  // --- CATEGORIES ---
  getCategories() {
    return this._getItem(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
  }

  addCategory(name) {
    const categories = this.getCategories();
    const newCat = {
      id: 'cat-' + Date.now().toString(36),
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };
    categories.push(newCat);
    this._setItem(STORAGE_KEYS.CATEGORIES, categories);
    return newCat;
  }

  // --- SETTINGS (CMS) ---
  getSettings() {
    return this._getItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  saveSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    this._setItem(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  // --- DASHBOARD METRICS ---
  getMetrics() {
    const products = this.getProducts();
    const orders = this.getOrders();
    const settings = this.getSettings();

    const totalRevenue = orders
      .filter(o => o.status !== 'Cancelado')
      .reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);

    const pendingOrders = orders.filter(o => o.status === 'Pendente').length;
    const completedOrders = orders.filter(o => o.status === 'Concluído').length;

    return {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.inStock).length,
      totalOrders: orders.length,
      pendingOrders,
      completedOrders,
      totalRevenue,
      cashbackPercent: settings.cashbackPercent,
    };
  }

  // --- BACKUP & RESTORE ---
  exportBackup() {
    const data = {
      version: 2,
      exportDate: new Date().toISOString(),
      settings: this.getSettings(),
      categories: this.getCategories(),
      products: this.getProducts(),
      orders: this.getOrders(),
    };
    return JSON.stringify(data, null, 2);
  }

  importBackup(jsonString) {
    try {
      const data = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
      if (data.products && Array.isArray(data.products)) {
        this._setItem(STORAGE_KEYS.PRODUCTS, data.products);
      }
      if (data.orders && Array.isArray(data.orders)) {
        this._setItem(STORAGE_KEYS.ORDERS, data.orders);
      }
      if (data.categories && Array.isArray(data.categories)) {
        this._setItem(STORAGE_KEYS.CATEGORIES, data.categories);
      }
      if (data.settings && typeof data.settings === 'object') {
        this._setItem(STORAGE_KEYS.SETTINGS, data.settings);
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  resetToDefaults() {
    this._setItem(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
    this._setItem(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    this._setItem(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    this._setItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    return true;
  }

  // --- AUTHENTICATION ---
  isAuthenticated() {
    const auth = this._getItem(STORAGE_KEYS.AUTH, { loggedIn: false });
    return !!auth.loggedIn;
  }

  login(username, password) {
    // Default demo credentials: admin / admin123 (or any entry for demo ease)
    if ((username === 'admin' && password === 'admin123') || username === 'admin' || password === 'admin') {
      const auth = { loggedIn: true, user: username, loginTime: Date.now() };
      this._setItem(STORAGE_KEYS.AUTH, auth);
      return { success: true };
    }
    // Also allow single-click login
    return { success: false, error: 'Credenciais inválidas. Use usuário: admin e senha: admin' };
  }

  logout() {
    this._setItem(STORAGE_KEYS.AUTH, { loggedIn: false });
  }
}

export const db = new Database();
export default db;
