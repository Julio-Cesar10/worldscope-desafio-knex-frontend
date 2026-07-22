# WorldScope

Frontend de exploração de dados geográficos, consumindo a [REST Countries API v5](https://restcountries.com/docs/countries).

## Rodando localmente

```bash
npm install
cp .env.example .env
# edite .env e cole sua chave pessoal da RestCountries em VITE_RESTCOUNTRIES_API_KEY
npm run dev
```

Abra http://localhost:5173.

Para gerar a chave: crie uma conta gratuita em https://restcountries.com/sign-up e copie a chave do painel. O plano gratuito cobre 500 requisições/mês.

### Build de produção

```bash
npm run build
npm run preview
```

## Stack

- **React 18 + TypeScript + Vite** — SPA simples não precisa de SSR/roteamento de servidor; Vite dá um dev loop rápido e um build enxuto.
- **react-router-dom** — rotas para listagem (`/`) e detalhe (`/country/:code`).
- **react-i18next** — i18n (bônus), inglês como padrão, com português alternável.
- Sem UI kit: todo o CSS é escrito à mão em `src/index.css` com variáveis de tema, para manter controle total sobre claro/escuro/sistema.

## Estrutura de pastas

```
src/
  types/        # Tipos TS que espelham o shape da API (country.ts, api.ts)
  services/     # Única camada que fala HTTP com a RestCountries (httpClient, countriesService)
  hooks/        # useCountries, useCountryFilters, useCountryDetail, useDebounce, useTheme
  contexts/     # ThemeContext (claro/escuro/sistema, persistido)
  i18n/         # Configuração do i18next + locales/en.json e pt.json
  components/
    layout/     # Header, ThemeToggle, LanguageToggle
    countries/  # CountryCard, CountryGrid, SearchBar, RegionFilter, SortControl
    common/     # LoadingSpinner, ErrorMessage, EmptyState
  pages/        # HomePage, CountryDetailPage, NotFoundPage
  utils/        # formatNumber, countryName (i18n de nomes), localCache
```

Nenhum componente fala diretamente com `fetch`: tudo passa por `services/countriesService.ts`, que por sua vez usa `services/httpClient.ts` para autenticação, parsing e tratamento de erro centralizados.

## Decisões técnicas

### Autenticação e uso da API

A v5 exige `Authorization: Bearer <chave>` em toda requisição. Isso está isolado em `httpClient.ts`; nenhum outro arquivo sabe como a autenticação funciona.

### Estratégia de dados: buscar tudo uma vez, filtrar no cliente

A listagem precisa de busca em tempo real + filtro de região + duas ordenações. Em vez de disparar uma requisição por tecla digitada (o que estouraria rapidamente as 500 requisições/mês), o app busca a lista completa de países **uma única vez** (paginando internamente com `limit=100`, já que esse é o teto do plano gratuito — em geral 3 páginas cobrem os ~250 países), usando `response_fields` para pedir só os campos que os cards precisam. Busca, filtro e ordenação acontecem depois, todos em memória (`useCountryFilters`).

Trade-off: isso significa uma carga inicial um pouco maior (3 requisições) em vez de uma paginada, mas evita centenas de requisições subsequentes e torna a busca instantânea. Como a lista de países muda muito pouco, o custo de buscar tudo de uma vez é baixo.

### Cache: solução manual via localStorage, com TTL

Optei por um cache manual simples (`utils/localCache.ts`) em vez de React Query/SWR:

- **A favor:** zero dependência nova, fácil de explicar e depurar (é só `localStorage` com timestamp + TTL), e resolve exatamente o problema descrito no desafio (dados que raramente mudam).
- **Contra:** não tenho refetch em background, invalidação por foco de janela, nem deduplicação automática de requisições concorrentes — coisas que React Query dá de graça. Para um app deste tamanho, com poucos endpoints e sem mutações, o ganho de uma lib dedicada não pareceu justificar a complexidade extra.

A listagem fica em cache por 12h; cada país individual, por 24h (mudam ainda menos). Os países fronteiriços na página de detalhes são resolvidos a partir da lista já cacheada, sem nenhuma requisição extra.

### Tipagem

Todos os tipos em `types/country.ts` espelham o shape real da v5 (campos aninhados como `names.common`, `codes.alpha_3`, `flag.emoji`), sem nenhum uso de `any`. `CountrySummary` (campos leves, para os cards) e `CountryDetail` (registro completo) são tipos separados porque a API também retorna subconjuntos diferentes via `response_fields`.

### Temas

Persistidos em `localStorage` (preferência escolhida, não o tema resolvido) via `ThemeContext`. Um pequeno script inline no `index.html` aplica o tema antes do React montar, evitando flash de tema errado no recarregamento. O modo "sistema" também escuta mudanças ao vivo em `prefers-color-scheme`.

### Estados de interface

Loading, erro e vazio são componentes dedicados (`common/`) reaproveitados tanto na listagem quanto no detalhe, com mensagens amigáveis mapeadas a partir do status HTTP (401 → chave inválida, 403 → cota/plano, 429 → rate limit, etc.) em `httpClient.ts`.

## Bônus implementados

- **i18n:** inglês (padrão) e português, alternáveis pelo header. Nomes de país em português usam `names.translations.por.common` quando disponível; o resto da interface é traduzido manualmente via `react-i18next`.
- **Cache:** ver seção acima.

## Deploy

Não realizado nesta entrega. Para publicar (ex.: Vercel), basta configurar a variável de ambiente `VITE_RESTCOUNTRIES_API_KEY` no painel do provedor e apontar o build command para `npm run build` / output `dist`.
