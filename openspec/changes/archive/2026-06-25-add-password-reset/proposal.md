# Add Password Reset

## Why

Users currently have no way to reset their password if they forget it, leading to account lockout and support requests.

## What Changes

- Add a "Forgot Password" flow with email-based reset token
- Add a password reset endpoint that validates the token and updates the password
- Rate-limit password reset attempts to prevent abuse

## Capabilities

### New Capabilities
- `auth` - Password reset flow

### Modified Capabilities
- `auth` - Existing authentication spec needs new requirement for password reset

## Impact

- Auth module: new endpoints `/auth/forgot-password` and `/auth/reset-password`
- Email service: transactional email for reset tokens
- Security: reset tokens expire in 15 minutes, rate limited to 3 requests per hour
