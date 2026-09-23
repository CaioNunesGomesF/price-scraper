# Price Scraper Web Interface

## Visão Geral
A Price Scraper Web Interface é uma Single-Page Application (SPA) responsiva construída para interagir com a Price Scraper API. Desenvolvida utilizando React e Vite, entrega uma experiência de usuário fluida para busca, comparação e gerenciamento de anúncios de produtos em diversas plataformas.

## Tecnologias Principais
- **Framework**: React 18, Vite.
- **Linguagem**: TypeScript (Strict Mode).
- **Estilização**: Component-scoped CSS (ou Tailwind CSS dependendo da configuração).
- **Ícones**: Lucide React.
- **Cliente HTTP**: Axios (Singleton centralizado com interceptors).

## Principais Funcionalidades
- **Agregação Dinâmica de Dados**: Exibe resultados agregados do Mercado Livre, Amazon, OLX e GGMax em um grid unificado.
- **Interface Baseada em Chat**: Incorpora um padrão de UI intuitivo, simulando um assistente conversacional para buscas e análises.
- **Gerenciamento Seguro de Sessão**: Lida automaticamente com a persistência do JWT e sua injeção via interceptors do Axios para rotas autenticadas (ex: Favoritos).
- **Renderização Otimizada**: Implementa debouncing, lazy loading para imagens e checagens estritas de nulos para tratar graciosamente a ausência de dados de algumas plataformas.

## Configuração de Ambiente
Certifique-se de que o frontend consegue localizar a API backend definindo as variáveis de ambiente necessárias. Um arquivo `.env` deve estar presente no momento do build:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

## Instalação e Execução

### Utilizando Docker (Standalone)
Para construir e rodar o contêiner Web de forma isolada (servido via Nginx):
```bash
docker build --build-arg VITE_API_URL=http://localhost:3000/api/v1 -t price-scraper-web .
docker run -p 8080:80 -d price-scraper-web
```

### Desenvolvimento Local
Para rodar o servidor de desenvolvimento do Vite localmente:
```bash
npm install
npm run dev
```
A aplicação estará acessível em `http://localhost:5173` (porta padrão do Vite) ou na porta especificada no `vite.config.ts`.

## Estrutura de Diretórios
```text
src/
├── main.tsx             # Ponto de entrada da aplicação
├── App.tsx              # Componente raiz e estrutura de layout
├── components/          # Componentes de UI reutilizáveis (Botões, Modais, Loaders)
├── features/            # Componentes de domínio (Feature-sliced: Search, Auth, Favorites)
├── services/            # Camada de integração com a API
│   ├── http.ts          # Interceptor e configuração do Axios
│   ├── authApi.ts       # Endpoints de autenticação
│   ├── searchApi.ts     # Endpoints de agregação de dados
│   └── favoritesApi.ts  # Gerenciamento de itens salvos
└── types/               # Definições globais do TypeScript
```

## Políticas Anti-Hotlinking
Para garantir que imagens de terceiros (como as miniaturas de produtos da OLX) sejam renderizadas com sucesso em ambientes locais ou de desenvolvimento, a tag `<meta name="referrer" content="no-referrer" />` é aplicada no `index.html`. Isso previne erros HTTP 403 Forbidden acionados pelas validações de origem externa.
