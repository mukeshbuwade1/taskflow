# TaskFlow — Task Management Application

A production-ready full-stack Task Management Web Application built with React.js, Node.js, Express, and MongoDB Atlas.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, React Router v7, Tailwind CSS v3, Axios, Context API |
| Backend | Node.js 24, Express 5, Mongoose 9, JWT, bcryptjs |
| Database | MongoDB Atlas (cloud) |
| Security | helmet, express-rate-limit, express-validator, CORS |
| API Docs | Swagger UI (swagger-jsdoc + swagger-ui-express) |
| DevOps | Docker, Docker Compose, concurrently |

---

## Features

**Core:**
- User registration & login with JWT authentication
- Create, read, update, and delete tasks
- Toggle task status (Pending ↔ Completed)
- Filter tasks: All / Pending / Completed
- Server-side pagination and keyword search
- Fully responsive UI (desktop + mobile)

**Bonus:**
- Dark mode (system preference + manual toggle, persisted)
- Swagger API documentation at `/api-docs`
- Docker + Docker Compose setup
- Rate limiting, helmet security headers, input validation

---

## Folder Structure

```
task-management-app/
├── client/                  # React frontend
│   ├── src/
│   │   ├── api/             # Axios instance + API call modules
│   │   ├── components/      # common/, layout/, tasks/
│   │   ├── context/         # AuthContext, ThemeContext
│   │   ├── hooks/           # useTasks
│   │   ├── pages/           # Login, Signup, Dashboard
│   │   └── utils/           # validators
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── server/                  # Node.js + Express backend
│   ├── src/
│   │   ├── config/          # db.js, swagger.js
│   │   ├── controllers/     # auth, task
│   │   ├── middleware/      # auth, error, validate
│   │   ├── models/          # User, Task
│   │   ├── routes/          # auth, task routes
│   │   └── utils/           # apiResponse
│   ├── server.js
│   └── Dockerfile
│
├── docker-compose.yml
└── package.json             # root scripts with concurrently
```

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- Yarn (client) / npm (server)
- MongoDB Atlas account (free tier)

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd task-management-app
npm run install:all
```

### 2. Configure the backend environment

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskdb?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

> **MongoDB Atlas setup:** Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com), add a database user, whitelist `0.0.0.0/0` (for dev), and copy the connection string.

### 3. Start both servers

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Swagger Docs: http://localhost:5000/api-docs

### 4. Seed the admin account

Admin accounts cannot be created through the signup page. Run the seed script once after the server is configured:

```bash
cd server
npm run seed:admin
```

This creates:

| Field    | Value           |
|----------|-----------------|
| Name     | Admin           |
| Email    | admin@gmail.com |
| Password | 123456          |
| Role     | admin           |

Safe to re-run — it skips creation if the email already exists.

**Alternative — Postman / Swagger:**

`POST /api/auth/register` does not accept a `role` field (all web registrations are `user`).
To promote an existing user to admin, insert directly in MongoDB Atlas:

```js
// MongoDB Shell / Atlas Data Explorer
db.users.updateOne(
  { email: "admin@gmail.com" },
  { $set: { role: "admin" } }
)
```

---

## Docker Setup

```bash
# Copy and fill in the env file first
cp server/.env.example server/.env
# (edit MONGO_URI, JWT_SECRET in server/.env)

docker-compose up --build
```

- App: http://localhost
- API: http://localhost:5000/api
- Swagger: http://localhost:5000/api-docs

---

## API Reference

All task endpoints require `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login → returns JWT |
| GET | /api/auth/me | Yes | Get current user |
| PUT | /api/auth/profile | Yes | Update display name |
| PUT | /api/auth/password | Yes | Change password |

### Tasks

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/tasks | Yes | List tasks (filter, search, paginate) |
| POST | /api/tasks | Yes | Create task |
| GET | /api/tasks/:id | Yes | Get single task |
| PUT | /api/tasks/:id | Yes | Update task |
| PATCH | /api/tasks/:id/toggle | Yes | Toggle pending/completed |
| DELETE | /api/tasks/:id | Yes | Delete task |

### Dashboard

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/dashboard | Yes | Stats, charts data, today/overdue/high-priority task previews |

### Other

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/health | No | Health check |
| GET | /api-docs | No | Swagger UI (OpenAPI 3.0) |

**GET /api/tasks query parameters:**

| Param | Type | Default | Description |
|---|---|---|---|
| status | string | all | `all`, `pending`, `completed` |
| search | string | — | Search in title & description |
| page | number | 1 | Page number |
| limit | number | 10 | Items per page (max 50) |
| sortBy | string | createdAt | `createdAt`, `dueDate`, `priority`, `title` |
| order | string | desc | `asc` or `desc` |

**Response envelope:**
```json
{
  "success": true,
  "message": "Tasks fetched",
  "data": [...],
  "pagination": { "total": 25, "page": 1, "limit": 10, "totalPages": 3 }
}
```

---

## Deployment

### Backend (Render / Railway)
1. Connect your GitHub repo
2. Set root directory to `server`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables (same as `.env`)

### Frontend (Vercel / Netlify)
1. Set root directory to `client`
2. Build command: `yarn build`
3. Output directory: `build`
4. Add env var: `REACT_APP_API_URL=https://your-backend-url.onrender.com/api`

---

## Assumptions

- Each task belongs to exactly one user — users only see their own tasks
- JWT tokens expire after 7 days; the frontend auto-redirects to login on 401
- MongoDB Atlas free tier (M0) is used; connection string must be provided via env
- Dark mode preference persists via `localStorage` and falls back to OS preference
- `dueDate` is optional; if provided it must be a valid ISO date
