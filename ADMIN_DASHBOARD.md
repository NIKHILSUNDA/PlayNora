# PlayNora Admin Dashboard - integration guide

Routes: **`/admin/login`** -> **`/admin/dashboard`** (also `/admin/venues|bookings|users|payments|sports|analytics|settings`).
Entry point for admins: the subtle **Admin Login** link at the bottom of the customer footer.

## Run & test
```bash
npm install
cp .env.example .env.local      # NEXT_PUBLIC_USE_MOCK=true -> sample data + dev login
npm run dev                     # http://localhost:3000  ->  footer "Admin Login"
```
Dev mock login: any valid email + a password of 8+ characters. **Mock mode is hard-disabled in
production builds** (`NODE_ENV === "production"`), so no fake auth can ever ship.

## Connecting the Spring Boot backend
1. `.env.local`: `NEXT_PUBLIC_USE_MOCK=false`, `BACKEND_URL=http://localhost:8080`.
   `next.config.mjs` proxies `/api/*` to the backend, so the browser stays same-origin (no CORS, cookies just work).
   (Direct mode: set `NEXT_PUBLIC_API_URL` and enable CORS **with credentials** on Spring.)
2. Implement the endpoints below. Every UI call goes through `src/services/admin/index.ts`; URLs live only in `src/config/api.ts`.
3. Delete `src/services/admin/mock/` when finished.

## Security model
| Layer | Role |
|---|---|
| `src/middleware.ts` | UX hint only: redirects visitors with no session cookie to login. Cannot verify the cookie. |
| `AdminShell` / `AdminAuthContext` | UX guard: no flash of admin UI, redirects, 401/403 -> sign-out. |
| **Spring Security** | **The real boundary.** Every `/api/v1/admin/**` call must require `ROLE_ADMIN` (`@PreAuthorize("hasRole('ADMIN')")` / `requestMatchers("/api/v1/admin/**").hasRole("ADMIN")`). Writes on `/api/v1/sports` too. |

Required backend behaviour
- **Session = httpOnly, Secure, SameSite=Lax/Strict cookie** set by `POST /auth/login`. The frontend never reads, stores or sends a token; nothing is put in localStorage/sessionStorage.
- Use the cookie name in `NEXT_PUBLIC_SESSION_COOKIE` (default `pn_session`) or set it empty to disable the middleware hint.
- **CSRF:** cookie auth needs CSRF protection (Spring CSRF token, or require the `X-Requested-With: XMLHttpRequest` header the client already sends, plus SameSite).
- Block/unblock must invalidate the user's sessions server-side. Rate-limit and lock out `/auth/login`.
- Razorpay key *secret* and webhook secret live only on the server. The dashboard shows Razorpay **references** only and **cannot issue refunds** (refunds happen server-side, e.g. inside `cancel`).
- Re-validate everything (cancellation rules, status transitions, input) on the server; frontend rules are UX only.

## Response contract (existing): `{ "data": T | null, "error": string | null }`
Lists: `data = { items: T[], total: number, page: number (1-based), pageSize: number }`.
List query params: `page, pageSize, search, sort, dir (asc|desc)` + filters below. Date filters are `YYYY-MM-DD`.

## Endpoints (prefix `/api/v1`; all `ROLE_ADMIN` unless noted)
| # | Method & path | Purpose | Params / body -> `data` |
|---|---|---|---|
| 1 | `POST /auth/login` (public) | Sign in, set cookie | `{email,password}` -> `SessionUser {id,name,email,phone?,role}` |
| 2 | `POST /auth/logout` | Clear cookie | - |
| 3 | `GET /auth/me` | Current session | -> `SessionUser` (frontend rejects `role != ADMIN`) |
| 4 | `POST /auth/change-password` | Change password | `{currentPassword,newPassword}` |
| 5 | **`GET /admin/stats`** | Dashboard | -> `AdminStats` (totals, revenueSeries[6 mo], bookingTrend[14 d], popularSports, growth[6 mo]) |
| 6 | `GET /admin/reports` | Analytics | `from,to` -> `AdminReport` (totals, timeline, popularSports, venuePerformance); bucket by day if range <= 62 days else month |
| 7 | **`GET /admin/users`** | List | `search(name,email,phone), status(ACTIVE\|BLOCKED), sort(name\|joinedAt\|bookingsCount\|totalSpent)` -> `Page<UserAccount>` |
| 8 | `GET /admin/users/{id}` | Profile | -> `UserAccount` |
| 9 | `PATCH /admin/users/{id}/status` | Block/unblock | `{status}` -> `UserAccount` |
| 10 | `GET /admin/users/{id}/bookings` | Booking history | -> `AdminBooking[]` |
| 11 | **`GET /admin/venues`** | List | `search, status(ACTIVE\|INACTIVE\|PENDING\|REJECTED), sport, sort(name\|pricePerHour\|createdAt\|bookingsCount\|revenue)` -> `Page<AdminVenue>` |
| 12 | `POST /admin/venues` | Create | `VenueInput` -> `AdminVenue` |
| 13 | `PUT /admin/venues/{id}` | Edit | `VenueInput` -> `AdminVenue` |
| 14 | `PATCH /admin/venues/{id}/status` | Approve (ACTIVE) / reject (REJECTED + `reason`) / (de)activate | `{status,reason?}` -> `AdminVenue` |
| 15 | `DELETE /admin/venues/{id}` | Delete | - |
| 16 | `POST /admin/venues/images` | Upload image | multipart `file` (jpg/png/webp <= 5 MB; validate server-side) -> `{url}` |
| 17 | **`GET /admin/bookings`** | List | `search(ref,user,venue), status, payment, sport, from, to (booking date), sort(date\|amount\|createdAt\|reference)` -> `Page<AdminBooking>` |
| 18 | `GET /admin/bookings/{id}` | Detail | -> `AdminBooking` |
| 19 | `POST /admin/bookings/{id}/cancel` | Cancel (+refund if paid) | `{reason}` -> `AdminBooking` |
| 20 | **`GET /admin/transactions`** | List | `search(id,razorpay ids,booking ref,user), status(SUCCESS\|PENDING\|FAILED\|REFUNDED), method, from, to, sort(createdAt\|amount)` -> `Page<Transaction>` |
| 21 | `GET /admin/transactions/{id}` | Detail | -> `Transaction` |
| 22 | `GET /admin/transactions/summary` | Status cards | -> `{success,pending,failed,refunded: {count,amount}}` |
| 23 | **`GET /sports`** | List (public for customers) | `includeInactive=true` honoured **only for ADMIN** -> `SportRecord[]` |
| 24 | `POST /sports`, `PUT /sports/{id}`, `PATCH /sports/{id}/status` | Manage sports (ADMIN) | `SportInput` / `{status}` -> `SportRecord` |
| 25 | `GET/PUT /admin/profile` | Admin profile | `{name,email,phone}` -> `SessionUser` |
| 26 | `GET/PATCH /admin/settings` | Platform + notifications | `Partial<AdminSettings>` -> `AdminSettings` |

The six endpoints you named are in **bold**; the rest are required by the specified features (auth, reports, actions, settings).
Exact TypeScript shapes: `src/types/admin.ts`. Venue creation by admin skips approval; partner submissions arrive as `PENDING`.

## Temporary mock data (dev only, `src/services/admin/mock/`)
Seeded sample users (64), venues (14 incl. 3 pending, 1 rejected), bookings (150), transactions (150, fake Razorpay-style IDs), sports (4), settings, and computed stats/reports. Clearly labelled by an amber "Sample data" banner in the UI. Mutations live in memory only.
