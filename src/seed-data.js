// Gordinho Brindes — dados iniciais do catálogo.
// Usados pelo servidor para popular o banco na primeira execução e pelo navegador como reserva se a API estiver fora do ar.

export const DEFAULT_SETTINGS = {
  storeName: 'Gordinho Brindes',
  storeSubtitle: 'Personalizados & Brindes Corporativos',
  companyLegalName: 'Grupo Gordinho',
  cnpj: '',
  stateRegistration: '',
  announcementText: 'Produção própria em Itajaí/SC · Descontos de até 91% no atacado e 5% OFF no Pix!',
  announcementVisible: true,
  cashbackPercent: 5,
  pixDiscountPercent: 5,
  maxInstallments: 10,
  whatsappNumber: '5547984965444',
  whatsappDisplay: '(47) 98496-5444',
  supportEmail: '',
  address: 'Rua Dr. José Bonifácio Malburg, 315 - Sala 02 - Centro, Itajaí - SC',
  businessHours: 'Seg a Sex · 09h às 18h · Sáb 09h às 13h',
  instagramHandle: '@gordinhobrindesoficial',
  instagramUrl: 'https://www.instagram.com/gordinhobrindesoficial/',
  instagramReels: [
    'https://www.instagram.com/reel/Dfm6XoPOy3s/',
    'https://www.instagram.com/reel/Dfm2qAQuDdE/',
    'https://www.instagram.com/reel/DfbRTlMOXrS/',
    'https://www.instagram.com/reel/DfKlDYHuF66/',
    'https://www.instagram.com/reel/DfKYTe2uEDR/',
    'https://www.instagram.com/reel/DfKYIPKunBe/',
  ],
  facebookUrl: 'https://www.facebook.com/gordinhocelularoficial',
  youtubeUrl: 'https://www.youtube.com/@grupogordinho',
  tiktokUrl: 'https://www.tiktok.com/@ogordinhocelular',
  minOrderValue: 150,
  currency: 'BRL',
  coupons: [
    { code: 'GORDINHO5', discountPercent: 5, active: true, description: '5% OFF de Boas-Vindas' },
    { code: 'ATACADO10', discountPercent: 10, active: true, description: '10% OFF para pedidos corporativos' },
  ],
};

export const DEFAULT_CATEGORIES = [
  { id: 'cat-garrafas', name: 'Garrafas & Copos', slug: 'garrafas-copos', icon: 'cup-soda' },
  { id: 'cat-bolsas', name: 'Bolsas & Mochilas', slug: 'bolsas-mochilas', icon: 'bag' },
  { id: 'cat-escritorio', name: 'Escritório & Papelaria', slug: 'escritorio-papelaria', icon: 'briefcase' },
  { id: 'cat-tecnologia', name: 'Tecnologia & Acessórios', slug: 'tecnologia-acessorios', icon: 'smartphone' },
  { id: 'cat-kits', name: 'Kits Corporativos & Onboarding', slug: 'kits-corporativos', icon: 'gift' },
  { id: 'cat-casa', name: 'Casa, Cozinha & Chaveiros', slug: 'casa-cozinha-chaveiros', icon: 'utensils' },
  { id: 'cat-dtf', name: 'DTF & Têxtil', slug: 'dtf-textil', icon: 'layers' },
];

