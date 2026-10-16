## ADDED Requirements

### Requirement: Husky success test endpoint
The system SHALL expose a GET endpoint at `/api/husky-success` that returns a success test message.

#### Scenario: Successful response
- **WHEN** a client sends a GET request to `/api/husky-success`
- **THEN** the response status is 200
- **AND** the response body is `{ "success": true, "data": { "message": "Prueba Husky success" } }`

#### Scenario: No auth required
- **WHEN** a client sends a GET request to `/api/husky-success` without authentication
- **THEN** the response status is 200