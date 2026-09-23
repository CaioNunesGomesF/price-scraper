# Price Scraper Monorepo

Sistema completo de monitoramento, raspagem e análise de preços em tempo real com Frontend em React/Vite e Backend em Node.js/Express.

---

## 📁 Estrutura do Projeto

```
price-scraper/
├── price-scraper-api/    # API backend (Node.js, Express, Puppeteer, Cheerio, Drizzle ORM, PostgreSQL)
├── price-scraper-web/    # Aplicação web (React, Vite, TypeScript, TailwindCSS, ApexCharts)
├── package.json          # Workspace root com scripts orquestrados
└── README.md
```

---

## 🚀 Como Executar

### Pré-requisitos
- **Node.js** (v18+)
- **PostgreSQL**

### 1. Instalação das Dependências
Na raiz do projeto:
```bash
npm run install:all
```

### 2. Configuração do Backend
Entre na pasta `price-scraper-api` e crie o `.env`:
```bash
cp price-scraper-api/.env.example price-scraper-api/.env
```
Ajuste as credenciais de banco e portas conforme seu ambiente.

### 3. Executando API e Web simultaneamente
Na raiz do projeto:
```bash
npm run dev
```

Ou execute individualmente:
```bash
# Somente Backend
npm run dev:api

# Somente Frontend
npm run dev:web
```
