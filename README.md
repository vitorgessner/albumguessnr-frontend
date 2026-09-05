# AlbumGuessnr — Frontend - EN

This project is the frontend interface for AlbumGuessnr, the music album guessing game. It consumes the backend API (authentication, music provider sync, game logic, daily album, leaderboards, and social features) and delivers the game experience in the browser.

Quick summary:
- React + Vite client written in TypeScript
- Stateful logic with Zustand
- Requests via Axios + TanStack Query
- Styling with Tailwind CSS

## What's new

- OAuth integrations used by the frontend
- required Vite environment variables
- Google Analytics implementation
- new daily album feature

## Stack

- Framework: React + Vite
- Language: TypeScript
- State: Zustand
- Data fetching: TanStack Query (React Query)
- HTTP client: Axios (with an interceptor for refresh token)
- Forms: React Hook Form
- Validation: Zod
- Styling: Tailwind CSS

## Structure (summary)

```
src/
├── features/
│ ├── auth/ # login, registration, authentication components and hooks
│ └── game/guess/ # guessing flow, components, hooks, and stores
└── shared/ # utils (axios, types), shared components
```


## Main frontend responsibilities

- Authentication (including OAuth links for Spotify / Google / Last.fm)
- Syncing and requesting albums from the backend (/integration/albums)
- Gameplay: showing blurred covers, collecting guesses, showing results
- Displaying public profiles, leaderboards, and user statistics
- Integrating with Supabase storage for images (via URL provided by the backend)
- Sending analytics events (optional, via Vite env)

## Authentication

- The backend keeps the JWT in an HttpOnly cookie; the frontend never handles the token directly
- Axios is configured with an interceptor that, on a 401, attempts /refresh and retries the request
- OAuth: the frontend starts the flow by redirecting to the backend routes:
  - /login/spotify
  - /login/google
  - /login/lastfm
  These routes handle the OAuth handshake; the backend redirects back to the frontend after authentication

## Music provider integration

- The frontend triggers syncs (e.g., via `/game` or integration actions) and consumes albums already normalized by the backend
- Normalization (removing edition suffixes, versioning, normalizing names) is done by the backend, and the frontend uses the `normalized*` fields for comparison
- The backend may process syncs asynchronously (RabbitMQ); the frontend simply triggers the sync and waits for the result to be available via the API

## Daily Album (daily challenge)

- The backend provides endpoints for the daily album; the frontend consumes:
  - `GET /daily/album` — get today's album for the user
  - `POST /daily/album/try` — submit a daily guess attempt
  - `GET /daily/album/statistics` — individual statistics
  - `GET /daily/album/overall/statistics` — global statistics

## Social and Leaderboards

- Friendships, requests, and public profiles are supported by the backend; relevant routes used by the frontend:
  - `GET /profile/:username`
  - `GET /leaderboards/...`
  - `GET /friend/...`
  - `GET /stats/:username`

## Game flow (summary)

1. `useUser` fetches the authenticated user (`GET /me`)
2. `GuessSync` triggers the backend sync and waits for completion
3. The frontend requests albums via `GET /integration/albums`
4. Albums arrive normalized, get shuffled (`shuffle`), and are stored in `useGuessStore`
5. `GuessContent` displays the album with the blurred cover and the configured guessing fields
6. `useCompare` uses `normalized*` fields to compare answers
7. On submit, the frontend calls `POST /guess` to record the attempt and receives the result (score, isNewBestScore, updates)

## Normalization and data

- The frontend relies on the normalized fields (`normalizedName`, `normalizedArtist`, `normalizedName` on tracks/genres) provided by the backend
- Comparisons are case-, accent-, punctuation-, and edition-suffix-insensitive

## Relevant backend routes (quick reference)