export const DEFAULT_PRODUCTS = [
  {
    "id": "8d4b7a51-348f-4520-9dbb-3a038939a027",
    "name": "CABO 4 EM 1 COM CASE SUPORTE",
    "sku": "14534",
    "slug": "cabo-4-em-1-com-case-suporte-8d4b7a",
    "category": "Tecnologia & Acessórios",
    "sections": [
      "mais-vendidos"
    ],
    "basePrice": 36.63,
    "originalPrice": 366.25,
    "maxDiscount": 90,
    "description": "Cabo 4 em 1 com case suporte para celular. Cabo para carga e transferência de dados, contém a. Personalização profissional a laser, DTF UV ou serigrafia com a identidade da sua marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/8d4b7a51-348f-4520-9dbb-3a038939a027-1786950544172.png?width=500&quality=72&resize=contain",
    "hoverImage": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/95da1007-cf8a-463b-a7dd-17d22fd4d0ef-1789208447763.png?width=500&quality=72&resize=contain",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#1d4ed8",
      "#111111"
    ],
    "colorNames": [
      {
        "name": "Azul",
        "hex": "#1d4ed8"
      },
      {
        "name": "Preto",
        "hex": "#111111"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 366.25,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 73.25,
        "discount": 80
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 58.6,
        "discount": 84
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 36.63,
        "discount": 90
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 33.7,
        "discount": 91
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 32.23,
        "discount": 91
      }
    ]
  },
  {
    "id": "e01e9eea-19cc-474c-a58e-4376a58d8d9e",
    "name": "Bolsa Multifuncional em Poliéster 300D",
    "sku": "E01E9E",
    "slug": "asia-mc511p-0ce5324b",
    "category": "Bolsas & Mochilas",
    "sections": [
      "mais-vendidos"
    ],
    "basePrice": 210.5,
    "originalPrice": 299.99,
    "maxDiscount": 30,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2024%2F05%2FPerfil_novo-30.jpg&w=500&q=72&output=webp&we=1",
    "hoverImage": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2024%2F05%2FIMG_7230.jpg&w=500&q=72&output=webp&we=1",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#9ca3af"
    ],
    "colorNames": [
      {
        "name": "Cinza",
        "hex": "#9ca3af"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 299.99,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 254.5,
        "discount": 15
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 239.99,
        "discount": 20
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 210.5,
        "discount": 30
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 194.5,
        "discount": 35
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 186.9,
        "discount": 38
      }
    ]
  },
  {
    "id": "b8e6f783-cd5e-4af6-9915-ff4ea7de50d9",
    "name": "MOCHILA DE OMBRO 5L",
    "sku": "08193",
    "slug": "mochila-de-ombro-5l-x189847",
    "category": "Bolsas & Mochilas",
    "sections": [
      "mais-vendidos"
    ],
    "basePrice": 67.5,
    "originalPrice": 135,
    "maxDiscount": 50,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/b8e6f783-cd5e-4af6-9915-ff4ea7de50d9-1789129547161.png?width=500&quality=72&resize=contain",
    "hoverImage": "",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#e7d3b2",
      "#1d4ed8",
      "#111111"
    ],
    "colorNames": [
      {
        "name": "Bege",
        "hex": "#e7d3b2"
      },
      {
        "name": "Azul",
        "hex": "#1d4ed8"
      },
      {
        "name": "Preto",
        "hex": "#111111"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 135,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 108,
        "discount": 20
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 75.6,
        "discount": 44
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 67.5,
        "discount": 50
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 59.4,
        "discount": 56
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 56.7,
        "discount": 58
      }
    ]
  },
  {
    "id": "73003faf-45f9-4df2-a132-ba18ee211af4",
    "name": "BLOCO COM 100 REFIS DE CALENDÁRIO DE MESA",
    "sku": "15503",
    "slug": "73003faf-45f9-4df2-a132-ba18ee211af4",
    "category": "Escritório & Papelaria",
    "sections": [
      "mais-vendidos"
    ],
    "basePrice": 52.5,
    "originalPrice": 105,
    "maxDiscount": 50,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://wsrv.nl/?url=https%3A%2F%2Fcdn.xbzbrindes.com.br%2Fimg%2Fprodutos%2F3%2FRefil-Calendario-de-Mesa-30177-1789646494.jpg&w=500&q=72&output=webp&we=1",
    "hoverImage": "",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#ffffff"
    ],
    "colorNames": [
      {
        "name": "Branco",
        "hex": "#ffffff"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 105,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 84,
        "discount": 20
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 58.8,
        "discount": 44
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 52.5,
        "discount": 50
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 46.2,
        "discount": 56
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 44.1,
        "discount": 58
      }
    ]
  },
  {
    "id": "96ca1c0e-8777-4afc-9dbf-81625234096c",
    "name": "BLOCO DE ANOT. C/ AUTO-ADESIVO E CANETA",
    "sku": "14228",
    "slug": "bloco-de-anot-c-auto-adesivo-e-caneta-96ca1c",
    "category": "Escritório & Papelaria",
    "sections": [
      "mais-vendidos"
    ],
    "basePrice": 32.75,
    "originalPrice": 327.5,
    "maxDiscount": 90,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/96ca1c0e-8777-4afc-9dbf-81625234096c-1786946833384.png?width=500&quality=72&resize=contain",
    "hoverImage": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/7cfb3f7b-119e-4653-885c-72a803eb48a8-1789208834785.png?width=500&quality=72&resize=contain",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#c8a97a",
      "#111111",
      "#1d4ed8"
    ],
    "colorNames": [
      {
        "name": "Kraft",
        "hex": "#c8a97a"
      },
      {
        "name": "Preto",
        "hex": "#111111"
      },
      {
        "name": "Azul",
        "hex": "#1d4ed8"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 327.5,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 65.5,
        "discount": 80
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 52.4,
        "discount": 84
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 32.75,
        "discount": 90
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 30.13,
        "discount": 91
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 28.82,
        "discount": 91
      }
    ]
  },
  {
    "id": "333a2151-c3b5-436d-9b42-9072554b8945",
    "name": "SACOLA PLÁSTICA",
    "sku": "14960",
    "slug": "sacola-plastica-x153010",
    "category": "Bolsas & Mochilas",
    "sections": [
      "mais-vendidos"
    ],
    "basePrice": 12.25,
    "originalPrice": 122.5,
    "maxDiscount": 90,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/333a2151-c3b5-436d-9b42-9072554b8945-1789131920989.png?width=500&quality=72&resize=contain",
    "hoverImage": "",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#111111"
    ],
    "colorNames": [
      {
        "name": "Preto",
        "hex": "#111111"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 122.5,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 24.5,
        "discount": 80
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 19.6,
        "discount": 84
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 12.25,
        "discount": 90
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 11.27,
        "discount": 91
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 10.78,
        "discount": 91
      }
    ]
  },
  {
    "id": "05765aa3-65dc-438c-9756-a270c7bff2d5",
    "name": "CANETA METAL FINESSE",
    "sku": "08160",
    "slug": "caneta-metal-finesse",
    "category": "Escritório & Papelaria",
    "sections": [
      "mais-vendidos"
    ],
    "basePrice": 6,
    "originalPrice": 60,
    "maxDiscount": 90,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/05765aa3-65dc-438c-9756-a270c7bff2d5-1786952288681.png?width=500&quality=72&resize=contain",
    "hoverImage": "",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#73c841",
      "#111111",
      "#b63c4c",
      "#37bbfe",
      "#fcdca9",
      "#edeff0"
    ],
    "colorNames": [
      {
        "name": "Chumbo",
        "hex": "#73c841"
      },
      {
        "name": "Preto",
        "hex": "#111111"
      },
      {
        "name": "Vermelho",
        "hex": "#b63c4c"
      },
      {
        "name": "Azul",
        "hex": "#37bbfe"
      },
      {
        "name": "Dourado",
        "hex": "#fcdca9"
      },
      {
        "name": "Prata",
        "hex": "#edeff0"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 60,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 12,
        "discount": 80
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 9.6,
        "discount": 84
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 6,
        "discount": 90
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 5.52,
        "discount": 91
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 5.28,
        "discount": 91
      }
    ]
  },
  {
    "id": "6cea5fd8-5789-492c-98ac-350cdc14902a",
    "name": "SQUEEZE ALUMÍNIO BRILHANTE 650ML",
    "sku": "12487B",
    "slug": "squeeze-aluminio-brilhante-650ml",
    "category": "Garrafas & Copos",
    "sections": [
      "mais-vendidos"
    ],
    "basePrice": 22.99,
    "originalPrice": 45,
    "maxDiscount": 49,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/6cea5fd8-5789-492c-98ac-350cdc14902a-1789132069129.png?width=500&quality=72&resize=contain",
    "hoverImage": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/5a4cbf90-38fd-4dfa-a15e-fb89f4674f51-1789208664150.png?width=500&quality=72&resize=contain",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#c0c0c0",
      "#111111",
      "#ec4899",
      "#f97316",
      "#1d4ed8",
      "#f9a8d4"
    ],
    "colorNames": [
      {
        "name": "Prata",
        "hex": "#c0c0c0"
      },
      {
        "name": "Preto",
        "hex": "#111111"
      },
      {
        "name": "Rosa",
        "hex": "#ec4899"
      },
      {
        "name": "Laranja",
        "hex": "#f97316"
      },
      {
        "name": "Azul",
        "hex": "#1d4ed8"
      },
      {
        "name": "Rosa Claro",
        "hex": "#f9a8d4"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 45,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 29.99,
        "discount": 33
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 24.99,
        "discount": 44
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 22.99,
        "discount": 49
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 21.8,
        "discount": 52
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 19.99,
        "discount": 56
      }
    ]
  },
  {
    "id": "9a19d4f7-99e8-47f0-9ace-9a20504aeab0",
    "name": "KIT PAI MESTRE CHURRASQUEIRO COMPLETO",
    "sku": "9A19D4",
    "slug": "kit-pai-mestre-churrasqueiro-completo-mrnxgjq6",
    "category": "Kits Corporativos & Onboarding",
    "sections": [
      "mais-vendidos"
    ],
    "basePrice": 151.2,
    "originalPrice": 250,
    "maxDiscount": 38,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/9a19d4f7-99e8-47f0-9ace-9a20504aeab0-1788968630334.png?width=500&quality=72&resize=contain",
    "hoverImage": "",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#0F3822",
      "#FAB818",
      "#1f2937"
    ],
    "colorNames": [],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 250,
        "discount": 0
      },
      {
        "label": "10–19",
        "minQty": 10,
        "maxQty": 19,
        "price": 169.99,
        "discount": 32
      },
      {
        "label": "20–49",
        "minQty": 20,
        "maxQty": 49,
        "price": 159.9,
        "discount": 36
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 154.5,
        "discount": 38
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 151.2,
        "discount": 40
      },
      {
        "label": "500+",
        "minQty": 500,
        "maxQty": "+",
        "price": 149.24,
        "discount": 40
      }
    ]
  },
  {
    "id": "bee7d909-cef1-4d00-b8c3-575006607bcd",
    "name": "CHAVEIRO MOSQUETÃO",
    "sku": "BEE7D9",
    "slug": "chaveiro-mosquetao-personalizado",
    "category": "Casa, Cozinha & Chaveiros",
    "sections": [
      "mais-vendidos"
    ],
    "basePrice": 4.25,
    "originalPrice": 25,
    "maxDiscount": 83,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/1789397053026-dvgq8j9obyg.png?width=500&quality=72&resize=contain",
    "hoverImage": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/1789397049494-dsmavaxc1zm.png?width=500&quality=72&resize=contain",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#1d4ed8",
      "#c0c0c0",
      "#facc15",
      "#16a34a",
      "#7c3aed",
      "#111111"
    ],
    "colorNames": [
      {
        "name": "Azul",
        "hex": "#1d4ed8"
      },
      {
        "name": "Prata",
        "hex": "#c0c0c0"
      },
      {
        "name": "Amarelo",
        "hex": "#facc15"
      },
      {
        "name": "verde",
        "hex": "#16a34a"
      },
      {
        "name": "Roxo",
        "hex": "#7c3aed"
      },
      {
        "name": "Preto",
        "hex": "#111111"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 25,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 8.5,
        "discount": 66
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 4.9,
        "discount": 80
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 4.25,
        "discount": 83
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 3.99,
        "discount": 84
      },
      {
        "label": "1000–4999",
        "minQty": 1000,
        "maxQty": 4999,
        "price": 3.85,
        "discount": 85
      },
      {
        "label": "5000+",
        "minQty": 5000,
        "maxQty": "+",
        "price": 3.55,
        "discount": 86
      }
    ]
  },
  {
    "id": "6a798ec1-ae60-4a91-9a9c-b45330a02d01",
    "name": "CANETA BAMBU PONTA TOUCH",
    "sku": "6A798E",
    "slug": "caneta-bambu-ponta-touch-mrz9myv3",
    "category": "Escritório & Papelaria",
    "sections": [
      "mais-vendidos",
      "lancamentos"
    ],
    "basePrice": 3.6,
    "originalPrice": 24.99,
    "maxDiscount": 86,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/6a798ec1-ae60-4a91-9a9c-b45330a02d01-1786947758729.png?width=500&quality=72&resize=contain",
    "hoverImage": "",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#0F3822",
      "#FAB818",
      "#1f2937"
    ],
    "colorNames": [],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 24.99,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 5.5,
        "discount": 78
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 3.99,
        "discount": 84
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 3.6,
        "discount": 86
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 3.2,
        "discount": 87
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 2.95,
        "discount": 88
      }
    ]
  },
  {
    "id": "2b0a2168-7f94-49ac-9544-bdfc2dcf69ac",
    "name": "MOCHILA NYLON OXFORD NÁPOLES 14L",
    "sku": "E@01323",
    "slug": "mochila-nylon-oxford-napoles-14l",
    "category": "Bolsas & Mochilas",
    "sections": [
      "mais-vendidos"
    ],
    "basePrice": 88.9,
    "originalPrice": 129.5,
    "maxDiscount": 31,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/2b0a2168-7f94-49ac-9544-bdfc2dcf69ac-1787235233749.png?width=500&quality=72&resize=contain",
    "hoverImage": "",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#9ca3af"
    ],
    "colorNames": [
      {
        "name": "Cinza",
        "hex": "#9ca3af"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 129.5,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 99.99,
        "discount": 23
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 92.5,
        "discount": 29
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 88.9,
        "discount": 31
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 84.5,
        "discount": 35
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 79.99,
        "discount": 38
      }
    ]
  },
  {
    "id": "740b84b3-56ce-4060-a7a4-c303114fc0ba",
    "name": "CAMISETA DE POLIÉSTER UNIFORME UNISSEX",
    "sku": "740B84",
    "slug": "camiseta-de-poliester-uniforme-unissex",
    "category": "DTF & Têxtil",
    "sections": [
      "mais-vendidos"
    ],
    "basePrice": 36.99,
    "originalPrice": 54.99,
    "maxDiscount": 33,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/740b84b3-56ce-4060-a7a4-c303114fc0ba-1786951790213.png?width=500&quality=72&resize=contain",
    "hoverImage": "",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#111111",
      "#ffffff"
    ],
    "colorNames": [
      {
        "name": "Preto",
        "hex": "#111111"
      },
      {
        "name": "Branco",
        "hex": "#ffffff"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 54.99,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 41,
        "discount": 25
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 38.2,
        "discount": 31
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 36.99,
        "discount": 33
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 34.5,
        "discount": 37
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 32.1,
        "discount": 42
      }
    ]
  },
  {
    "id": "f86bdfd6-f140-4aa3-ad51-74119c992a2b",
    "name": "SACA ROLHAS BRILHANTE * S/ CAIXINHA",
    "sku": "18621B",
    "slug": "saca-rolhas-brilhante-s-caixinha-x152897",
    "category": "Casa, Cozinha & Chaveiros",
    "sections": [
      "mais-vendidos"
    ],
    "basePrice": 9.9,
    "originalPrice": 29.9,
    "maxDiscount": 67,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/f86bdfd6-f140-4aa3-ad51-74119c992a2b-1789131778764.png?width=500&quality=72&resize=contain",
    "hoverImage": "",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#111111"
    ],
    "colorNames": [
      {
        "name": "Preto",
        "hex": "#111111"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 29.9,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 17.9,
        "discount": 40
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 13.9,
        "discount": 54
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 9.9,
        "discount": 67
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 8.9,
        "discount": 70
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 8.25,
        "discount": 72
      }
    ]
  },
  {
    "id": "31de3217-476d-4188-ac1c-961109e2921b",
    "name": "DTF TÊXTIL FOLHA 100X57CM SUA ARTE",
    "sku": "31DE32",
    "slug": "dtf-textil-folha-100x57cm-sua-arte-mrnwf4b5",
    "category": "DTF & Têxtil",
    "sections": [
      "mais-vendidos"
    ],
    "basePrice": 64.49,
    "originalPrice": 141.88,
    "maxDiscount": 50,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/31de3217-476d-4188-ac1c-961109e2921b-1786948088222.png?width=500&quality=72&resize=contain",
    "hoverImage": "",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#0F3822",
      "#FAB818",
      "#1f2937"
    ],
    "colorNames": [],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 141.88,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 90.29,
        "discount": 35
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 74.16,
        "discount": 45
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 64.49,
        "discount": 50
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 59.33,
        "discount": 52
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 56.75,
        "discount": 54
      }
    ]
  },
  {
    "id": "027d630c-7bb9-4932-9fc8-a913cb9d766b",
    "name": "CALENDÁRIO PERMANENTE MDF",
    "sku": "027D63",
    "slug": "calendario-permanente-mdf-x234133",
    "category": "Escritório & Papelaria",
    "sections": [
      "mais-vendidos"
    ],
    "basePrice": 32.48,
    "originalPrice": 324.75,
    "maxDiscount": 90,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/027d630c-7bb9-4932-9fc8-a913cb9d766b-1786951715127.png?width=500&quality=72&resize=contain",
    "hoverImage": "",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#c84841"
    ],
    "colorNames": [
      {
        "name": "Madeira",
        "hex": "#c84841"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 324.75,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 64.95,
        "discount": 80
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 51.96,
        "discount": 84
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 32.48,
        "discount": 90
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 29.88,
        "discount": 91
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 28.58,
        "discount": 91
      }
    ]
  },
  {
    "id": "30501988-0715-43d1-8c46-47fa11a3dd8b",
    "name": "Garrafa Alumínio 600ml Reciclado",
    "sku": "305019",
    "slug": "asia-ga7650-7db5ca3b",
    "category": "Garrafas & Copos",
    "sections": [
      "destaques",
      "lancamentos"
    ],
    "basePrice": 31.5,
    "originalPrice": 69.99,
    "maxDiscount": 55,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2024%2F05%2Ftodasd-asd-2-com-etiqueta.jpg&w=500&q=72&output=webp&we=1",
    "hoverImage": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2024%2F05%2Fgarrafa-em-aluminio-de-600ml-cabd7c9fc102839734a4a8f2c0c2e9dd5d2d284b.jpg&w=500&q=72&output=webp&we=1",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#111111",
      "#c0c0c0",
      "#ffffff",
      "#1d4ed8",
      "#f97316",
      "#16a34a"
    ],
    "colorNames": [
      {
        "name": "Preto",
        "hex": "#111111"
      },
      {
        "name": "Prata",
        "hex": "#c0c0c0"
      },
      {
        "name": "Branco",
        "hex": "#ffffff"
      },
      {
        "name": "Azul",
        "hex": "#1d4ed8"
      },
      {
        "name": "Laranja",
        "hex": "#f97316"
      },
      {
        "name": "Verde",
        "hex": "#16a34a"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 69.99,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 42.5,
        "discount": 39
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 36.99,
        "discount": 47
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 31.5,
        "discount": 55
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 28.5,
        "discount": 59
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 26.99,
        "discount": 61
      }
    ]
  },
  {
    "id": "2ab75319-0940-4840-80c7-450a6f03a274",
    "name": "MOCHILA CASUAL COM USB INTEGRADO",
    "sku": "2AB753",
    "slug": "mochila-casual-com-usb-integrado-personalizada",
    "category": "Bolsas & Mochilas",
    "sections": [
      "destaques",
      "lancamentos"
    ],
    "basePrice": 51,
    "originalPrice": 79.5,
    "maxDiscount": 36,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/2ab75319-0940-4840-80c7-450a6f03a274-1786948490046.png?width=500&quality=72&resize=contain",
    "hoverImage": "",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#8d8d91",
      "#000000",
      "#1b3169"
    ],
    "colorNames": [
      {
        "name": "Cinza",
        "hex": "#8d8d91"
      },
      {
        "name": "Preto",
        "hex": "#000000"
      },
      {
        "name": "Azul",
        "hex": "#1b3169"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 79.5,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 59.9,
        "discount": 25
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 52.5,
        "discount": 34
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 51,
        "discount": 36
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 49.5,
        "discount": 38
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 44.9,
        "discount": 44
      }
    ]
  },
  {
    "id": "a91348f5-6954-4cdd-8b71-c0dbf762f972",
    "name": "KIT EXPERIENCE GARRAFA ECOBAG CANETA CADERNETA",
    "sku": "A91348",
    "slug": "kit-experience-garrafa-ecobag-caneta-caderneta",
    "category": "Garrafas & Copos",
    "sections": [
      "destaques"
    ],
    "basePrice": 64.99,
    "originalPrice": 89.99,
    "maxDiscount": 28,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/a91348f5-6954-4cdd-8b71-c0dbf762f972-1786948409406.png?width=500&quality=72&resize=contain",
    "hoverImage": "",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#f86f33",
      "#033f9a",
      "#0c0b0b",
      "#979aa2",
      "#ba1326",
      "#fbfafa"
    ],
    "colorNames": [
      {
        "name": "Laranja",
        "hex": "#f86f33"
      },
      {
        "name": "Azul",
        "hex": "#033f9a"
      },
      {
        "name": "Preto",
        "hex": "#0c0b0b"
      },
      {
        "name": "Cinza",
        "hex": "#979aa2"
      },
      {
        "name": "Vermelho",
        "hex": "#ba1326"
      },
      {
        "name": "Branco",
        "hex": "#fbfafa"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 89.99,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 74.5,
        "discount": 17
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 68.5,
        "discount": 24
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 64.99,
        "discount": 28
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 62.5,
        "discount": 31
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 59.2,
        "discount": 34
      }
    ]
  },
  {
    "id": "50b7c724-9f59-4035-ad64-0abf620badc1",
    "name": "GARRAFA TÉRMICA SUPORTE MAGNETÍCO CELULAR 550ML",
    "sku": "50B7C7",
    "slug": "garrafa-termica-suporte-magnetico-celular-550ml",
    "category": "Garrafas & Copos",
    "sections": [
      "destaques"
    ],
    "basePrice": 22.5,
    "originalPrice": 39.5,
    "maxDiscount": 43,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/50b7c724-9f59-4035-ad64-0abf620badc1-1788966742139.png?width=500&quality=72&resize=contain",
    "hoverImage": "",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#a8a8a8",
      "#1a1a68"
    ],
    "colorNames": [
      {
        "name": "Prata",
        "hex": "#a8a8a8"
      },
      {
        "name": "Azul",
        "hex": "#1a1a68"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 39.5,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 29.99,
        "discount": 24
      },
      {
        "label": "50+",
        "minQty": 50,
        "maxQty": "+",
        "price": 22.5,
        "discount": 43
      }
    ]
  },
  {
    "id": "24da5cf8-7932-4373-9b16-7969acfbba91",
    "name": "CAMISETA DE ALGODÃO UNIFORME UNISSEX",
    "sku": "24DA5C",
    "slug": "camiseta-de-algodao-uniforme-unissex",
    "category": "DTF & Têxtil",
    "sections": [
      "destaques"
    ],
    "basePrice": 38.5,
    "originalPrice": 59.99,
    "maxDiscount": 36,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/24da5cf8-7932-4373-9b16-7969acfbba91-1786947750765.png?width=500&quality=72&resize=contain",
    "hoverImage": "",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#111111",
      "#ffffff"
    ],
    "colorNames": [
      {
        "name": "Preto",
        "hex": "#111111"
      },
      {
        "name": "Branco",
        "hex": "#ffffff"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 59.99,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 42.5,
        "discount": 29
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 39.9,
        "discount": 33
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 38.5,
        "discount": 36
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 36.88,
        "discount": 39
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 34.2,
        "discount": 43
      }
    ]
  },
  {
    "id": "ccd99d7b-a71c-455c-96dc-d04121c767e2",
    "name": "CANETA METAL TOUCH 2.0",
    "sku": "14949B",
    "slug": "caneta-metal-touch-2-0",
    "category": "Escritório & Papelaria",
    "sections": [
      "destaques"
    ],
    "basePrice": 3.95,
    "originalPrice": 29.8,
    "maxDiscount": 87,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/ccd99d7b-a71c-455c-96dc-d04121c767e2-1786947901346.png?width=500&quality=72&resize=contain",
    "hoverImage": "",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#267e30",
      "#cc4f26",
      "#008cc9",
      "#9d112c",
      "#ffffff",
      "#db82ae"
    ],
    "colorNames": [
      {
        "name": "Verde",
        "hex": "#267e30"
      },
      {
        "name": "Laranja",
        "hex": "#cc4f26"
      },
      {
        "name": "Azul Claro",
        "hex": "#008cc9"
      },
      {
        "name": "Vermelho",
        "hex": "#9d112c"
      },
      {
        "name": "Branco",
        "hex": "#ffffff"
      },
      {
        "name": "Rosa",
        "hex": "#db82ae"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 29.8,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 7.8,
        "discount": 74
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 4.5,
        "discount": 85
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 3.95,
        "discount": 87
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 3.7,
        "discount": 88
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 3.4,
        "discount": 89
      }
    ]
  },
  {
    "id": "c863234a-2216-4a7f-ba6b-61c515f3a18b",
    "name": "COPO TÉRMICO 500ML COM ABRIDOR",
    "sku": "09252",
    "slug": "copo-termico-500ml-com-abridor-2",
    "category": "Garrafas & Copos",
    "sections": [
      "destaques"
    ],
    "basePrice": 24.99,
    "originalPrice": 89.9,
    "maxDiscount": 72,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/c863234a-2216-4a7f-ba6b-61c515f3a18b-1787335645546.png?width=500&quality=72&resize=contain",
    "hoverImage": "",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#f97316",
      "#9ca3af",
      "#111111",
      "#dc2626",
      "#16a34a",
      "#1d4ed8"
    ],
    "colorNames": [
      {
        "name": "Laranja",
        "hex": "#f97316"
      },
      {
        "name": "Cinza",
        "hex": "#9ca3af"
      },
      {
        "name": "Preto",
        "hex": "#111111"
      },
      {
        "name": "Vermelho",
        "hex": "#dc2626"
      },
      {
        "name": "Verde",
        "hex": "#16a34a"
      },
      {
        "name": "Azul",
        "hex": "#1d4ed8"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 89.9,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 34.99,
        "discount": 61
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 29.99,
        "discount": 67
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 24.99,
        "discount": 72
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 22.5,
        "discount": 75
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 19.99,
        "discount": 78
      }
    ]
  },
  {
    "id": "bc579129-a666-4db8-87ff-0914a2347e27",
    "name": "CHAVEIRO METAL ABRIDOR RETANGULAR BAMBU",
    "sku": "08238",
    "slug": "chaveiro-metal-abridor-retangular-bambu",
    "category": "Casa, Cozinha & Chaveiros",
    "sections": [
      "destaques"
    ],
    "basePrice": 7.55,
    "originalPrice": 19.9,
    "maxDiscount": 62,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/bc579129-a666-4db8-87ff-0914a2347e27-1786948015066.png?width=500&quality=72&resize=contain",
    "hoverImage": "",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#5541c8"
    ],
    "colorNames": [
      {
        "name": "Bambu",
        "hex": "#5541c8"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 19.9,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 9.5,
        "discount": 52
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 8.1,
        "discount": 59
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 7.55,
        "discount": 62
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 7.2,
        "discount": 64
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 6.9,
        "discount": 65
      }
    ]
  },
  {
    "id": "6bac5c86-7359-4393-9f3c-538ddd941e5c",
    "name": "MINI BLOCO DE ANOTAÇÕES COM AUTOADESIVOS E CANETA",
    "sku": "12244B",
    "slug": "mini-bloco-de-anotacoes-com-autoadesivos-e-caneta",
    "category": "Escritório & Papelaria",
    "sections": [
      "destaques"
    ],
    "basePrice": 11.5,
    "originalPrice": 39.99,
    "maxDiscount": 71,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/6bac5c86-7359-4393-9f3c-538ddd941e5c-1786948480684.png?width=500&quality=72&resize=contain",
    "hoverImage": "",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#000000",
      "#1d4ed8"
    ],
    "colorNames": [
      {
        "name": "Preto",
        "hex": "#000000"
      },
      {
        "name": "Azul",
        "hex": "#1d4ed8"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 39.99,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 16.5,
        "discount": 59
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 12.99,
        "discount": 68
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 11.5,
        "discount": 71
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 9.5,
        "discount": 76
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 8.5,
        "discount": 79
      }
    ]
  },
  {
    "id": "48a4200e-d52d-4f8f-8d60-6f222b7134b5",
    "name": "SACOLA DE ALGODÃO ECOBAG OXFORD",
    "sku": "13803B",
    "slug": "sacola-de-algodao-ecobag-oxford",
    "category": "Bolsas & Mochilas",
    "sections": [
      "destaques"
    ],
    "basePrice": 14.25,
    "originalPrice": 39.99,
    "maxDiscount": 64,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/48a4200e-d52d-4f8f-8d60-6f222b7134b5-1786948598848.png?width=500&quality=72&resize=contain",
    "hoverImage": "",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#e7d3b2"
    ],
    "colorNames": [
      {
        "name": "Bege",
        "hex": "#e7d3b2"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 39.99,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 19.99,
        "discount": 50
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 16.99,
        "discount": 58
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 14.25,
        "discount": 64
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 12.85,
        "discount": 68
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 11.99,
        "discount": 70
      }
    ]
  },
  {
    "id": "fc513973-ae6c-4dec-9634-35cadd7e9299",
    "name": "GARRAFA BASIC ALUMÍNIO 630ML",
    "sku": "07047",
    "slug": "garrafabasicaluminio630ml",
    "category": "Garrafas & Copos",
    "sections": [
      "destaques"
    ],
    "basePrice": 21.99,
    "originalPrice": 59.99,
    "maxDiscount": 63,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/fc513973-ae6c-4dec-9634-35cadd7e9299-1786948125263.png?width=500&quality=72&resize=contain",
    "hoverImage": "",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#0762c5",
      "#902328",
      "#111111",
      "#7d7e7b",
      "#d5d3d4",
      "#33694f"
    ],
    "colorNames": [
      {
        "name": "Azul",
        "hex": "#0762c5"
      },
      {
        "name": "Vermelho",
        "hex": "#902328"
      },
      {
        "name": "Preto",
        "hex": "#111111"
      },
      {
        "name": "Prata",
        "hex": "#7d7e7b"
      },
      {
        "name": "Branco",
        "hex": "#d5d3d4"
      },
      {
        "name": "Verde",
        "hex": "#33694f"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 59.99,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 29.99,
        "discount": 50
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 25.5,
        "discount": 57
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 21.99,
        "discount": 63
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 19.99,
        "discount": 67
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 18.99,
        "discount": 68
      }
    ]
  },
  {
    "id": "f75cb852-fc1e-4c1f-b8a9-939272010fa4",
    "name": "MARMITA DUPLA FIBRA DE BAMBU ECOLÓGICA",
    "sku": "06090",
    "slug": "marmita-dupla-fibra-de-bambu-ecologica",
    "category": "Casa, Cozinha & Chaveiros",
    "sections": [
      "destaques"
    ],
    "basePrice": 33.2,
    "originalPrice": 69.99,
    "maxDiscount": 53,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/f75cb852-fc1e-4c1f-b8a9-939272010fa4-1786948446965.png?width=500&quality=72&resize=contain",
    "hoverImage": "",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#e7d3b2"
    ],
    "colorNames": [
      {
        "name": "Bege",
        "hex": "#e7d3b2"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 69.99,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 39.8,
        "discount": 43
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 36.99,
        "discount": 47
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 33.2,
        "discount": 53
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 31.5,
        "discount": 55
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 29.8,
        "discount": 57
      }
    ]
  },
  {
    "id": "9fbbcf27-948d-47d5-8f96-b6c6fb9fd838",
    "name": "BLOCO DE ANOTAÇÕES COM CANETA ECOLÓGICO",
    "sku": "06098",
    "slug": "bloco-de-anotacoes-com-caneta-ecologico",
    "category": "Escritório & Papelaria",
    "sections": [
      "destaques"
    ],
    "basePrice": 12.5,
    "originalPrice": 55,
    "maxDiscount": 77,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/9fbbcf27-948d-47d5-8f96-b6c6fb9fd838-1786947277756.png?width=500&quality=72&resize=contain",
    "hoverImage": "",
    "inStock": true,
    "featured": true,
    "stockQuantity": 1500,
    "colors": [
      "#3b3861",
      "#16a34a",
      "#dc2626",
      "#f97316",
      "#111111"
    ],
    "colorNames": [
      {
        "name": "Azul",
        "hex": "#3b3861"
      },
      {
        "name": "Verde",
        "hex": "#16a34a"
      },
      {
        "name": "Vermelho",
        "hex": "#dc2626"
      },
      {
        "name": "Laranja",
        "hex": "#f97316"
      },
      {
        "name": "Preto",
        "hex": "#111111"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 55,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 19.99,
        "discount": 64
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 14.5,
        "discount": 74
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 12.5,
        "discount": 77
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 10.99,
        "discount": 80
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 9.99,
        "discount": 82
      }
    ]
  },
  {
    "id": "7355f0ac-e1a8-480d-bc88-e36c8fd044c3",
    "name": "CANETA ALUMÍNIO \"TOUCH NÃO FUNCIONA\"",
    "sku": "O@13546T",
    "slug": "caneta-aluminio-touch-nao-funciona-x263770",
    "category": "Escritório & Papelaria",
    "sections": [
      "lancamentos"
    ],
    "basePrice": 2.48,
    "originalPrice": 24.75,
    "maxDiscount": 90,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/7355f0ac-e1a8-480d-bc88-e36c8fd044c3-1786947739513.png?width=500&quality=72&resize=contain",
    "hoverImage": "",
    "inStock": true,
    "featured": false,
    "stockQuantity": 1500,
    "colors": [
      "#111111",
      "#f97316"
    ],
    "colorNames": [
      {
        "name": "Preto",
        "hex": "#111111"
      },
      {
        "name": "Laranja",
        "hex": "#f97316"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 24.75,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 4.95,
        "discount": 80
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 3.96,
        "discount": 84
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 2.48,
        "discount": 90
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 2.28,
        "discount": 91
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 2.18,
        "discount": 91
      }
    ]
  },
  {
    "id": "edee6189-6028-4fa5-bc5f-6efae1a557b2",
    "name": "SMARTWATCH T62",
    "sku": "E@09314",
    "slug": "smartwatch-t62-edee61",
    "category": "Tecnologia & Acessórios",
    "sections": [
      "lancamentos"
    ],
    "basePrice": 150,
    "originalPrice": 300,
    "maxDiscount": 50,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/edee6189-6028-4fa5-bc5f-6efae1a557b2-1786948634211.png?width=500&quality=72&resize=contain",
    "hoverImage": "",
    "inStock": true,
    "featured": false,
    "stockQuantity": 1500,
    "colors": [
      "#111111"
    ],
    "colorNames": [
      {
        "name": "Preto",
        "hex": "#111111"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 300,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 240,
        "discount": 20
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 168,
        "discount": 44
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 150,
        "discount": 50
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 132,
        "discount": 56
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 126,
        "discount": 58
      }
    ]
  },
  {
    "id": "b4f1f376-16b3-40b2-b209-9cbfd57f91d5",
    "name": "GARRAFA SQUEEZE ALUMÍNIO FOSCA 650ML",
    "sku": "12487F",
    "slug": "garrafa-squeeze-aluminio-650ml",
    "category": "Garrafas & Copos",
    "sections": [
      "lancamentos"
    ],
    "basePrice": 22.99,
    "originalPrice": 45,
    "maxDiscount": 49,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/b4f1f376-16b3-40b2-b209-9cbfd57f91d5-1786948200396.png?width=500&quality=72&resize=contain",
    "hoverImage": "https://lnlfnhxdwfznyzlpusqj.supabase.co/storage/v1/render/image/public/products/2aa87cd4-7101-47ce-a2da-b3ce8ea7a579/branded/c29ab7b8-968f-4106-a151-27ceddef144a-1789208123916.png?width=500&quality=72&resize=contain",
    "inStock": true,
    "featured": false,
    "stockQuantity": 1500,
    "colors": [
      "#111111",
      "#848281",
      "#012c64",
      "#16a34a",
      "#ec4899",
      "#dc2626"
    ],
    "colorNames": [
      {
        "name": "Preto",
        "hex": "#111111"
      },
      {
        "name": "Inox",
        "hex": "#848281"
      },
      {
        "name": "Azul",
        "hex": "#012c64"
      },
      {
        "name": "Verde",
        "hex": "#16a34a"
      },
      {
        "name": "Rosa",
        "hex": "#ec4899"
      },
      {
        "name": "Vermelho",
        "hex": "#dc2626"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 45,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 29.99,
        "discount": 33
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 24.99,
        "discount": 44
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 22.99,
        "discount": 49
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 21.8,
        "discount": 52
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 19.99,
        "discount": 56
      }
    ]
  },
  {
    "id": "ddad6351-6cee-4a62-85ad-9c39cb4dfdb0",
    "name": "SACOLA ALGODÃO",
    "sku": "15638",
    "slug": "ddad6351-6cee-4a62-85ad-9c39cb4dfdb0",
    "category": "Bolsas & Mochilas",
    "sections": [
      "lancamentos"
    ],
    "basePrice": 19.25,
    "originalPrice": 192.5,
    "maxDiscount": 90,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://wsrv.nl/?url=https%3A%2F%2Fcdn.xbzbrindes.com.br%2Fimg%2Fprodutos%2F3%2FSacola-Algodao-BEGE-31462-1794340026.jpg&w=500&q=72&output=webp&we=1",
    "hoverImage": "",
    "inStock": true,
    "featured": false,
    "stockQuantity": 1500,
    "colors": [
      "#e7d3b2"
    ],
    "colorNames": [
      {
        "name": "Bege",
        "hex": "#e7d3b2"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 192.5,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 38.5,
        "discount": 80
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 30.8,
        "discount": 84
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 19.25,
        "discount": 90
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 17.71,
        "discount": 91
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 16.94,
        "discount": 91
      }
    ]
  },
  {
    "id": "64375b6c-00e2-4b82-98f3-9a8e55152ff0",
    "name": "SACOLA DE LONA E CORTIÇA",
    "sku": "19281",
    "slug": "64375b6c-00e2-4b82-98f3-9a8e55152ff0",
    "category": "Bolsas & Mochilas",
    "sections": [
      "lancamentos"
    ],
    "basePrice": 23,
    "originalPrice": 230,
    "maxDiscount": 90,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://wsrv.nl/?url=https%3A%2F%2Fcdn.xbzbrindes.com.br%2Fimg%2Fprodutos%2F3%2FSacola-de-Lona-e-Cortica-BEGE-31318-1793823519.jpg&w=500&q=72&output=webp&we=1",
    "hoverImage": "https://wsrv.nl/?url=https%3A%2F%2Fcdn.xbzbrindes.com.br%2Fimg%2Fprodutos%2F3%2FSacola-de-Lona-e-Cortica-PRETO-31317-1793823487.jpg&w=500&q=72&output=webp&we=1",
    "inStock": true,
    "featured": false,
    "stockQuantity": 1500,
    "colors": [
      "#111111",
      "#e7d3b2"
    ],
    "colorNames": [
      {
        "name": "Preto",
        "hex": "#111111"
      },
      {
        "name": "Bege",
        "hex": "#e7d3b2"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 230,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 46,
        "discount": 80
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 36.8,
        "discount": 84
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 23,
        "discount": 90
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 21.16,
        "discount": 91
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 20.24,
        "discount": 91
      }
    ]
  },
  {
    "id": "37cde66d-847d-4263-8bad-4ce0063bce53",
    "name": "Sacola TNT 80g/m² (34x26cm)",
    "sku": "37CDE6",
    "slug": "asia-btn180-8eb28cce",
    "category": "Bolsas & Mochilas",
    "sections": [
      "lancamentos"
    ],
    "basePrice": 2.88,
    "originalPrice": 28.75,
    "maxDiscount": 90,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2026%2F01%2FPERFIL-22.jpg&w=500&q=72&output=webp&we=1",
    "hoverImage": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2025%2F08%2FArtboard-2-1-scaled.jpg&w=500&q=72&output=webp&we=1",
    "inStock": true,
    "featured": false,
    "stockQuantity": 1500,
    "colors": [
      "#111111",
      "#facc15",
      "#1e3a8a",
      "#86efac",
      "#dc2626",
      "#16a34a"
    ],
    "colorNames": [
      {
        "name": "Preto",
        "hex": "#111111"
      },
      {
        "name": "Amarelo",
        "hex": "#facc15"
      },
      {
        "name": "Azul Escuro",
        "hex": "#1e3a8a"
      },
      {
        "name": "Verde Claro",
        "hex": "#86efac"
      },
      {
        "name": "Vermelho",
        "hex": "#dc2626"
      },
      {
        "name": "Verde",
        "hex": "#16a34a"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 28.75,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 5.75,
        "discount": 80
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 4.6,
        "discount": 84
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 2.88,
        "discount": 90
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 2.65,
        "discount": 91
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 2.53,
        "discount": 91
      }
    ]
  },
  {
    "id": "3eb3d9f3-91fd-402e-81f0-609a8aaace63",
    "name": "Sacola/Mochila Poliéster 210D e PU (43x35cm)",
    "sku": "3EB3D9",
    "slug": "asia-bp0009-3a8ff237",
    "category": "Bolsas & Mochilas",
    "sections": [
      "lancamentos"
    ],
    "basePrice": 52.25,
    "originalPrice": 104.5,
    "maxDiscount": 50,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2024%2F06%2FPerfil-33.jpg&w=500&q=72&output=webp&we=1",
    "hoverImage": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2024%2F06%2FBP0009-AZ-2.jpg&w=500&q=72&output=webp&we=1",
    "inStock": true,
    "featured": false,
    "stockQuantity": 1500,
    "colors": [
      "#1d4ed8",
      "#16a34a",
      "#111111",
      "#9ca3af"
    ],
    "colorNames": [
      {
        "name": "Azul",
        "hex": "#1d4ed8"
      },
      {
        "name": "Verde",
        "hex": "#16a34a"
      },
      {
        "name": "Preto",
        "hex": "#111111"
      },
      {
        "name": "Cinza",
        "hex": "#9ca3af"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 104.5,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 83.6,
        "discount": 20
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 58.52,
        "discount": 44
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 52.25,
        "discount": 50
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 45.98,
        "discount": 56
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 43.89,
        "discount": 58
      }
    ]
  },
  {
    "id": "f6201c4a-7adf-4a7c-be58-53f6d4232722",
    "name": "Sacola/Mochila Poliéster 210D (40x35cm)",
    "sku": "F6201C",
    "slug": "asia-bp0001-ce26880b",
    "category": "Bolsas & Mochilas",
    "sections": [
      "lancamentos"
    ],
    "basePrice": 8.5,
    "originalPrice": 85,
    "maxDiscount": 90,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2023%2F10%2FPERFIL-CATALOGO.png&w=500&q=72&output=webp&we=1",
    "hoverImage": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2023%2F10%2FSacola-Mochila-VERDE-2138-1639496084.png&w=500&q=72&output=webp&we=1",
    "inStock": true,
    "featured": false,
    "stockQuantity": 1500,
    "colors": [
      "#16a34a",
      "#9ca3af",
      "#111111",
      "#f97316",
      "#60a5fa",
      "#1d4ed8"
    ],
    "colorNames": [
      {
        "name": "Verde",
        "hex": "#16a34a"
      },
      {
        "name": "Cinza",
        "hex": "#9ca3af"
      },
      {
        "name": "Preto",
        "hex": "#111111"
      },
      {
        "name": "Laranja",
        "hex": "#f97316"
      },
      {
        "name": "Azul Claro",
        "hex": "#60a5fa"
      },
      {
        "name": "Azul",
        "hex": "#1d4ed8"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 85,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 17,
        "discount": 80
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 13.6,
        "discount": 84
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 8.5,
        "discount": 90
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 7.82,
        "discount": 91
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 7.48,
        "discount": 91
      }
    ]
  },
  {
    "id": "b1e222f9-8e3d-4610-ae36-d7e3b6f513da",
    "name": "Sacola/Mochila em Algodão e Cortiça 140g/m² (39x37x8,5cm)",
    "sku": "B1E222",
    "slug": "asia-bp0008p-b3fe180c",
    "category": "Bolsas & Mochilas",
    "sections": [
      "lancamentos"
    ],
    "basePrice": 22,
    "originalPrice": 220,
    "maxDiscount": 90,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2024%2F05%2FPERFIL-SITE-10.jpg&w=500&q=72&output=webp&we=1",
    "hoverImage": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2024%2F05%2FIMG_4758-2.jpg&w=500&q=72&output=webp&we=1",
    "inStock": true,
    "featured": false,
    "stockQuantity": 1500,
    "colors": [
      "#ffffff"
    ],
    "colorNames": [
      {
        "name": "Branco",
        "hex": "#ffffff"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 220,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 44,
        "discount": 80
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 35.2,
        "discount": 84
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 22,
        "discount": 90
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 20.24,
        "discount": 91
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 19.36,
        "discount": 91
      }
    ]
  },
  {
    "id": "2a11034e-a03b-4a20-b439-44ab0b93c4b8",
    "name": "Pasta Executiva",
    "sku": "2A1103",
    "slug": "asia-pa110-fb68bbb8",
    "category": "Bolsas & Mochilas",
    "sections": [
      "lancamentos"
    ],
    "basePrice": 83.5,
    "originalPrice": 167,
    "maxDiscount": 50,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2023%2F10%2Fpasta-executiva-4d65237d3ec620d8b35daa401db6c9481093a142.jpg&w=500&q=72&output=webp&we=1",
    "hoverImage": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2023%2F10%2Fpasta-executiva-234ac961e237747640edb6c21ec55cd216239897.jpg&w=500&q=72&output=webp&we=1",
    "inStock": true,
    "featured": false,
    "stockQuantity": 1500,
    "colors": [
      "#111111",
      "#1d4ed8",
      "#9ca3af"
    ],
    "colorNames": [
      {
        "name": "Preto",
        "hex": "#111111"
      },
      {
        "name": "Azul",
        "hex": "#1d4ed8"
      },
      {
        "name": "Cinza",
        "hex": "#9ca3af"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 167,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 133.6,
        "discount": 20
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 93.52,
        "discount": 44
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 83.5,
        "discount": 50
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 73.48,
        "discount": 56
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 70.14,
        "discount": 58
      }
    ]
  },
  {
    "id": "57b3528b-2f93-4cac-a7bc-d58e3699ff91",
    "name": "Sacola TNT 80gr (41x37cm)",
    "sku": "57B352",
    "slug": "asia-btn080-e8931d5f",
    "category": "Bolsas & Mochilas",
    "sections": [
      "lancamentos"
    ],
    "basePrice": 4.25,
    "originalPrice": 42.5,
    "maxDiscount": 90,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2025%2F08%2FPERFIL-novas-cores-1.jpg&w=500&q=72&output=webp&we=1",
    "hoverImage": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2025%2F08%2FVERDE.jpg&w=500&q=72&output=webp&we=1",
    "inStock": true,
    "featured": false,
    "stockQuantity": 1500,
    "colors": [
      "#16a34a",
      "#f97316",
      "#facc15",
      "#1e3a8a",
      "#111111",
      "#ffffff"
    ],
    "colorNames": [
      {
        "name": "Verde",
        "hex": "#16a34a"
      },
      {
        "name": "Laranja",
        "hex": "#f97316"
      },
      {
        "name": "Amarelo",
        "hex": "#facc15"
      },
      {
        "name": "Azul Escuro",
        "hex": "#1e3a8a"
      },
      {
        "name": "Preto",
        "hex": "#111111"
      },
      {
        "name": "Branco",
        "hex": "#ffffff"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 42.5,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 8.5,
        "discount": 80
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 6.8,
        "discount": 84
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 4.25,
        "discount": 90
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 3.91,
        "discount": 91
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 3.74,
        "discount": 91
      }
    ]
  },
  {
    "id": "411dda52-4487-4315-97ca-964fd294c95d",
    "name": "Pasta Capa em Poliéster",
    "sku": "411DDA",
    "slug": "asia-pc900-1f02f2e3",
    "category": "Bolsas & Mochilas",
    "sections": [
      "lancamentos"
    ],
    "basePrice": 114.75,
    "originalPrice": 229.5,
    "maxDiscount": 50,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2023%2F10%2FPerfil.jpg&w=500&q=72&output=webp&we=1",
    "hoverImage": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2023%2F10%2Fpasta-8b51c7d5381734fabf3db0be676d6e300ec828e5.jpg&w=500&q=72&output=webp&we=1",
    "inStock": true,
    "featured": false,
    "stockQuantity": 1500,
    "colors": [
      "#111111",
      "#1d4ed8"
    ],
    "colorNames": [
      {
        "name": "Preto",
        "hex": "#111111"
      },
      {
        "name": "Azul",
        "hex": "#1d4ed8"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 229.5,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 183.6,
        "discount": 20
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 128.52,
        "discount": 44
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 114.75,
        "discount": 50
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 100.98,
        "discount": 56
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 96.39,
        "discount": 58
      }
    ]
  },
  {
    "id": "1b96c9a0-6b99-4891-b996-825213922516",
    "name": "Sacola Térmica (35x12cm)",
    "sku": "1B96C9",
    "slug": "asia-btn304-443f4e98",
    "category": "Bolsas & Mochilas",
    "sections": [
      "lancamentos"
    ],
    "basePrice": 4.75,
    "originalPrice": 47.5,
    "maxDiscount": 90,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2026%2F01%2FUntitled-1-2.jpg&w=500&q=72&output=webp&we=1",
    "hoverImage": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2026%2F01%2FBTN304-VI.jpg&w=500&q=72&output=webp&we=1",
    "inStock": true,
    "featured": false,
    "stockQuantity": 1500,
    "colors": [
      "#5b0f1a",
      "#60a5fa",
      "#f97316",
      "#ffffff",
      "#1e3a8a",
      "#dc2626"
    ],
    "colorNames": [
      {
        "name": "Vinho",
        "hex": "#5b0f1a"
      },
      {
        "name": "Azul Claro",
        "hex": "#60a5fa"
      },
      {
        "name": "Laranja",
        "hex": "#f97316"
      },
      {
        "name": "Branco",
        "hex": "#ffffff"
      },
      {
        "name": "Azul Escuro",
        "hex": "#1e3a8a"
      },
      {
        "name": "Vermelho",
        "hex": "#dc2626"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 47.5,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 9.5,
        "discount": 80
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 7.6,
        "discount": 84
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 4.75,
        "discount": 90
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 4.37,
        "discount": 91
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 4.18,
        "discount": 91
      }
    ]
  },
  {
    "id": "00ef92bc-c49e-422f-bc5d-db53bf9b1e87",
    "name": "Pasta Capa em Poliéster",
    "sku": "00EF92",
    "slug": "asia-pc600-494bc5bb",
    "category": "Bolsas & Mochilas",
    "sections": [
      "lancamentos"
    ],
    "basePrice": 127.5,
    "originalPrice": 255,
    "maxDiscount": 50,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2023%2F10%2Fperfil-1.jpg&w=500&q=72&output=webp&we=1",
    "hoverImage": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2023%2F10%2FPasta-CINZA-2168-1640263535.png&w=500&q=72&output=webp&we=1",
    "inStock": true,
    "featured": false,
    "stockQuantity": 1500,
    "colors": [
      "#9ca3af",
      "#111111",
      "#1d4ed8"
    ],
    "colorNames": [
      {
        "name": "Cinza",
        "hex": "#9ca3af"
      },
      {
        "name": "Preto",
        "hex": "#111111"
      },
      {
        "name": "Azul",
        "hex": "#1d4ed8"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 255,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 204,
        "discount": 20
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 142.8,
        "discount": 44
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 127.5,
        "discount": 50
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 112.2,
        "discount": 56
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 107.1,
        "discount": 58
      }
    ]
  },
  {
    "id": "47a99a4b-81a0-4bb0-b4d6-2206cf5c7c8a",
    "name": "Placa de metal",
    "sku": "47A99A",
    "slug": "asia-pl08-1e53ac29",
    "category": "Escritório & Papelaria",
    "sections": [
      "lancamentos"
    ],
    "basePrice": 34.5,
    "originalPrice": 345,
    "maxDiscount": 90,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2026%2F06%2FASIA8935.JPG-scaled.jpg&w=500&q=72&output=webp&we=1",
    "hoverImage": "",
    "inStock": true,
    "featured": false,
    "stockQuantity": 1500,
    "colors": [
      "#111111"
    ],
    "colorNames": [
      {
        "name": "Preto",
        "hex": "#111111"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 345,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 69,
        "discount": 80
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 55.2,
        "discount": 84
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 34.5,
        "discount": 90
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 31.74,
        "discount": 91
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 30.36,
        "discount": 91
      }
    ]
  },
  {
    "id": "3ba27d7d-f977-4e9d-891f-d546302215da",
    "name": "Umidificador",
    "sku": "3BA27D",
    "slug": "asia-umi2000p-db3c7a6e",
    "category": "Tecnologia & Acessórios",
    "sections": [
      "lancamentos"
    ],
    "basePrice": 40.75,
    "originalPrice": 81.5,
    "maxDiscount": 50,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2023%2F10%2FPerfil-9.jpg&w=500&q=72&output=webp&we=1",
    "hoverImage": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2023%2F10%2Fumidificador-961e1b40a0a21474556c684b3a1b7e447aa48962.jpg&w=500&q=72&output=webp&we=1",
    "inStock": true,
    "featured": false,
    "stockQuantity": 1500,
    "colors": [
      "#ffffff"
    ],
    "colorNames": [
      {
        "name": "Branco",
        "hex": "#ffffff"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 81.5,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 65.2,
        "discount": 20
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 45.64,
        "discount": 44
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 40.75,
        "discount": 50
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 35.86,
        "discount": 56
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 34.23,
        "discount": 58
      }
    ]
  },
  {
    "id": "6060520e-b794-4279-aae5-0c3d31471242",
    "name": "Sacola em Poliéster 600D e Cortiça (38x35x8,5cm)",
    "sku": "606052",
    "slug": "asia-bco1000p-66ca6096",
    "category": "Bolsas & Mochilas",
    "sections": [
      "lancamentos"
    ],
    "basePrice": 27.25,
    "originalPrice": 272.5,
    "maxDiscount": 90,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2023%2F10%2FPERFIL-SITE-13.jpg&w=500&q=72&output=webp&we=1",
    "hoverImage": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2023%2F10%2Fsacola-1-70e095ccb601e8f5a43d5e8f0720ac998e26038e.jpg&w=500&q=72&output=webp&we=1",
    "inStock": true,
    "featured": false,
    "stockQuantity": 1500,
    "colors": [
      "#e8d8b8"
    ],
    "colorNames": [
      {
        "name": "Natural",
        "hex": "#e8d8b8"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 272.5,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 54.5,
        "discount": 80
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 43.6,
        "discount": 84
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 27.25,
        "discount": 90
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 25.07,
        "discount": 91
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 23.98,
        "discount": 91
      }
    ]
  },
  {
    "id": "38bdfdaa-8a78-4e0e-b622-519350df113d",
    "name": "Sacola em Algodão 280g/m² (40x38x10cm)",
    "sku": "38BDFD",
    "slug": "asia-bac004p-b6a32f64",
    "category": "Bolsas & Mochilas",
    "sections": [
      "lancamentos"
    ],
    "basePrice": 36.25,
    "originalPrice": 362.5,
    "maxDiscount": 90,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2024%2F05%2FPERFIL-41.jpg&w=500&q=72&output=webp&we=1",
    "hoverImage": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2024%2F05%2FIMG_1167.jpg&w=500&q=72&output=webp&we=1",
    "inStock": true,
    "featured": false,
    "stockQuantity": 1500,
    "colors": [
      "#ffffff"
    ],
    "colorNames": [
      {
        "name": "Branco",
        "hex": "#ffffff"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 362.5,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 72.5,
        "discount": 80
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 58,
        "discount": 84
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 36.25,
        "discount": 90
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 33.35,
        "discount": 91
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 31.9,
        "discount": 91
      }
    ]
  },
  {
    "id": "2281a2fc-6e50-4792-aecd-7656e26c93ae",
    "name": "Sacola em Algodão 220g/m² (28x36x16cm)",
    "sku": "2281A2",
    "slug": "asia-bac009p-a528cdef",
    "category": "Bolsas & Mochilas",
    "sections": [
      "lancamentos"
    ],
    "basePrice": 36.25,
    "originalPrice": 362.5,
    "maxDiscount": 90,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2025%2F04%2FPERFIL-14.jpg&w=500&q=72&output=webp&we=1",
    "hoverImage": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2024%2F07%2FBAC009-2.jpg&w=500&q=72&output=webp&we=1",
    "inStock": true,
    "featured": false,
    "stockQuantity": 1500,
    "colors": [
      "#41c885"
    ],
    "colorNames": [
      {
        "name": "Cru",
        "hex": "#41c885"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 362.5,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 72.5,
        "discount": 80
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 58,
        "discount": 84
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 36.25,
        "discount": 90
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 33.35,
        "discount": 91
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 31.9,
        "discount": 91
      }
    ]
  },
  {
    "id": "f0d31cbe-16c3-4b90-90db-f32e4d251367",
    "name": "Sacola em Juta 360g/m² (41x35x10cm)",
    "sku": "F0D31C",
    "slug": "asia-bjt003p-0ce64663",
    "category": "Bolsas & Mochilas",
    "sections": [
      "lancamentos"
    ],
    "basePrice": 48.5,
    "originalPrice": 97,
    "maxDiscount": 50,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2025%2F04%2FPERFIL-18.jpg&w=500&q=72&output=webp&we=1",
    "hoverImage": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2024%2F07%2FBJT003-2.jpg&w=500&q=72&output=webp&we=1",
    "inStock": true,
    "featured": false,
    "stockQuantity": 1500,
    "colors": [
      "#41c885"
    ],
    "colorNames": [
      {
        "name": "Cru",
        "hex": "#41c885"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 97,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 77.6,
        "discount": 20
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 54.32,
        "discount": 44
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 48.5,
        "discount": 50
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 42.68,
        "discount": 56
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 40.74,
        "discount": 58
      }
    ]
  },
  {
    "id": "4c18f01e-0dec-4f6d-9522-cf2546c7a7e3",
    "name": "Umidificador",
    "sku": "4C18F0",
    "slug": "asia-umi3000p-f7efc227",
    "category": "Tecnologia & Acessórios",
    "sections": [
      "lancamentos"
    ],
    "basePrice": 61,
    "originalPrice": 122,
    "maxDiscount": 50,
    "description": "Produto personalizado de alta qualidade, ideal para eventos corporativos e fortalecimento de marca.",
    "image": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2023%2F10%2FPerfil-8.jpg&w=500&q=72&output=webp&we=1",
    "hoverImage": "https://wsrv.nl/?url=https%3A%2F%2Fmedia.asiaimport.com.br%2F2023%2F10%2Fumidificador-8beda60dc574ceb5cd5cb2c8d066ae66d869a45b.jpg&w=500&q=72&output=webp&we=1",
    "inStock": true,
    "featured": false,
    "stockQuantity": 1500,
    "colors": [
      "#ffffff"
    ],
    "colorNames": [
      {
        "name": "Branco",
        "hex": "#ffffff"
      }
    ],
    "tiers": [
      {
        "label": "1–9",
        "minQty": 1,
        "maxQty": 9,
        "price": 122,
        "discount": 0
      },
      {
        "label": "10–49",
        "minQty": 10,
        "maxQty": 49,
        "price": 97.6,
        "discount": 20
      },
      {
        "label": "50–99",
        "minQty": 50,
        "maxQty": 99,
        "price": 68.32,
        "discount": 44
      },
      {
        "label": "100–499",
        "minQty": 100,
        "maxQty": 499,
        "price": 61,
        "discount": 50
      },
      {
        "label": "500–999",
        "minQty": 500,
        "maxQty": 999,
        "price": 53.68,
        "discount": 56
      },
      {
        "label": "1000+",
        "minQty": 1000,
        "maxQty": "+",
        "price": 51.24,
        "discount": 58
      }
    ]
  }
];
