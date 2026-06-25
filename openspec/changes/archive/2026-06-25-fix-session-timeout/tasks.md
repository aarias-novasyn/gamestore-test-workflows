## 1. Backend Setup

- [x] 1.1 Install `bcryptjs` and `dotenv` npm packages
- [x] 1.2 Create `.env` file with `JWT_SECRET` and `SESSION_TIMEOUT_MINUTES` variables

## 2. Database Changes

- [x] 2.1 Add `lastActivity DateTime?` field to User model in `schema.prisma`
- [x] 2.2 Generate and apply Prisma migration

## 3. Auth Middleware (`backend/src/middleware/auth.ts`)

- [x] 3.1 Replace hardcoded `JWT_SECRET` with `process.env.JWT_SECRET` (with dev fallback)
- [x] 3.2 Add `updateActivity` middleware that updates `lastActivity` on the user
- [x] 3.3 Add session inactivity check to `authenticate` middleware (reject if `lastActivity` exceeds timeout)
- [x] 3.4 Export `SESSION_TIMEOUT_MINUTES` config (from env, default 60)

## 4. Auth Routes (`backend/src/routes/auth.ts`)

- [x] 4.1 Hash password with bcrypt on registration (replaces plaintext store)
- [x] 4.2 Verify password with bcrypt on login (replaces plaintext comparison)
- [x] 4.3 Implement refresh token rotation: generate new refresh token on `/auth/refresh`, store it, return it
- [x] 4.4 Return `lastActivity` in `/me` response

## 5. Frontend Verification

- [x] 5.1 Verify frontend auto-refresh handles new rotated refresh tokens correctly
- [x] 5.2 Verify session inactivity timeout redirects to login after 60 min idle
