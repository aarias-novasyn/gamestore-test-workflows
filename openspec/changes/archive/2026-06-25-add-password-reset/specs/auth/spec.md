# Delta for Auth

## ADDED Requirements

### Requirement: Password Reset
Users SHALL be able to reset their password via email-based token.

#### Scenario: Successful password reset
- GIVEN a user with valid credentials
- WHEN the user initiates a password reset
- THEN the system sends a password reset email with a token
- AND the token expires after 15 minutes

#### Scenario: Failed password reset with invalid token
- GIVEN invalid or expired reset token
- WHEN the user attempts to reset password
- THEN an error message "Invalid or expired reset token" is displayed
- AND the password is not updated

#### Scenario: Rate limiting on forgot password
- GIVEN 3 forgot-password requests in 1 hour
- WHEN a 4th attempt is made
- THEN HTTP 429 (Too Many Requests) is returned

## Security Requirements (always include)
- Passwords MUST be hashed with bcrypt (cost factor 12)
- Reset tokens MUST expire after 15 minutes
- Reset tokens MUST be stored hashed in the database
- All auth endpoints MUST have rate limiting