- Health: `GET /health`
- Session: `GET /me`, `POST /refresh`, `DELETE /logout`
- Auth: `POST /login`, `POST /register`, `POST /forgot`, `PUT /passwordChange/:token`, `GET /verify/:token`, `POST /resendVerification`, `GET /guest`/`POST /guest`
- OAuth: `GET /login/google`, `GET /google/callback`, `GET /login/spotify`, `GET /spotify/callback`, `GET /login/lastfm`
- Integration: `GET /integration/albums`, `DELETE /provider/spotify`, `DELETE /provider/lastfm`
- Game: `POST /guess`, `GET /guess/:albumId`, `GET /guess/recently`
- Daily album: `GET /daily/album`, `POST /daily/album/try`, `GET /daily/album/statistics` (see section above)
- Profiles / Leaderboards / Stats: `GET /profile/:username`, `GET /leaderboards/...`, `GET /stats/:username`

## Environment variables (Vite)

Place a `.env` or `.env.local` file at the project root with the variables below (example):

- VITE_API_URL — base URL of the backend API (e.g., https://api.albumguessnr.example)
- VITE_SUPABASE_STORAGE — base URL of the Supabase storage used for images (SVG fallback)
- VITE_GTAG_ID — (optional) Google Analytics measurement ID for sending events via gtag

Note: the project uses `import.meta.env.VITE_*` wherever these variables are needed.

## Running locally

1. Install dependencies:

```bash
npm install
```

2. Create the environment file (copy a local example):

```bash
# create .env with the required VITE_* variables
```

3. Run in development mode (Vite):

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

5. Serve the build (preview):

```bash
npm run preview
```

## Available scripts

- `npm run dev` — runs Vite in development mode
- `npm run build` — compiles TypeScript and generates the Vite build
- `npm run preview` — serves the generated build (preview)
- `npm run lint` — runs ESLint
- `npm run test` — runs tests with Vitest

---

# AlbumGuessnr — Frontend - PT-BR

Este projeto é a interface frontend do AlbumGuessnr, o jogo de adivinhação de álbuns musicais. Ele consome a API do backend (autenticação, sync com provedores de música, game logic, daily album, leaderboards e social) e oferece a experiência de jogo no navegador.

Resumo rápido:
- Cliente React + Vite escrito em TypeScript
- Stateful logic com Zustand
- Requisições via Axios + TanStack Query
- Estilização com Tailwind CSS

## O que é novo

- integrações OAuth que o frontend usa
- variáveis de ambiente Vite necessárias
- google analytics implementado
- nova feature de álbum diário

## Stack

- Framework: React + Vite
- Linguagem: TypeScript
- State: Zustand
- Data fetching: TanStack Query (React Query)
- HTTP client: Axios (com interceptor para refresh token)
- Forms: React Hook Form
- Validation: Zod
- Styling: Tailwind CSS

## Estrutura (resumo)

```
src/
├── features/
│   ├── auth/        # login, registro, componentes e hooks de autenticação
│   └── game/guess/  # fluxo de adivinhação, components, hooks e stores
└── shared/          # utils (axios, types), componentes compartilhados
```

## Principais responsabilidades do frontend

- Autenticação (incluindo links OAuth para Spotify / Google / Last.fm)
- Sincronizar e requisitar álbuns do backend (/integration/albums)
- Jogar: mostrar capas borradas, coletar tentativas, mostrar resultado
- Exibir perfis públicos, leaderboards e estatísticas de usuário
- Integrar com Supabase storage para imagens (via URL fornecida pelo backend)
- Enviar eventos de analytics (opcional, via Vite env)

## Autenticação

- O backend mantém JWT em cookie HttpOnly; o frontend não manipula o token diretamente
- Axios está configurado com um interceptor que, em caso de 401, tenta /refresh e reexecuta a requisição
- OAuth: o frontend inicia o fluxo redirecionando para as rotas do backend:
  - /login/spotify
  - /login/google
  - /login/lastfm
  Essas rotas abrigam o handshake OAuth; o backend redireciona de volta ao frontend após a autenticação

## Integração com provedores musicais

- O frontend aciona sincronizações (por exemplo, via `/game` ou ações de integração) e consome os álbuns já normalizados pelo backend
- A normalização (remover sufixos de edição, versionamento, normalizar nomes) é feita pelo backend e o frontend usa os campos `normalized*` para comparação
- O backend pode processar syncs assíncronos (RabbitMQ); o frontend apenas dispara e espera o resultado disponível via API

## Daily Album (desafio diário)

- O backend possui endpoints para daily album; o frontend deve consumir:
  - `GET /daily/album` — obter o álbum do dia para o usuário
  - `POST /daily/album/try` — submeter tentativa no daily
  - `GET /daily/album/statistics` — estatísticas individuais
  - `GET /daily/album/overall/statistics` — estatísticas globais

## Social e Leaderboards

- Amizades, solicitações e perfis públicos são suportados pelo backend; rotas relevantes que o frontend usa:
  - `GET /profile/:username`
  - `GET /leaderboards/...`
  - `GET /friend/...`
  - `GET /stats/:username`

## Fluxo do jogo (resumido)

1. `useUser` busca o usuário autenticado (`GET /me`)
2. `GuessSync` dispara a sincronização do backend e aguarda conclusão
3. Frontend requisita álbuns via `GET /integration/albums`
4. Álbuns chegam normalizados e são embaralhados (`shuffle`) e guardados no `useGuessStore`
5. `GuessContent` exibe o álbum com a capa borrada e os campos configurados para adivinhação
6. `useCompare` usa `normalized*` para comparar respostas
7. Ao submeter, frontend chama `POST /guess` para registrar a tentativa e recebe o resultado (score, isNewBestScore, atualizações)

## Normalização e dados

- O frontend confia nos campos normalizados (`normalizedName`, `normalizedArtist`, `normalizedName` em tracks/gêneros) fornecidos pelo backend
- Comparações são feitas sem considerar maiúsculas/minúsculas, acentos, pontuação ou sufixos de edição

## Rotas backend relevantes (referência rápida)

- Saúde: `GET /health`
- Sessão: `GET /me`, `POST /refresh`, `DELETE /logout`
- Auth: `POST /login`, `POST /register`, `POST /forgot`, `PUT /passwordChange/:token`, `GET /verify/:token`, `POST /resendVerification`, `GET /guest`/`POST /guest`
- OAuth: `GET /login/google`, `GET /google/callback`, `GET /login/spotify`, `GET /spotify/callback`, `GET /login/lastfm`
- Integration: `GET /integration/albums`, `DELETE /provider/spotify`, `DELETE /provider/lastfm`
- Game: `POST /guess`, `GET /guess/:albumId`, `GET /guess/recently`
- Daily album: `GET /daily/album`, `POST /daily/album/try`, `GET /daily/album/statistics` (ver seção acima)
- Profiles / Leaderboards / Stats: `GET /profile/:username`, `GET /leaderboards/...`, `GET /stats/:username`

## Variáveis de ambiente (Vite)

Coloque um arquivo `.env` ou `.env.local` na raiz com as variáveis abaixo (exemplo):

- VITE_API_URL — URL base da API do backend (ex: https://api.albumguessnr.example)
- VITE_SUPABASE_STORAGE — URL base do storage do Supabase usado para imagens (fallback SVG)
- VITE_GTAG_ID — (opcional) Google Analytics measurement ID para envio de eventos via gtag

Observação: o projeto usa `import.meta.env.VITE_*` nos pontos onde essas variáveis são necessárias.

## Rodando localmente

1. Instalar dependências:

```bash
npm install
```

2. Criar arquivo de ambiente (copiar um exemplo localmente):

```bash
# criar .env com as VITE_* necessárias
```

3. Rodar em desenvolvimento (Vite):

```bash
npm run dev
```

4. Build para produção:

```bash
npm run build
```

5. Servir build (preview):

```bash
npm run preview
```

## Scripts disponíveis

- `npm run dev` — roda Vite em modo de desenvolvimento
- `npm run build` — compila TypeScript e gera build do Vite
- `npm run preview` — serve a build gerada (preview)
- `npm run lint` — executa ESLint
- `npm run test` — executa testes com Vitest

---