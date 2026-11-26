# PlayNora frontend (Next.js 14, TypeScript, Tailwind)
```
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```
Mock data lives in `src/data`; all data access goes through `src/services/api.ts` (swap for FastAPI calls).
Payment/auth are simulated. NOT yet done: /games (community) and user dashboard pages, login/signup.

## Admin dashboard
`/admin/login` -> `/admin/dashboard`, linked from the footer. See **ADMIN_DASHBOARD.md** for setup, security model and the full backend API contract (Java Spring Boot). Copy `.env.example` to `.env.local` to run with dev sample data.
