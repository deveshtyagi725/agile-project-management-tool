# Agile Project Management Tool

A full-stack project management application built with React and Node.js. It models work as a three-level hierarchy — **Project → User Story → Task** — and provides a clean REST API, JWT-protected routes, list and Kanban views, and a background daily reporting job.

---

## Project Overview

The application gives a small team a lightweight agile workflow without the overhead of enterprise tools. Users register, log in, and immediately start organizing work into projects, breaking those projects into user stories, and tracking granular tasks through a `Todo → In Progress → Done` status pipeline.

**Key features:**

- User registration and JWT-authenticated login
- Full CRUD for projects, user stories, and tasks
- Kanban board with drag-and-drop task management (dnd-kit)
- List view with status and priority filtering
- Task assignment (text field) and due date tracking
- Priority levels: `Low`, `Medium`, `High`
- Dark mode and responsive layout
- Daily background report job with retry logic
- Interactive Swagger API documentation at `/api-docs`

---

## Tech Stack

**Frontend**

| Library | Purpose |
|---|---|
| React 18 + Vite | UI framework and dev server |
| React Router v6 | Client-side routing |
| Tailwind CSS | Utility-first styling |
| Axios | HTTP client |
| dnd-kit | Kanban drag and drop |
| Framer Motion | Animations |
| Lucide React | Icon set |

**Backend**

| Library | Purpose |
|---|---|
| Node.js + Express | HTTP server and routing |
| Prisma ORM | Database access and migrations |
| SQLite | Embedded relational database |
| jsonwebtoken | JWT generation and verification |
| bcryptjs | Password hashing |
| Joi | Request body validation |
| Helmet | HTTP security headers |
| express-rate-limit | API rate limiting |
| Winston + Morgan | Structured logging |
| node-cron | Scheduled background jobs |
| Swagger / OpenAPI | Auto-generated API docs |

---

## Architecture

### Data Hierarchy

Work is modelled as a strict three-level tree:

```
Project
└── UserStory  (belongs to one Project)
    └── Task   (belongs to one UserStory)
```

Cascade deletes are enforced at the database level: deleting a project removes all its user stories, and deleting a user story removes all its tasks.

### Folder Structure

```
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema and migrations
│   └── src/
│       ├── controllers/           # Request handlers (auth, project, story, task)
│       ├── jobs/
│       │   └── dailyReport.js     # Scheduled background report job
│       ├── middlewares/           # Auth, error handler, rate limiter, sanitizer
│       ├── routes/                # Express route definitions
│       └── utils/                 # Prisma client, Winston logger, validators
│
└── frontend/
    └── src/
        ├── components/            # Shared UI (Kanban, modals, forms, badges)
        ├── context/               # App-level React context
        ├── hooks/                 # Custom hooks
        ├── pages/                 # Route-level pages (Dashboard, ProjectDetails, Login, Register)
        └── services/
            └── api.js             # Centralized Axios client with auth headers and 401 handling
```

The frontend is a Vite single-page app. All HTTP calls go through `api.js`, which attaches the JWT bearer token and redirects to login on a 401 response. The backend is a resource-oriented Express API where every protected route passes through `authMiddleware` before reaching a controller.

---

## API Documentation

Interactive Swagger docs are served at:

```
GET http://localhost:3000/api-docs
```

All project, story, and task endpoints require a `Bearer <token>` header.

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive a JWT |
| `GET` | `/auth/me` | Get the authenticated user's profile |

