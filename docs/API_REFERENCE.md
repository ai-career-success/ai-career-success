# API reference

Base URL: `http://localhost:4000`

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/health` | No | Returns `{ "status": "ok" }` |
| POST | `/auth/register` | No | Create an account (`first_name`, `last_name`, `email`, `password`, `confirmPassword`) |
| POST | `/auth/login` | No | Authenticate by email and password; issues a 15-minute access token and a 7-day refresh token |
| POST | `/api/auth/register` | No | Same as `/auth/register`; included for versioned API compatibility |
| POST | `/api/auth/login` | No | Same as `/auth/login`; included for versioned API compatibility |
| GET | `/resumes` | Yes | Resume list (stub) |
| GET | `/job-descriptions` | Yes | Job description list (stub) |
| GET | `/matches` | Yes | Match analyses (stub) |

Authentication routes are also available without the `/api` prefix. Login returns `401 { "error": "Invalid credentials" }` for an unknown email, an incorrect password, or an inactive account. Send the access token on protected routes as `Authorization: Bearer <accessToken>`.
