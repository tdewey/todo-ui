# Todo UI

A production-quality todo app built with React 19, MUI v5, and React Query.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | TypeScript |
| Framework | React 19 |
| Build | Vite |
| UI Library | MUI v5 (`@mui/material`) |
| Routing | `react-router-dom` v5 |
| Server State | `@tanstack/react-query` v5 |
| Tests | Jest + React Testing Library |

## Prerequisites

- Node 18+
- The [todo-api](https://github.com/tdewey-raven/todo-api) backend running on port 5243

## Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd todo-ui

# 2. Configure environment
cp .env.example .env          # VITE_API_URL is pre-set to http://localhost:5243

# 3. Install dependencies
npm install

# 4. Start the dev server
npm start                     # → http://localhost:5173
```

> **Note:** The backend must allow CORS from `http://localhost:5173`. See the todo-api README for setup steps.

## Running Tests

```bash
npm test              # all tests + coverage report
npm run test:watch    # watch mode during development
```

## Project Structure

```
src/
  components/     # UI components — one directory per component
    Context/      # DataContext: filter, dark mode, snackbar state
    ConfirmDialog/
    Layout/
    TodoAddInput/
    TodoFilters/
    TodoItem/
    TodoList/
  hooks/          # React Query data hooks (useTodos, useCreateTodo, …)
  pages/          # Page-level components (TodoPage)
  services/       # API call functions — all fetch calls live here
  types/          # Shared TypeScript interfaces
  enums/          # Shared constants (TodoFilter)
```

Each component directory follows a consistent structure:

```
ComponentName/
  ComponentName.tsx           # Presentational component
  ComponentName.handlers.ts   # useHandlers() hook — event logic only
  ComponentName.scss          # Component-scoped styles
  ComponentName.test.tsx      # Co-located tests
  index.ts                    # Re-export barrel
```

## Architecture Decisions

**React Query for server state** — caching, background refresh, and loading/error states are handled automatically. Mutations invalidate the `['todos']` cache key so the list stays fresh without manual state synchronisation.

**Native fetch over axios** — the backend contract is straightforward REST with JSON; fetch is sufficient and avoids an unnecessary dependency.

**Context API for UI state** — the active filter (All / Active / Completed), dark mode, and snackbar notifications are cross-cutting UI concerns. A single `DataContext` covers all three cleanly; Redux would be overkill for this scope.

**Thin components with `useHandlers()`** — event handler logic lives in companion `.handlers.ts` files, keeping components purely presentational and both sides independently testable.

**Dark mode persisted in `localStorage`** — the user's preference survives page refreshes without requiring a backend or auth.

## Features

- Create, edit (inline double-click or pencil icon), and delete tasks
- Mark tasks complete / reopen them via checkbox
- Filter by All / Active / Completed
- "Clear X completed" with confirmation dialog
- Dark mode toggle — preference persisted in `localStorage`
- Toast notifications on all mutations and errors
- Loading skeletons, error state with retry, and empty states

## Assumptions & Trade-offs

- **No auth** — the assessment spec didn't require it; a production app would add JWT + a login page
- **No description field** — removed from the data model by design; title is sufficient for task management
- **PATCH `/complete` marks done only** — unchecking calls `PUT` with `isCompleted: false` (no "uncomplete" endpoint by design)
- **"Clear completed" calls `DELETE` per item** — no bulk endpoint on the backend; `Promise.all` keeps it clean
- **No pagination** — fetches all todos; cursor-based pagination would be added in production

## What I'd Add With More Time

- Optimistic updates on toggle for instant feedback (currently invalidates and refetches)
- Due dates — both a backend schema change and a frontend date picker
- Drag-and-drop reordering
- End-to-end tests with Playwright
- CI/CD pipeline (GitHub Actions: lint → test → build on every PR)
