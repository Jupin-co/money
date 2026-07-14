## ADDED Requirements

### Requirement: Progressive Rendering
The system SHALL use progressive image rendering for gallery items to provide instant, low-fidelity previews that sharpen as the download completes.

#### Scenario: Image initial render
- **WHEN** the browser begins fetching a progressive gallery image
- **THEN** it instantly displays a low-resolution, blurry version of the image using the initial scan data

#### Scenario: Image completion
- **WHEN** the progressive gallery image completes downloading
- **THEN** it is displayed in full sharpness without requiring a secondary URL request
