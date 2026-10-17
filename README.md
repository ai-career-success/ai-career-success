# AI Career Success Platform

Web app for resume analysis, ATS estimates, skill-gap guidance, cover letters, interview prep, and application tracking.

## Local setup

1. Copy environment files (already done during initialization):

```powershell
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

2. Fill `JWT_SECRET` and `JWT_REFRESH_SECRET` in `backend/.env` before login/register will work. `AI_API_KEY` is only needed for AI features.

3. Start your local PostgreSQL service and ensure the `career_platform` database exists. Then start the apps:

```powershell
Set-Location backend; npm install; npm run dev
```

```powershell
Set-Location frontend; npm install; npm run dev
```

- API health: http://localhost:4000/health
- Frontend: http://localhost:5173

## Schema

Run the initial migration against your local PostgreSQL database:

```powershell
psql -d career_platform -v ON_ERROR_STOP=1 -f backend\migrations\001_init.sql
```

Configure the `psql` connection for your local PostgreSQL instance as needed.
