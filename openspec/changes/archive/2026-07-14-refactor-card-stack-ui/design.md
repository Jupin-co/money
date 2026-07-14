## Context

The current `ImageCard.jsx` handles image stacks by keeping a single fixed bottom card and swapping its image source to simulate depth, while dynamically animating the top card. This leads to visual jarring (blinking) when the bottom image reloads. The pagination dots currently map 1:1 with the variant length, causing overflow on large variant lists.

## Goals / Non-Goals

**Goals:**
- Create a true physical card stack using Framer Motion (top 3 cards physically rendered).
- Ensure zero image blink/blur on the bottom card during a swipe.
- Implement a 7-dot maximum sliding-window pagination system.

**Non-Goals:**
- Completely rewriting the `imageQueue.js` logic.
- Adding vertical swiping.

## Decisions

1.  **Framer Motion `AnimatePresence` Stack:**
    -   *Rationale:* Instead of swapping image variants in a static container, we will map over the variants array and render the `top`, `next`, and `nextNext` cards as separate `motion.div` elements. By keying them on the variant ID or relative index, Framer Motion will smoothly transition their physical positions (e.g., from index 1 to index 0) when the active page changes.
    -   *Alternatives:* CSS transitions (harder to manage unmounts), swapping images inside a static div (causes blinking).
2.  **iOS Sliding Window Pagination:**
    -   *Rationale:* We will limit the dots array to a maximum of 7 visible dots. We will calculate the sliding window center based on the `activeIndex`. Dots at the edges of the window (indexes 0, 1 and 5, 6) will receive smaller `scale` and `opacity` values to simulate depth/continuation.
    -   *Alternatives:* A static `...` text element (breaks mental model on deep swipes).

## Risks / Trade-offs

-   **[Risk] Performance on low-end devices:** Rendering 3 separate high-res image cards might strain memory compared to 2.
    -   *Mitigation:* The `lowResQueue` and `thumbnailQueue` system already efficiently gates image loading. We are only increasing the rendered DOM nodes by 1.
-   **[Risk] Z-Index conflicts during layout animations:**
    -   *Mitigation:* Explicitly set decreasing z-indexes tied to the card's relative depth in the stack.
