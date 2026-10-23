## ADDED Requirements

### Requirement: Husky test endpoint
The system SHALL expose a GET endpoint at `/api/husky-test` that returns a test message.

#### Scenario: Successful husky test
- **WHEN** a client sends a GET request to `/api/husky-test`
- **THEN** the response status is 200
- **AND** the response body is `{ "success": true, "data": { "message": "Prueba Husky" } }`

#### Scenario: No authentication required
- **WHEN** a client sends a GET request to `/api/husky-test` without any authentication headers
- **THEN** the response status is 200
- **AND** the test message is returned successfully