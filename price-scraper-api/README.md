# Price Scraper API

## Visão Geral
A Price Scraper API é um backend de alta performance desenvolvido em Node.js, projetado para orquestrar a extração de dados em múltiplas plataformas de e-commerce e classificados (Mercado Livre, OLX, Amazon e GGMax). Construído sobre Express e tipagem estrita (100% TypeScript), o sistema fornece autenticação segura, validação padronizada de dados e um motor de scraping concorrente.

## Tecnologias Principais
- **Runtime & Framework**: Node.js, Express.js, TypeScript.
- **Validação de Dados**: Zod.
- **Motor de Scraping**: Puppeteer (com plugins stealth), Axios, Cheerio.
- **Banco de Dados & ORM**: PostgreSQL, Drizzle ORM.
- **Segurança**: Argon2 (hash de senhas), JSON Web Tokens (JWT).

## Principais Funcionalidades
- **Extração Paralela de Dados**: Implementa uma fila baseada em semáforo para executar instâncias de navegadores headless com segurança, prevenindo sobrecarga de CPU e vazamento de memória.
- **Estratégias Avançadas de Scraping**: Possui mecanismos de fallback, rotação de User-Agent e extração direta de blocos JSON serializados de aplicações Next.js 14+ (React Server Components / RSC payloads).
- **Cache em Memória**: Implementa uma camada de cache baseada em TTL para reduzir requisições de rede redundantes e otimizar o tempo de resposta.
- **Mitigação de WAF**: Projetado para contornar Web Application Firewalls (WAF) padrão. (Nota: Desafios gerenciados altamente restritivos, como o Cloudflare Turnstile em IPs de Datacenter, exigem roteamento via proxy residencial).

## Configuração de Ambiente
Crie um arquivo `.env` na raiz do diretório da API copiando o exemplo fornecido:
```bash
cp ../.env.example .env
```
Certifique-se de que as credenciais do banco de dados e as chaves de segurança (`JWT_SECRET`, `ENCRYPTION_MASTER_KEY`) estejam preenchidas corretamente.

## Instalação e Execução

### Utilizando Docker (Standalone)
Para construir e rodar o contêiner da API de forma isolada:
```bash
docker build -t price-scraper-api .
docker run -p 3000:3000 --env-file .env -d price-scraper-api
```

### Desenvolvimento Local
Para rodar a API em um ambiente de desenvolvimento local (requer PostgreSQL em execução):
```bash
npm install
npm run dev
```

## Estrutura de Diretórios
```text
src/
├── app.ts                  # Configuração da aplicação Express
├── server.ts               # Ponto de entrada (Entry point)
├── config/                 # Configurações de ambiente e banco de dados
├── middleware/             # Tratamento global de erros e verificação JWT
├── modules/
│   ├── auth/               # Autenticação e registro de usuários
│   ├── favorites/          # CRUD em PostgreSQL para itens salvos
│   └── search/             # Endpoints principais e motor de scraping
│       └── scrapers/       # Implementações de scrapers específicos por plataforma
└── utils/                  # Criptografia, clientes HTTP e utilitários
```

## Qualidade de Código e Padrões
Este projeto aplica compilação TypeScript estrita (`"strict": true` no `tsconfig.json`) e módulos isolados.
