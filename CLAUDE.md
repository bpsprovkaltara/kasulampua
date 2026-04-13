# Kasulampua — AI assistant context

This file helps Claude and other assistants work effectively in this repository.

## Project identity

**Kasulampua** is a Vue 3 single-page application: a regional data portal for **KASULAMPUA** (Kalimantan, Sulawesi, Maluku, Papua) economic and open data exploration.

- Private project, early stage (`package.json` version `0.0.0`).
- Broader product documentation (Indonesian): see `DOKUMENTASI_APLIKASI.md`.

## Tech stack

| Area | Choice |
|------|--------|
| UI | Vue 3, Vue Router 4 |
| Build | Vite 6, `@vitejs/plugin-vue`, Vue DevTools plugin |
| Styling | Bootstrap 5, Bootstrap Icons, `lucide-vue-next`, global CSS in `src/assets/css/main.css` |
| Charts | Chart.js + `chartjs-plugin-zoom` |
| Maps | Leaflet |
| Spreadsheets | `xlsx`, `file-saver` |
| Forms | `@vueform/multiselect` |
| State | **No Pinia/Vuex** — shared state via composables (`src/composables/`) |

## Development commands

Use **pnpm** (version pinned in `package.json` → `packageManager`).

```bash
pnpm dev      # Vite dev server
pnpm build    # production build
pnpm preview  # preview production build
pnpm lint     # ESLint with --fix
pnpm format   # Prettier --write src/
```

## Code conventions

- **Prettier** (`.prettierrc.json`): no semicolons, single quotes, `printWidth` 100.
- **Editor** (`.editorconfig`): 2 spaces, LF, max line length 100 for JS/Vue/CSS.
- **ESLint** (`eslint.config.js`): flat config, `eslint-plugin-vue` essential, Prettier integration.
- **Components**: PascalCase `.vue` files; layout pieces often suffixed `Section` (e.g. `NavSection`, `FooterSection`).
- **Composables**: `useSomething.js` in `src/composables/`, export functions returning reactive state + methods.
- **Utils**: plain functions/constants; domain-prefixed names (`ckan*`, `jsonDataset*`, `kasulampua*`).
- **Imports**: `@/` → `src/` (see `jsconfig.json`); relative `../` imports are also common.

## Architecture

```
src/main.js          → createApp, router, Bootstrap + global CSS
src/App.vue          → <router-view /> + <ToastNotification />
src/router/index.js  → routes, meta.title, document.title suffix
src/config/api.js    → endpoint builders (see below)
```

- **Routing**: `createWebHistory(import.meta.env.BASE_URL)`. Each route may set `meta.title`; `router.afterEach` sets `document.title` to `{meta.title} - Konsultasi Regional PDRB Kasulampua` (or default title).
- **Scroll**: `scrollBehavior` returns `savedPosition` or `{ top: 0 }`.

### API configuration (`src/config/api.js`)

All URLs are driven by `import.meta.env` (Vite `VITE_*` variables). Main exports:

- **`API_ENDPOINTS`** — custom backend (berita, insight, setelan, dataset APIs, uploads).
- **`DATAHUB_ENDPOINTS`** — datahub middleware (CKAN wrappers, analytics, resource helpers).
- **`CKAN_ACTION_API`** — direct CKAN Action API paths (`group_list`, `organization_list`, `package_search`, `package_show`, `resource_show`, `datastore_search`).
- **`CKAN_FILE_BASE_URL`** — base for CKAN file URLs.
- **`MATOMO_ENDPOINT`** — analytics base (Matomo integration in `main.js` is currently commented out).

### Three API layers (mental model)

1. **Custom API** (`VITE_API_BASE_URL`) — CRUD for news, insights, settings, datasets as implemented in the backend.
2. **Datahub** (`VITE_DATAHUB_BASE_URL`) — CKAN-related operations and analytics proxied or aggregated server-side.
3. **CKAN Action API** (`VITE_CKAN_BASE_URL`) — direct calls to CKAN’s `/api/3/action` style endpoints.

### Shared state (composables)

| Module | Role |
|--------|------|
| `useDatasetStore.js` | CKAN groups/orgs + wilayah mapping; async `fetchAllData` |
| `useMeta.js` | Document title and social meta updates |
| `useToast.js` | Global toast queue (used with `ToastNotification.vue`) |
| `useNavigation.js` | Nav scroll state + CKAN URL from settings API |

## Vite dev proxy (`vite.config.js`)

In development, the dev server proxies:

- `/api`, `/uploads` → backend host (see `vite.config.js` `server.proxy`).
- `/ckan-api` → CKAN host, path rewritten to `/api/3/action`.
- `/ckan-file` → CKAN host for file URLs.

Align `.env.development` with these paths when running locally.

## Environment variables

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | Custom backend base URL |
| `VITE_DATAHUB_BASE_URL` | Datahub base URL |
| `VITE_CKAN_BASE_URL` | CKAN Action API base |
| `VITE_CKAN_FILE_BASE_URL` | CKAN file download base |
| `VITE_MATOMO_URL` | Matomo tracker URL |
| `VITE_MATOMO_AUTH` | Matomo auth token (treat as sensitive in real deployments) |

## Directory map

| Path | Contents |
|------|----------|
| `src/components/` | Reusable Vue SFCs (dataset cards, maps, tables, JSON dataset UI, layout) |
| `src/views/` | Route-level pages |
| `src/composables/` | `use*` shared logic and singleton-style stores |
| `src/utils/` | Parsing, charts, dates, regions, dummy data |
| `src/config/` | `api.js` endpoint configuration |
| `src/assets/` | Images, `css/main.css` |
| `public/` | Static assets, `config.js`, icons |

## Important patterns

- **JSON datasets (CKAN resources)**: fetch/parse → `src/utils/parseCkanResourceJson.js` → column helpers in `jsonDatasetColumns.js` → UI in `JsonDatasetInsightPanel.vue`, `JsonDatasetTableCard.vue`, `JsonDatasetChartCard.vue`; chart data shaping in `jsonDatasetChart.js`.
- **Excel export**: `xlsx` + `file-saver` in several components (e.g. dynamic tables, JSON export).
- **Maps**: Leaflet + helpers in `kasulampuaProvinces.js` (regions, GeoJSON URLs, name normalization).
- **Fallback data**: `dummyBerita.js`, `dummyInsights.js` when API data is unavailable.
- **Locale**: user-facing dates often use `id-ID`; UI copy is primarily **Bahasa Indonesia**.

## Language

- User-visible strings and long-form docs are mostly Indonesian.
- Code names, comments, and git messages may mix Indonesian and English — follow existing files when in doubt.

## When changing behavior

- Add or adjust endpoints in `src/config/api.js` and corresponding `.env*` keys.
- New routes: `src/router/index.js` + `meta.title` for consistent `document.title`.
- Shared cross-page state: prefer a composable in `src/composables/` before adding a global store library.

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"` to keep the graph current
