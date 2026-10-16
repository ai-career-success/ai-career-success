# API reference

Base URL: `http://localhost:4000`

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/health` | No | Returns `{ "status": "ok" }` |
| POST | `/auth/register` | No | Create an account (`first_name`, `last_name`, `email`, `password`) |
| POST | `/auth/login` | No | Issue JWT access and refresh tokens |
| GET | `/resumes` | Yes | Resume list (stub) |
| GET | `/job-descriptions` | Yes | Job description list (stub) |
| GET | `/matches` | Yes | Match analyses (stub) |
