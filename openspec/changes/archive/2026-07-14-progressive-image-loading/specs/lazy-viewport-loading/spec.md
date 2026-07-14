## ADDED Requirements

### Requirement: Viewport Native Lazy Loading
The system SHALL defer loading gallery images until they are in or near the user's viewport by utilizing native HTML lazy loading.

#### Scenario: Image out of viewport
- **WHEN** the user opens the gallery and an image is below the fold
- **THEN** the browser does not initiate a network request for that image

#### Scenario: Image entering viewport
- **WHEN** the user scrolls down towards an unloaded image
- **THEN** the browser automatically initiates the image network request just before it enters the viewport
