## Context

GameStore uses JWT-based auth with a hardcoded 15-minute access token and 7-day refresh token. There is no activity tracking — sessions expire on a fixed clock regardless of user activity. The `/auth/refresh` endpoint returns the same refresh token instead of rotating it. Passwords are stored and compared in plaintext. The JWT secret is a hardcoded string.

## Goals / Non-Goals

**Goals:**
- Track user `lastActivity` timestamp to enable inactivity-based session expiration
- Implement sliding expiration: session expires after 60 minutes of inactivity
- Rotate refresh tokens on each `/auth/refresh` call (issue new, revoke old)
- Hash passwords with bcrypt on registration and verify on login
- Move JWT secret to environment variable

**Non-Goals:**
- Adding OAuth, SSO, or social login providers
- Rate limiting on auth endpoints
- Multi-factor authentication
- Audit logging of auth events
- Session management UI (view active sessions, force logout)

## Decisions

**Decision 1: Track `lastActivity` on User model**  
Adding a `lastActivity` DateTime field to the existing User model is the simplest approach. A separate Session table would be cleaner for multi-session support but adds complexity not justified by current requirements.

**Decision 2: Sliding expiration via middleware**  
A new `updateActivity` middleware will update `lastActivity` on every authenticated request. The `authenticate` middleware will reject tokens from sessions where `lastActivity` exceeds the inactivity threshold. This avoids coupling session logic into every route handler.

**Decision 3: bcrypt for password hashing**  
bcrypt is the de facto standard for Node.js password hashing. The `bcryptjs` pure-JS library avoids native compilation issues. Salt rounds set to 10 (good security/performance balance).

**Decision 4: New refresh token format**  
On `/auth/refresh`, a new refresh token is generated and stored, replacing the old one in the database. The old refresh token can no longer be used (token theft protection — refresh token rotation).

**Decision 5: Environment variable for JWT_SECRET**  
The hardcoded secret moves to `process.env.JWT_SECRET` with a fallback only in development. A default value is not committed to production.

## Risks / Trade-offs

- **[Consistency]**: `lastActivity` updates on every authenticated request add a DB write — negligible for current scale, but could become a bottleneck. Mitigation: can batch or defer writes if needed later.
- **[Refresh rotation race condition]**: If a user sends two concurrent `/refresh` calls, the second may fail because the first already rotated the token. Mitigation: the first rotation invalidates the old token; the client will get a 401 on the second call and can trigger a fresh login. This is standard behavior and acceptable.
- **[No multi-session support]**: Single `lastActivity` field per user means all sessions share one activity clock. Multi-device usage isn't handled differently. Acceptable for current scope.
