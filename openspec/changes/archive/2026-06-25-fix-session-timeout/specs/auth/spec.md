## MODIFIED Requirements

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

## ADDED Requirements

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
