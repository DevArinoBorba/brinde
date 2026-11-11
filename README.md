# Gordinho Brindes - Brindes Personalizados

E-commerce da Gordinho Brindes (Grupo Gordinho, Itajaí/SC) para brindes corporativos e produtos personalizados, desenvolvido com Vite, JavaScript e Tailwind CSS. Inclui vitrine de produtos completa, sistema de orçamentos e painel administrativo interativo com persistência de dados.

---

## 🚀 Funcionalidades

- **Vitrine Interativa**: Catálogo completo com visualização de produtos, variações, precificação dinâmica por quantidade e busca em tempo real.
- **Painel Administrativo (`/admin`)**:
  - Gestão de catálogo de produtos (cadastro, edição, remoção e preços).
  - Gerenciamento de pedidos e orçamentos em tempo real.
  - Configurações da loja aplicadas em todo o site (contatos, redes sociais, reels do Instagram, promoções).
- **Banco de Dados**: PostgreSQL com API Node/Express (`server/`); o painel grava no banco e a loja lê de lá.
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

3. Inicie a API. Sem `DATABASE_URL` ela usa o PGlite (Postgres embutido em `./.data/pglite`):
```bash
ADMIN_PIN=1234 SESSION_SECRET=dev npm run dev:api
```

4. Em outro terminal, inicie o Vite (o proxy encaminha `/api` para a porta `API_PORT`, padrão 3000):
```bash
npm run dev
```

5. Build e servidor de produção:
```bash
npm run build
npm start
```

As variáveis de ambiente estão documentadas em `.env.example`. O `ADMIN_PIN` só é usado na primeira execução; depois o PIN é trocado pelo próprio painel.

## 🚀 Deploy (Coolify)

- Aplicação `gordinho-brindes` (Dockerfile, porta 3000, health check `/api/health`) em https://brindes.oriumdigital.tech
- Banco PostgreSQL `gordinho-brindes-db` no mesmo projeto, só na rede interna, com backup diário às 03h
- O deploy não é automático: depois do push na `main`, use "Redeploy" no Coolify

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
