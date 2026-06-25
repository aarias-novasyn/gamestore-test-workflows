# Design: Password Reset

## Context

Users need a self-service password reset flow. Currently, only admin-mediated reset exists.

## Goals / Non-Goals

**Goals:**
- Allow users to reset password via email token
- Secure token generation and validation
- Rate limiting to prevent abuse

**Non-Goals:**
- Passwordless login
- SMS-based reset

## Decisions

1. **Token format**: crypto.randomBytes(32) hex string
2. **Token storage**: Hashed in DB using SHA-256, never stored in plaintext
3. **Expiry**: 15 minutes from creation
4. **Rate limiting**: 3 forgot-password requests per email per hour
5. **Email**: Use existing transactional email service

## Risks / Trade-offs

- Email delivery delays → Inform user token may take a few minutes
- Token brute force → Short expiry + low attempt rate mitigates

## Open Questions

- Should we invalidate existing tokens when a new one is requested?
