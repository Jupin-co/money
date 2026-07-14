## Why

The current coin card stack UI fails to scale elegantly and lacks the premium, physical feel expected of a "museum-quality" gallery. First, when a stack has a large number of coin variants (e.g., 50+), the pagination dots overflow the container and break the layout. Second, swiping the top card causes the bottom card's image to "blink" or blur jarringly as it instantly swaps the image source, breaking the illusion of a physical stack of cards. We need to implement a true physical stack animation and a sliding-window pagination system following ui-ux-pro-max guidelines.

## What Changes

- **Pagination Dots Redesign:** Implement an "iOS-style" sliding window for the pagination dots. The system will display a maximum of 7 dots, with the active dot centered and the edge dots scaling down to indicate continuation, preventing layout overflow.
- **Physical Card Stack Architecture:** Replace the static bottom card and image-swapping logic with a true physical stack. The UI will render the top 3 cards as distinct DOM elements using Framer Motion. When swiped, cards will physically slide up the z-axis to replace the top card, eliminating image loading blinks.
- **UI/UX Pro Alignment:** Ensure the animations use appropriate spring physics and the UI feels responsive and tactile.

## Capabilities

### New Capabilities
- `card-stack-pagination`: Dynamic sliding-window pagination for large variant sets.
- `card-stack-physics`: True 3D physical stack interaction using Framer Motion.

### Modified Capabilities

- None

## Impact

- **Code:** `src/components/ImageCard.jsx` will undergo a significant refactor to its rendering logic and animation structure.
- **UX:** Vastly improved mobile and desktop swiping experience, zero image blinking, and a clean, bounded pagination indicator.
