# TaskFlow — Frontend

React 19 + TypeScript + Tailwind CSS client for the TaskFlow Task Management Application.

## Tech Stack

| Tool | Version |
|---|---|
| React | 19 |
| React Router | v7 |
| TypeScript | 5 |
| Tailwind CSS | 3 |
| Axios | 1 |
| React Hot Toast | 2 |

## Prerequisites

- Node.js 18+
- Yarn

## Setup

```bash
# Install dependencies
yarn install

# Copy and configure environment
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:5000/api for local dev
```

## Scripts

| Command | Description |
|---|---|
| `yarn start` | Dev server at http://localhost:3000 |
| `yarn build` | Production build to `build/` |
| `yarn test` | Run tests (Jest + Testing Library) |
| `yarn lint` | ESLint |
| `yarn typecheck` | TypeScript compiler check (no emit) |

## Folder Structure

```
src/
├── api/          # Axios instance + typed API call modules (auth, tasks, dashboard)
├── components/
│   ├── common/   # Button, Input, Modal, Pagination, Spinner
│   ├── dashboard/# PieChart, DonutChart
│   ├── layout/   # AppLayout, Navbar, Sidebar, ProtectedRoute
│   └── tasks/    # TaskCard, TaskFilter, TaskForm, TaskList
├── context/      # AuthContext (JWT + user state), ThemeContext (dark mode)
├── hooks/        # useTasks (fetch, add, edit, remove, toggle)
├── pages/        # Login, Signup, Dashboard, MyTasks, HighPriorityTasks, OverdueTasks, Settings
├── types/        # Shared TypeScript interfaces (User, Task, ApiResponse, etc.)
└── utils/        # Form validators
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `REACT_APP_API_URL` | `http://localhost:5000/api` | Backend API base URL |

## Dark Mode

Theme is toggled via the Navbar and persists to `localStorage`. Falls back to the OS `prefers-color-scheme` if no preference is saved.

## Auth Flow

1. On login/register the JWT is stored in `localStorage`.
2. The Axios instance injects `Authorization: Bearer <token>` on every request.
3. A 401 response from the API automatically clears the token and redirects to `/login`.
4. `ProtectedRoute` redirects unauthenticated users away from all app pages.
