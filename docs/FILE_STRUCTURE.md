# File Structure

```
ai-career-success-platform/
├── README.md
├── PROJECT_PLAN.md
├── CONTRIBUTING.md
├── docker-compose.yml
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── backend/
│   ├── package.json
│   ├── Dockerfile
│   ├── .env.example
│   ├── migrations/
│   │   └── 001_init.sql
│   └── src/
│       ├── index.js
│       ├── config/
│       │   └── db.js
│       ├── middleware/
│       │   └── auth.middleware.js
│       ├── routes/
│       │   ├── health.routes.js
│       │   ├── auth.routes.js
│       │   ├── resume.routes.js
│       │   ├── jobDescription.routes.js
│       │   └── match.routes.js
│       └── controllers/
│
├── frontend/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   └── src/
│       ├── main.tsx
│       ├── index.css
│       ├── api/
│       │   └── client.ts
│       ├── pages/
│       │   ├── LoginPage.tsx
│       │   └── DashboardPage.tsx
│       └── components/
│
├── docs/
│   ├── SRS.docx
│   ├── SYSTEM_DOCUMENTATION.md
│   ├── API_REFERENCE.md
│   ├── FILE_STRUCTURE.md
│   └── assets/
│       ├── 1_context.png
│       ├── 2_usecase.png
│       ├── 3_erd.png
│       ├── 4_activity.png
│       └── 5_state.png
│
└── scripts/
    ├── issues.csv
    └── create_issues.sh
```
