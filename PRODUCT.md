# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Compradores Corporativos & RH / Marketing (B2B)**: Empresas, agências e equipes de recursos humanos que buscam brindes personalizados em atacado (kits onboarding, garrafas térmicas, mochilas, blocos, canetas, ecobags, DTF têxtil) com tabela progressiva de desconto por quantidade e emissão rápida de orçamento/pedido.
- **Clientes Finais & Eventos (B2C)**: Clientes que buscam presentes personalizados e brindes para eventos com atendimento direto via site e WhatsApp.
- **Administradores da Operação (Admin CMS)**: Equipe interna da Gordinho Brindes que gerencia o catálogo de 50+ produtos, preços progressivos, estoque, categorias, pedidos/orçamentos recebidos, configurações promocionais e backups.

## Product Purpose

E-commerce e catálogo interativo de brindes personalizados da **Gordinho Brindes** (unidade de brindes do Grupo Gordinho em Itajaí/SC), permitindo consulta de preços progressivos por quantidade em tempo real, montagem de sacola de orçamentos multi-itens, busca e filtragem por categorias sem páginas quebradas, e gestão completa via Painel Administrativo integrado.

## Positioning

Produção própria com parque gráfico e industrial completo (Fiber Laser, DTF UV, DTF Têxtil, Sublimação, Transfer Giro 360, CNC Laser) do Grupo Gordinho (+10 anos de mercado e +250 mil atendimentos em Itajaí/SC), unindo preço direto de fábrica com tabela regressiva transparente por volume.

## Operating Context

- Navegação de catálogo em desktop e mobile, simulação instantânea de preço unitário por faixa de quantidade (1–9, 10–49, 50–99, 100–499, 500–999, 1000+), adição de múltiplos itens à sacola de orçamento e envio do pedido registrado no banco e/ou integrado ao WhatsApp comercial `(47) 98496-5444`.
- Gestão operacional pelo `/admin.html` com proteção por login/PIN, controle de produtos, faixas de preço, categorias, status de produção de pedidos e backup JSON.

## Capabilities and Constraints

- Stack Vite + ES Modules + Tailwind/CSS customizado, hospedado na Vercel (`https://brinde-rho.vercel.app/`).
- Todos os 50 produtos reais da vitrine sincronizados no `db.js` e editáveis pelo Painel Administrativo, refletindo em tempo real na vitrine.
- Roteamento e tratamento client-side + `vercel.json` para que nenhum link de produto, categoria, busca, conta, carrinho ou página institucional gere erro 404.

## Brand Commitments

- **Nome Oficial**: **Gordinho Brindes** (Grupo Gordinho).
- **Identidade Visual (Híbrido E-commerce Gordinho)**:
  - **Cabeçalho, Faixas de Autoridade, Banners e Rodapé**: Verde Floresta Profundo (`#06180E`, `#0A2717`, `#0F3822`) com destaques em Amarelo Ouro (`#FAB818`, hover `#E5A50E`) e Verde Esmeralda (`#22C55E`, hover `#16A34A`).
  - **Superfície da Vitrine e Cards de Produto**: Fundo claro de e-commerce (`#FFFFFF` / `#F8FAFC`) para leitura limpa das fotos de brindes, com acentos e CTAs na paleta oficial Gordinho.
  - **Tipografia Oficial**: `Outfit` (700, 800, 900) para títulos/destaques e `Plus Jakarta Sans` (400, 500, 600, 700) para corpo, preços tabulares e controles.
  - **Ativos de Marca**: Mascote e logo oficial Gordinho (`/assets/mascot.png`, `/assets/logo-gordinho.png`, `/favicon.png`).
  - **Dados de Atendimento**: Rua Dr. José Bonifácio Malburg, 315 - Sala 02 - Centro, Itajaí - SC | WhatsApp `(47) 98496-5444` (`5547984965444`) | Instagram `@gordinhocelularoficial`.

## Evidence on Hand

- 50 produtos reais de brindes corporativos com fotos em alta definição, SKUs, descrições, variações de cores e 6 faixas de preço por quantidade.
- Ativos oficiais da marca Gordinho em `C:\Users\arino\OneDrive\Documentos\Projetos\Gordinho Personalizados\assets\images\` (`mascot.png`, `logo.png`, `favicon.png`).

## Product Principles

1. **Sincronia Total Admin ↔ Vitrine**: Nenhum dado de produto, preço, categoria ou configuração exibido na loja pode ser estático ou desconectado do banco de dados gerenciado pelo Admin.
2. **Transparência de Preço em Atacado**: O comprador sempre enxerga claramente o preço unitário para a sua faixa de quantidade e o impacto no subtotal do orçamento.
3. **Zero Links Quebrados (Zero 404)**: Toda categoria, busca, produto, ação de cabeçalho ou link institucional abre uma visão funcional imediata.
4. **Identidade Gordinho Inconfundível**: Contraste marcante entre o Verde Floresta Profundo + Amarelo Ouro institucional e a clareza da vitrine de produtos.
