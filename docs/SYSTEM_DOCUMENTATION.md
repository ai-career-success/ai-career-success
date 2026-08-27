# System documentation

Three-tier app: React frontend, Express API, PostgreSQL. Docker Compose runs Postgres and Adminer locally. JWT access/refresh tokens protect user routes. AI calls are provider-agnostic and disabled until `AI_API_KEY` is set.
