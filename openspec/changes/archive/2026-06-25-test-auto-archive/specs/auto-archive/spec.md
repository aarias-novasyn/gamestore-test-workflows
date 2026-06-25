## ADDED Requirements

### Requirement: Archive completed change
The system SHALL allow archiving a completed change using the CLI command `openspec archive change`.

#### Scenario: Archive existing completed change
- **WHEN** a user runs `openspec archive change fix-session-timeout`
- **THEN** the change `fix-session-timeout` is moved to `openspec/changes/archive/`

#### Scenario: Verify archived change is removed from active list
- **WHEN** a user runs `openspec list --changes` after archiving
- **THEN** the archived change no longer appears in the list

#### Scenario: Verify archived change artifacts are intact
- **WHEN** a user inspects the archived change directory
- **THEN** all artifacts (proposal.md, design.md, tasks.md, specs/) are present
- **AND** the content of each artifact is unchanged

### Requirement: Handle archive errors gracefully
The system SHALL display a clear error message when archiving fails.

#### Scenario: Archive non-existent change
- **WHEN** a user runs `openspec archive change non-existent-change`
- **THEN** the system displays an error indicating the change was not found

#### Scenario: Archive already archived change
- **WHEN** a user runs `openspec archive change` on an already archived change
- **THEN** the system displays an appropriate error message