# Card Stack Pagination

## Requirements

1. **Maximum Visible Dots:** The UI MUST never render more than 7 pagination dots at any time, regardless of the `variants.length`.
2. **Sliding Window:** When `variants.length > 7`, the dots must act as a sliding window centered around the `activeIndex`.
3. **Visual Depth (Edge Scaling):** To indicate that more cards exist in a direction, the dots at the edges of the 7-dot window should be scaled down and have lower opacity.
    - Central dots: scale 1.0, high opacity
    - Outer dots: scale 0.8, medium opacity
    - Outermost dots: scale 0.5, low opacity
4. **Behavior on Edges:** When the `activeIndex` is near the start (0, 1, 2) or end (N-1, N-2, N-3) of the variants array, the window stops sliding and the active dot physically moves to the edge.

## Edge Cases

- Stacks with fewer than 7 variants should simply render N dots normally, with no scaling or sliding window logic.
- Ensure the math correctly handles the wrapping behavior of the activeIndex.
