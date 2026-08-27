# AI Career Success Platform

Web app for resume analysis, ATS estimates, skill-gap guidance, cover letters, interview prep, and application tracking.

## Local setup

1. Copy environment files (already done during initialization):

```powershell
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

2. Fill `JWT_SECRET` and `JWT_REFRESH_SECRET` in `backend/.env` before login/register will work. `AI_API_KEY` is only needed for AI features.

3. Start infrastructure and apps:

```powershell
docker compose up -d
Set-Location backend; npm install; npm run dev
```

```powershell
Set-Location frontend; npm install; npm run dev
```

- API health: http://localhost:4000/health
- Frontend: http://localhost:5173
- Adminer: http://localhost:8080

## Schema

```powershell
Get-Content backend\migrations\001_init.sql | docker compose exec -T postgres psql -U postgres -d career_platform
```
