# todo-ui

A React + TypeScript frontend application built with Vite.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Language | TypeScript (non-strict mode) |
| Framework | React 19 |
| Build | Vite |
| UI Library | MUI v5 (`@mui/material`) + `@mui/styles` (`makeStyles`) |
| Routing | `react-router-dom` v5 + `react-router-config` |
| Styles | SCSS per component |
| Tests | Jest + React Testing Library |

## Development Commands

```bash
# Dev server (HMR)
npm run dev

# Production build
npm run build

# Run all tests
npm test

# Run a single test file
npm test -- --testPathPattern="ComponentName"

# Type check only
npx tsc --noEmit

# Lint
npm run lint
```

## Project Structure

```
src/
  components/     # React components (one directory per component)
  hooks/          # Shared custom hooks
  services/       # API call wrappers
  helpers/        # Data transformation utilities
  types/          # Shared TypeScript interfaces
  enums/          # Shared constants and enums
```

## Architecture Principles

- **Components are thin orchestrators** — no inline business logic
- **Handler logic** extracted into `useHandlers()` custom hooks in `.handlers.ts` files
- **API calls** go through `services/` — never `fetch()` directly in components
- **Data transformation** lives in `helpers/`, not components
- **Global state** via React Context API — no prop-drilling past 2 levels
- **`makeStyles`** always defined at the bottom of the component file

## Component Conventions

Each component directory contains:

| File | Purpose |
|------|---------|
| `ComponentName.tsx` | Main component |
| `ComponentName.handlers.ts` | Event handler logic (`useHandlers` hook) |
| `ComponentName.scss` | Component-scoped styles |
| `index.ts` | Re-export barrel |

## Testing

- Tests are colocated with components: `ComponentName.test.tsx`
- Wrap tests with `ThemeProvider` + `MemoryRouter` for MUI and react-router
- Test through the user's perspective — avoid testing implementation details

## Path Imports

`src/` is the base URL (configured via `vite-tsconfig-paths`). Use bare path imports:

```ts
import { DataContext } from 'components/Context';
import { TodoItem } from 'types';
```
