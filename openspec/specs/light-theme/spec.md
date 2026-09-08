# Light Theme

## Requirements

### Light Theme Colors
The application SHALL use a light museum cream theme as its default visual aesthetic.

#### Scenario: Base theme application
- **WHEN** the application loads
- **THEN** the global background color is warm museum cream (#F4F0E6)
- **AND** the global foreground text color is dark fountain pen blue (#1c3b72)

### White Frosted Glass Tokens
The application SHALL provide visual tokens for a white frosted glass aesthetic.

#### Scenario: Glass component rendering
- **WHEN** a glass component is rendered
- **THEN** it uses a semi-transparent white background (rgba(255,255,255, 0.4))
- **AND** it applies a strong backdrop blur (12px)
- **AND** it uses a white semi-transparent border (rgba(255,255,255, 0.6))
- **AND** it features a subtle drop shadow (0 10px 30px rgba(0,0,0, 0.15)) for depth over the light background
