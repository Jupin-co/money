## ADDED Requirements

### Requirement: Performant Mobile Dragging
The system SHALL handle image card drag gestures without forcing layout re-renders on every pixel moved.

#### Scenario: Dragging a card
- **WHEN** the user drags a card on a mobile device
- **THEN** the Framer Motion physics engine manages the drag offset
- **AND** React state updates for the drag offset are bypassed, eliminating drag-induced stuttering

### Requirement: Glassy Card Placards
The system SHALL style the card's text placard to visually merge with the card body's frosted glass aesthetic.

#### Scenario: Viewing a card
- **WHEN** the user views an image card
- **THEN** the bottom placard background is transparent
- **AND** the placard is separated from the card body only by a subtle semi-transparent white top border
- **AND** the placard text uses the dark fountain pen blue foreground color for contrast against the light theme