### Projects

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/projects` | Create a project |
| `GET` | `/projects` | List all projects |
| `GET` | `/projects/:id` | Get a project with nested stories and tasks |
| `GET` | `/projects/:id/stories` | Get paginated stories for a project |
| `PATCH` / `PUT` | `/projects/:id` | Update a project |
| `DELETE` | `/projects/:id` | Delete a project (cascades to stories and tasks) |

### User Stories

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/user-stories` | Create a user story (requires `projectId`) |
| `GET` | `/user-stories?projectId=:id` | List stories for a project |
| `GET` | `/stories/:id/tasks` | Get paginated tasks for a story |
| `PATCH` / `PUT` | `/user-stories/:id` | Update a user story |
| `DELETE` | `/user-stories/:id` | Delete a story (cascades to tasks) |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/tasks` | Create a task (requires `userStoryId`) |
| `GET` | `/tasks?storyId=:id` | List tasks for a user story |
| `PATCH` / `PUT` | `/tasks/:id` | Update a task (status, priority, assignee, due date) |
| `DELETE` | `/tasks/:id` | Delete a task |

List endpoints support `page`, `limit`, `status`, `priority`, `sort`, and `sortOrder` query parameters.

---

## Database Schema

The database is SQLite managed through Prisma. The schema defines four models:

**`users`**
Stores authenticated users. Email is unique. Passwords are stored as bcrypt hashes.

**`projects`**
Top-level container for work. Has a name and optional description.

**`user_stories`**
Belongs to a project via `projectId`. Has `status` (`Todo`, `In Progress`, `Done`) and `priority` (`Low`, `Medium`, `High`). Indexed on `projectId`.

**`tasks`**
Belongs to a user story via `userStoryId`. Adds `assignedTo` (text) and `dueDate` on top of the same status and priority fields as stories. Indexed on `userStoryId`.

**Relationships and cascade behavior:**

```
User        (no ownership relation to projects — shared workspace)
Project     1 ──< UserStory   (onDelete: Cascade)
UserStory   1 ──< Task        (onDelete: Cascade)
```

---

## Async Workflow

### Daily Report Job

`backend/src/jobs/dailyReport.js` registers a `node-cron` job that fires at midnight every day (`0 0 * * *`). It queries:

- Tasks with `status = Done` and `updatedAt` within the previous calendar day (yesterday's delta)
- Aggregated task counts grouped by `status` across all tasks
- Aggregated `Done` task counts grouped by `priority` (using `groupBy` — no full-row fetch)

The result is written to the application logger as a structured info entry.

### Retry Logic and Failure Handling

The report generation function is wrapped in a `runWithRetry` helper:

```
MAX_RETRIES = 3
Retry delay = attempt × 1000 ms  →  1 s, 2 s, 3 s  (linear backoff)
```

On each failure the helper logs a `warn` entry with the attempt number and error message, then waits before the next attempt. If all three attempts fail, the final error is caught by the cron callback, logged as an `error`, and the API server continues running unaffected. No external queue or broker is involved — the retry loop is a plain `for` loop.

---

## Security Considerations

| Concern | Implementation |
|---|---|
| Password storage | bcrypt hashing via `bcryptjs` |
| Authentication | JWT bearer tokens, verified on every protected request |
| Authorization | `authMiddleware` guards all project, story, and task routes |
| Input validation | Joi schemas validate request bodies before they reach controllers |
| SQL injection | Prisma's parameterized query builder — no raw SQL |
| HTTP hardening | Helmet sets secure response headers |
| Rate limiting | 100 requests per IP per 15-minute window via `express-rate-limit` |
| Input sanitization | Sanitize middleware strips unexpected fields before validation |

**Known tradeoffs:**
- Projects are shared across all authenticated users. A production system would add workspace membership and per-project authorization checks.
- There is no refresh-token rotation. The JWT is long-lived and must be replaced with a short-lived access token + refresh token pair before production use.
- The JWT secret falls back to a hardcoded string if `JWT_SECRET` is not set in the environment. This must be overridden with a strong secret in any deployed environment.

---

## Design Decisions & Tradeoffs

**Why Prisma?**
Prisma provides a typed query builder, a declarative schema, and a migration system in one package. For a project of this scope it eliminates hand-written SQL while keeping the schema readable and the migration history auditable.

**Why SQLite?**
Zero-configuration setup makes the project immediately runnable for local review. The Prisma datasource can be switched to PostgreSQL by changing one line in `schema.prisma` and updating `DATABASE_URL`.

**Why a central API client (`api.js`)?**
Centralizing Axios configuration means auth headers and 401 redirect logic live in one place. Every page and component gets consistent error handling without repeating interceptor setup.

**Why text-field assignment instead of a user relation on tasks?**
Keeping assignment as a free-text field avoids building a full team/membership model, which is outside the scope of the core hierarchy requirement. It is the correct tradeoff for a focused MVP.

**Why log reports instead of persisting them?**
Adding a `reports` table and exposing a reports API would be straightforward, but it adds schema, migration, controller, and route surface area that is not required. Logging keeps the async workflow demonstrable without scope creep.

**Simplicity vs. scalability:**
Every decision favors local clarity over distributed complexity. SQLite, in-process retry loops, and a single Express process are appropriate for the current scale. The architecture does not prevent a future migration to PostgreSQL, a job queue (BullMQ), or a microservice split — it just does not pay that cost prematurely.

---

## AI Usage

AI tooling (Amazon Q Developer) was used during development as a pair-programming assistant, not as a code generator. Specific uses:

- Drafting boilerplate for repetitive controller patterns (CRUD handlers) and refining them manually to match the project's validation and error-handling conventions
- Reviewing the `runWithRetry` logic for edge cases (e.g. skipping the delay after the final attempt)
- Generating the initial Swagger JSDoc comment blocks, which were then corrected against the actual route signatures
- Producing the first draft of this README, which was reviewed and edited for accuracy against the real codebase

All generated output was read, understood, and verified before being committed. No code was accepted without understanding what it does and why.

---

## Future Improvements

- **Teams and workspaces** — per-project membership and role-based access control (owner, editor, viewer)
- **Refresh token rotation** — short-lived access tokens with a secure refresh flow
- **Persisted reports** — store daily report output in a `reports` table and expose it in the UI
- **Real-time updates** — WebSocket or Server-Sent Events so the Kanban board reflects changes from other users without a page refresh
- **Notifications** — in-app or email alerts for due date reminders and status changes
- **Search and filtering** — full-text search across projects, stories, and tasks
- **Audit history** — immutable log of status transitions per task
- **Test coverage** — unit tests for controllers and auth middleware, integration tests for key API flows
- **CI pipeline** — lint, build, and migration checks on every pull request
- **Docker Compose** — single-command local startup for the full stack

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm 9+

### Backend

```bash
cd backend
npm install
npm run db:migrate   # runs Prisma migrations and creates dev.db
npm run dev          # starts the server with --watch on port 3000
```

Create `backend/.env` if it does not exist:

```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET=your-strong-secret-here
PORT=3000
```

Optional seed data:

```bash
npm run db:seed
```

### Frontend

```bash
cd frontend
npm install
npm run dev          # starts Vite dev server on port 5173
```

If the backend runs on a port other than 3000, create `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:3000
```

### Default URLs

| Service | URL |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:3000` |
| Swagger docs | `http://localhost:3000/api-docs` |
| Health check | `http://localhost:3000/health` |

### Verify the build

```bash
# Frontend production build
cd frontend && npm run build

# Backend — generates Prisma client and deploys migrations
cd backend && npm run build
```

### Quick smoke test

1. Register a user at `POST /auth/register`
2. Log in at `POST /auth/login` and copy the returned token
3. Create a project, add user stories, add tasks
4. Move tasks between `Todo`, `In Progress`, and `Done` on the Kanban board
5. Confirm that requests without a `Bearer` token receive a `401` response
