# Gordinho Brindes - Brindes Personalizados

E-commerce da Gordinho Brindes (Grupo Gordinho, Itajaí/SC) para brindes corporativos e produtos personalizados, desenvolvido com Vite, JavaScript e Tailwind CSS. Inclui vitrine de produtos completa, sistema de orçamentos e painel administrativo interativo com persistência de dados.

---

## 🚀 Funcionalidades

- **Vitrine Interativa**: Catálogo completo com visualização de produtos, variações, precificação dinâmica por quantidade e busca em tempo real.
- **Painel Administrativo (`/admin.html`)**:
  - Gestão de catálogo de produtos (cadastro, edição, remoção e preços).
  - Gerenciamento de pedidos e orçamentos em tempo real.
  - Configurações da loja (faixa de anúncios do topo, cashback promocional, etc.).
  - Ferramenta de exportação e backup de dados.
- **Persistência Local**: Banco de dados mock reativo (`db.js`) sincronizado com o storefront em tempo real.
- **Design Responsivo**: Adaptado para desktop, tablet e mobile com menu lateral e popups integrados.

---

## 🛠️ Tecnologias Utilizadas

- **Vite**
- **JavaScript (ES Modules)**
- **Tailwind CSS**
- **HTML5 & CSS3**

---

## 📦 Como Rodar o Projeto

1. Clone o repositório:
```bash
git clone https://github.com/DevArinoBorba/brinde.git
cd brinde
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Para gerar a build de produção:
```bash
npm run build
```

5. Para pré-visualizar a build:
```bash
npm run preview
```

---

## 🌐 Estrutura do Projeto

```
├── admin.html          # Painel administrativo
├── index.html          # Página principal da loja
├── package.json        # Dependências e scripts
├── vite.config.js      # Configuração do Vite
├── public/             # Arquivos estáticos e imagens
│   ├── assets/
│   ├── icons/
│   └── favicon.png
└── src/                # Código fonte
    ├── admin.css       # Estilos do painel admin
    ├── admin.js        # Lógica do painel admin
    ├── db.js           # Gerenciamento de estado e persistência
    ├── main.js         # Lógica da loja e interatividade
    └── styles.css      # Estilos globais
```
