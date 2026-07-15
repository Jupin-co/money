## Why

The current dark velvet theme (#110e0c) presents a specific "vault-like" aesthetic, but the user wishes to shift the application to a brighter, more open "modern museum gallery" vibe using a warm museum cream (#F4F0E6) background with white frosted glass cards. Additionally, the Framer Motion drag physics on the image stack is laggy on mobile devices due to constant React state updates (`setDragOffset`) on every dragged pixel, and the bottom placard of the cards currently has an opaque cream styling which breaks the glassy aesthetic.

## What Changes

- Change the global CSS variables for the main background and text colors to invert the theme from dark to light museum cream.
- Update the `ImageCard.jsx` visual styling so the cards utilize a white frosted glass aesthetic that remains distinct from the light background.
- Refactor `ImageCard.jsx` to make the bottom text placard match the glassy card body, updating text color for readability.
- Fix the mobile drag lag by removing the unused `dragOffset` React state and `onDrag` listener inside `ImageCard.jsx`, allowing Framer Motion to handle drag smoothly without forcing React re-renders.
- Update `GlassModal.jsx` and `Hero.jsx` colors/gradients to align with the new light theme.

## Capabilities

### New Capabilities
- `light-theme`: Defining the museum cream and white frosted glass design system tokens and visual properties.

### Modified Capabilities
- `gallery-viewer`: Updating the image card physics to remove unnecessary React state during drag, and updating the placard visual requirements to match the glassy aesthetic.

## Impact

- `src/styles/index.css`: Global variables and background colors.
- `src/components/ImageCard.jsx`: Glass effect, placard styles, text colors, and removing `onDrag` lag.
- `src/components/Hero.jsx`: Gradient overlay direction colors to fade into cream rather than black.
- `src/components/GlassModal.jsx`: Modal backdrop color changes.
