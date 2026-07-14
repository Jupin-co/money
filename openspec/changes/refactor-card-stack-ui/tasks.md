## 1. Pagination Dots

- [x] Modify `ImageCard.jsx` to limit the number of visible dots to a maximum of 7.
- [x] Implement the math to calculate the sliding window of dots based on the current `activeIndex`.
- [x] Add dynamic `scale` and `opacity` inline styles to the dots to create a visual fall-off (depth effect) at the edges of the window.

## 2. Card Stack Physics Refactor

- [x] Remove the fixed `bottomCard` rendering logic from `ImageCard.jsx`.
- [x] Implement a loop over the top 3 cards in the `variants` array (e.g., `current`, `next`, `nextNext`).
- [x] Render each of the 3 cards using `<motion.div>` wrapped in an `<AnimatePresence>` to manage their entry and exit.
- [x] Set dynamic `z-index`, `scale`, and `translateY` values based on their relative position in the stack (0, 1, 2).
- [x] Test the swipe logic to ensure the cards smoothly slide up the stack visually without any image source swapping or blinking on individual cards.
