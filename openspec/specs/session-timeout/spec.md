# session-timeout Specification

## Purpose
TBD - created by archiving change fix-session-timeout. Update Purpose after archive.
## Requirements
### Requirement: Activity Tracking
The system SHALL track the last activity time for each authenticated user.

#### Scenario: Activity recorded on request
- **WHEN** an authenticated user makes any API request
- **THEN** the user's `lastActivity` timestamp is updated to the current time

### Requirement: Inactivity Timeout
The system SHALL expire sessions after 60 minutes of inactivity.

#### Scenario: Session expires after inactivity
- **WHEN** 60 minutes have elapsed since the user's `lastActivity` timestamp
- **THEN** the session is considered expired
- **AND** subsequent requests return a 401 status

#### Scenario: Active session remains valid
- **WHEN** the user makes requests within the 60-minute inactivity window
- **THEN** the session remains valid

### Requirement: Configurable Timeout
The inactivity timeout SHALL be configurable via an environment variable.

#### Scenario: Custom timeout
- **WHEN** the environment variable `SESSION_TIMEOUT_MINUTES` is set to 120
- **THEN** sessions expire after 120 minutes of inactivity

#### Scenario: Default timeout
- **WHEN** no `SESSION_TIMEOUT_MINUTES` environment variable is set
- **THEN** the default inactivity timeout of 60 minutes is used

