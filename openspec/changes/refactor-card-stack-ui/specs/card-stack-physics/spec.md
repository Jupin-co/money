# Card Stack Physics

## Requirements

1. **True Physical Stack Rendering:** The `ImageCard` component MUST render the top 3 cards in the stack as distinct, separate HTML DOM nodes using Framer Motion, rather than a single static bottom card that swaps images.
2. **Depth Positioning:**
    - Top Card (Index 0): z-index 10, scale 1.0, translateY 0px
    - Next Card (Index 1): z-index 9, scale 0.97, translateY 15px
    - Next-Next Card (Index 2): z-index 8, scale 0.94, translateY 30px
3. **Swipe Animation (Next):** When swiping to the next card, the Top Card flies off-screen, the Next Card smoothly animates to the Top Card's previous position, and the Next-Next Card animates to the Next Card's position. A new card fades in at the Next-Next position.
4. **Zero Blinking:** Because cards are fully rendered DOM nodes before they reach the top position, their images will already be loaded via `imageQueue`, completely eliminating the blinking/blurring effect currently seen.

## Edge Cases

- Stacks with only 1 or 2 variants should correctly handle the lack of a 3rd card without breaking layout.
