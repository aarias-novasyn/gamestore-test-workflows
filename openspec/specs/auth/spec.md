# Auth Specification

## Purpose
Authentication and session management for GameStore.
## Requirements
### Requirement: User Login
Users SHALL authenticate with email and password to access the system.

#### Scenario: Valid credentials
- **WHEN** a user submits the login form with email "test@example.com" and password "secret"
- **THEN** a JWT access token is returned
- **AND** a refresh token is stored in HTTP-only cookie

#### Scenario: Invalid credentials
- **WHEN** a user submits the login form with invalid email or password
- **THEN** an error message "Invalid credentials" is displayed
- **AND** no tokens are issued

### Requirement: Session Persistence
Users SHALL maintain their session for 60 minutes after their last activity.

#### Scenario: Session timeout
- **WHEN** 60 minutes pass without any request from an authenticated user
- **THEN** the session expires
- **AND** the user must log in again

#### Scenario: Activity extends session
- **WHEN** an authenticated user makes a request before the inactivity timeout
- **THEN** the session inactivity timer resets
- **AND** the user remains authenticated

### Requirement: Password Storage
Users SHALL have their passwords stored securely using bcrypt hashing.

#### Scenario: Password hashing on registration
- **WHEN** a new user registers with a password
- **THEN** the password is stored as a bcrypt hash

#### Scenario: Password verification on login
- **WHEN** a user provides the correct password during login
- **THEN** the system verifies the bcrypt hash matches before granting access

### Requirement: Refresh Token Rotation
The system SHALL issue a new refresh token on each successful token refresh and invalidate the previous one.

#### Scenario: Successful token refresh
- **WHEN** a user requests a token refresh with a valid refresh token
- **THEN** a new access token is returned
- **AND** a new refresh token is returned
- **AND** the previous refresh token is invalidated

#### Scenario: Reuse of old refresh token
- **WHEN** a user attempts to refresh with an already-used refresh token
- **THEN** the request is rejected with a 401 error

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

