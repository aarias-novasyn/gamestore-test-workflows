## Why

Session timeout is currently hard-coded to 15 minutes regardless of user activity, forcing users to re-authenticate even when actively using the application. The refresh token endpoint does not rotate tokens, and passwords are stored in plaintext — both security violations.

## What Changes

- Add `lastActivity` field to track user activity timestamps
- Implement sliding session expiration based on inactivity (session expires after N minutes of inactivity, not after fixed TTL)
- Change session inactivity timeout from 15 minutes to 60 minutes
- Fix refresh token rotation — issue a new refresh token on each `/auth/refresh` call and revoke the old one
- Hash passwords with bcrypt on registration and verify hash on login
- Move JWT secret from hardcoded string to environment variable
- Update the auth spec to reflect sliding expiration behavior and new timeout duration

## Capabilities

### New Capabilities

- `session-timeout`: Sliding session expiration based on user activity tracking, configurable inactivity timeout, and proper session lifecycle

### Modified Capabilities

- `auth`: Session Persistence requirement changes from fixed 15-minute TTL to inactivity-based sliding expiration with 60-minute timeout. Refresh token rotation added. Password storage requirement augmented with bcrypt hashing.

## Impact

- **Backend**: `backend/prisma/schema.prisma` — add `lastActivity` field to User model; `backend/src/middleware/auth.ts` — update token generation, add activity tracking; `backend/src/routes/auth.ts` — fix refresh rotation, add bcrypt hashing, update login/register; `.env` — add `JWT_SECRET`
- **Frontend**: no breaking changes expected; `frontend/src/services/api.ts` will benefit from proper refresh token rotation

## Risks
- Cambiar el TTL puede invalidar tokens existentes.
- Necesitamos migrar sesiones activas o invalidarlas.