# todo-ui

A React + TypeScript frontend application built with Vite.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Language | TypeScript (non-strict mode) |
| Framework | React 19 |
| Build | Vite |
| UI Library | MUI v5 (`@mui/material`) + `@mui/styles` (`makeStyles`) |
| Routing | `react-router-dom` v5 |
| Server State | `@tanstack/react-query` v5 |
| Styles | `makeStyles` (JSS) — SCSS files are kept but intentionally empty |
| Tests | Jest + React Testing Library |

## Development Commands

```bash
# Dev server (HMR)
npm start

# Production build
npm run build

# Run all tests
npm test

# Run a single test file
npm test -- --testPathPattern="ComponentName"

# Watch mode
npm run test:watch

# Type check only
npm run typecheck

# Lint
npm run lint
```

## Project Structure

```
src/
  components/     # React components (one directory per component)
  constants/      # Shared constants (QueryKeys)
  hooks/          # React Query data hooks (useTodos, useCreateTodo, …)
  pages/          # Page-level components (TodoPage)
  services/       # API call functions — all fetch() calls live here
  types/          # Shared TypeScript interfaces + module augmentations
  enums/          # Shared enums (TodoFilter)
```

## Architecture Principles

- **Components are thin orchestrators** — no inline business logic
- **Handler logic** extracted into `useHandlers()` custom hooks in `.handlers.ts` files
- **API calls** go through `services/` — never `fetch()` directly in components
- **Data transformation** lives in `helpers/`, not components
- **Global state** via React Context API (`DataContext`) — covers filter, dark mode, and snackbar
- **`makeStyles`** always defined at the bottom of the component file; `const styles = useStyles()` at the top of the component body

## Styling Conventions

All styles use `makeStyles` from `@mui/styles` (JSS). Do **not** use MUI's `sx` prop.

```ts
// ✅ Correct
const useStyles = makeStyles(theme => ({
  root: { padding: theme.spacing(2) },
}));

function MyComponent() {
  const styles = useStyles();
  return <div className={styles.root} />;
}

// ❌ Incorrect — do not use sx
<Box sx={{ p: 2 }} />
```

**Why both ThemeProviders?** MUI v5 uses emotion (`@mui/material/styles`) and legacy JSS (`@mui/styles`) in separate React contexts. Both must be provided with the same theme object, and `StyledEngineProvider injectFirst` must wrap both so JSS styles take precedence over emotion:

```tsx
<StyledEngineProvider injectFirst>
  <ThemeProvider theme={theme}>           {/* emotion */}
    <StylesThemeProvider theme={theme}>  {/* JSS */}
      <App />
    </StylesThemeProvider>
  </ThemeProvider>
</StyledEngineProvider>
```

**Theme types in makeStyles** — `@mui/styles`'s `DefaultTheme` is empty by default. `src/types/mui-styles.d.ts` augments it to extend MUI's `Theme` so `theme.palette`, `theme.spacing`, etc. are typed inside `makeStyles` callbacks.

## Component Conventions

Each component directory contains:

| File | Purpose |
|------|---------|
| `ComponentName.tsx` | Main component |
| `ComponentName.handlers.ts` | Event handler logic (`useHandlers` hook) |
| `ComponentName.scss` | Component-scoped styles (intentionally empty — styles live in `makeStyles`) |
| `ComponentName.test.tsx` | Co-located tests |
| `index.ts` | Re-export barrel |

## Path Imports

Use the `~` alias for `src/` (configured via `vite-tsconfig-paths` and `tsconfig.app.json`):

```ts
import { DataContext } from '~/components/Context';
import type { Todo } from '~/types';
import { QueryKeys } from '~/constants';
```

## Testing

- Tests are colocated with components: `ComponentName.test.tsx`
- Wrap tests with both `ThemeProvider` (material) and `StylesThemeProvider` (`@mui/styles`) + `MemoryRouter`
- Mock `globalThis.fetch` (not `global.fetch`) — works across CommonJS and ESM environments
- Use a separate `tsconfig.jest.json` (`module: CommonJS`, `moduleResolution: node`) for Jest compatibility with Vite's `bundler` module resolution
- `src/__mocks__/config.ts` stubs `import.meta.env` for Jest (cannot use `import.meta` in CommonJS)
- Test through the user's perspective — avoid testing implementation details

## Dark Mode

Dark mode preference is persisted in `localStorage` under the key `colorMode`. The initial value is read synchronously in the `useState` initialiser so there is no flash on load.
