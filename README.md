# Sinew — track effort, build strength

A full-stack fitness tracker: sign up, log walks (steps), water, and sleep, and watch a
weekly dashboard fill in. Built for the Full Stack Developer intern task ("Fitness Tracking
Web App") with the requested stack: **React + Node/Express + PostgreSQL**.

## What's included

- **Auth** — email/password sign-up and login, JWT-based sessions, bcrypt password hashing
- **3 data types** — walk (steps), water (ml), sleep (hours)
- **Dashboard** — today's totals against daily goals, a 7-day bar chart per metric, and a
  recent-entries list with delete
- **Dark, fitness-themed UI** — "Sinew" branding, ember/teal accent palette, Bebas Neue +
  Inter type

```
sinew/
  backend/     Express API + PostgreSQL (Node)
  frontend/    React app (Vite)
```

## 1. Set up the database

Create a Postgres database (locally, or a free instance on Render/Supabase/Railway/Neon),
then apply the schema:

```bash
cd backend
cp .env.example .env
# edit .env: set DATABASE_URL and a random JWT_SECRET
npm install
npm run migrate   # creates the users and logs tables
```

## 2. Run the backend

```bash
cd backend
npm run dev        # http://localhost:4000
```

## 3. Run the frontend

```bash
cd frontend
cp .env.example .env   # VITE_API_URL, defaults to http://localhost:4000/api
npm install
npm run dev         # http://localhost:5173
```

Vite's dev server proxies `/api` to `http://localhost:4000` automatically, so the two
`.env` files only really matter once you deploy.

## API overview

| Method | Route                     | Description                          |
|--------|---------------------------|---------------------------------------|
| POST   | `/api/auth/signup`        | Create account, returns JWT           |
| POST   | `/api/auth/login`         | Log in, returns JWT                   |
| GET    | `/api/auth/me`            | Current user (requires `Authorization: Bearer <token>`) |
| POST   | `/api/logs`                | Create an entry `{ type, value, logged_at? }` |
| GET    | `/api/logs?type=&days=`    | List recent entries                   |
| DELETE | `/api/logs/:id`            | Delete an entry                       |
| GET    | `/api/logs/summary/weekly?days=7` | Daily totals per type, for the chart |

## Deploying (matches the task's "deployed working demo" deliverable)

**Database:** spin up a free Postgres instance on [Render](https://render.com),
[Neon](https://neon.tech), or [Supabase](https://supabase.com) and copy its connection
string into `DATABASE_URL`.

**Backend (Render):**
1. New → Web Service → point at the `backend/` folder of your repo
2. Build command: `npm install` · Start command: `npm start`
3. Environment variables: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN` (your Vercel frontend URL)
4. After first deploy, run `npm run migrate` once (Render's shell, or run it locally against
   the same `DATABASE_URL`)

**Frontend (Vercel):**
1. Import the repo, set root directory to `frontend/`
2. Environment variable: `VITE_API_URL` = `https://your-backend.onrender.com/api`
3. Deploy — Vercel auto-detects Vite

## Notes for extending it

- Daily goals (`daily_steps_goal`, `daily_water_goal_ml`, `daily_sleep_goal_hours`) live on
  the `users` table with sensible defaults; add a settings screen to let users edit them.
- `logs.logged_at` defaults to today but accepts a specific date, so a "log yesterday's
  workout" feature is just a date picker away.
- Repo is set up as two independent npm projects (no shared root `package.json`) so each
  half can be deployed and scaled separately.
