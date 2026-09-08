# Gallery Viewer

## Background
Users need to browse hundreds of items quickly and view high-resolution details without performance hiccups.

## Requirements

### Grid and Thumbnails
- The gallery MUST display items using a responsive masonry or grid layout.
- The grid MUST lazy-load thumbnails to ensure fast initial page loads.

### Item Modal
- Clicking an item MUST open a glassmorphism modal overlay.
- The modal MUST load the high-res image smoothly.
- The modal MUST display extracted metadata (Country, Year, Value, Quality).
- The modal MUST contain clear CTAs: a Telegram link (passing the item ID) and a Phone contact button.

### Viewport Native Lazy Loading
The system SHALL defer loading gallery images until they are in or near the user's viewport by utilizing native HTML lazy loading.

#### Scenario: Image out of viewport
- **WHEN** the user opens the gallery and an image is below the fold
- **THEN** the browser does not initiate a network request for that image

#### Scenario: Image entering viewport
- **WHEN** the user scrolls down towards an unloaded image
- **THEN** the browser automatically initiates the image network request just before it enters the viewport

### Progressive Rendering
The system SHALL use progressive image rendering for gallery items to provide instant, low-fidelity previews that sharpen as the download completes.

#### Scenario: Image initial render
- **WHEN** the browser begins fetching a progressive gallery image
- **THEN** it instantly displays a low-resolution, blurry version of the image using the initial scan data

#### Scenario: Image completion
- **WHEN** the progressive gallery image completes downloading
- **THEN** it is displayed in full sharpness without requiring a secondary URL request

### Card Stack Pagination
1. **Maximum Visible Dots:** The UI MUST never render more than 7 pagination dots at any time, regardless of the `variants.length`.
2. **Sliding Window:** When `variants.length > 7`, the dots must act as a sliding window centered around the `activeIndex`.
3. **Visual Depth (Edge Scaling):** To indicate that more cards exist in a direction, the dots at the edges of the 7-dot window should be scaled down and have lower opacity.
    - Central dots: scale 1.0, high opacity
    - Outer dots: scale 0.8, medium opacity
    - Outermost dots: scale 0.5, low opacity
4. **Behavior on Edges:** When the `activeIndex` is near the start (0, 1, 2) or end (N-1, N-2, N-3) of the variants array, the window stops sliding and the active dot physically moves to the edge.

### Card Stack Physics
1. **True Physical Stack Rendering:** The `ImageCard` component MUST render the top 3 cards in the stack as distinct, separate HTML DOM nodes using Framer Motion, rather than a single static bottom card that swaps images.
2. **Depth Positioning:**
    - Top Card (Index 0): z-index 10, scale 1.0, translateY 0px
    - Next Card (Index 1): z-index 9, scale 0.97, translateY 15px
    - Next-Next Card (Index 2): z-index 8, scale 0.94, translateY 30px
3. **Swipe Animation (Next):** When swiping to the next card, the Top Card flies off-screen, the Next Card smoothly animates to the Top Card's previous position, and the Next-Next Card animates to the Next Card's position. A new card fades in at the Next-Next position.
4. **Zero Blinking:** Because cards are fully rendered DOM nodes before they reach the top position, their images will already be loaded via `imageQueue`, completely eliminating the blinking/blurring effect currently seen.

### Performant Mobile Dragging
The system SHALL handle image card drag gestures without forcing layout re-renders on every pixel moved.

#### Scenario: Dragging a card
- **WHEN** the user drags a card on a mobile device
- **THEN** the Framer Motion physics engine manages the drag offset
- **AND** React state updates for the drag offset are bypassed, eliminating drag-induced stuttering

### Glassy Card Placards
The system SHALL style the card's text placard to visually merge with the card body's frosted glass aesthetic.

#### Scenario: Viewing a card
- **WHEN** the user views an image card
- **THEN** the bottom placard background is transparent
- **AND** the placard is separated from the card body only by a subtle semi-transparent white top border
- **AND** the placard text uses the dark fountain pen blue foreground color for contrast against the light theme
