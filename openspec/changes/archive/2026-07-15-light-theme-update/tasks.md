## 1. Global Theme Updates

- [x] 1.1 In `src/styles/index.css`, update `--background` to museum cream (`#F4F0E6`) and `--foreground` to fountain pen blue (`#1c3b72`).
- [x] 1.2 Update `Hero.jsx` gradient overlays to fade to cream instead of black/dark grey, and update hero text colors to ensure contrast.
- [x] 1.3 Update `GlassModal.jsx` backdrop colors from dark translucent to a light/neutral frosted look.

## 2. Image Card Visual Refactor

- [x] 2.1 In `ImageCard.jsx`, update the card container's visual styles to a white frosted glass aesthetic (semi-transparent white background, strong blur, subtle white border, increased drop shadow for contrast against the cream background).
- [x] 2.2 In `ImageCard.jsx` (specifically the `CardContent` component or equivalent), remove the solid opaque placard background and noise gradient, replacing it with a transparent or frosted continuation of the main card body, separated by a subtle border.
- [x] 2.3 Update text colors within the placard to use the dark fountain pen blue for legibility.

## 3. Mobile Performance Fix

- [x] 3.1 In `ImageCard.jsx`, remove the `dragOffset` React state hook.
- [x] 3.2 In `ImageCard.jsx`, remove the `onDrag` event listener from the Framer Motion element that triggers state updates.
- [x] 3.3 Ensure the visual presentation (like rotation or scale) no longer depends on the React `dragOffset` state, but rather uses Framer Motion's `useMotionValue` and `useTransform` directly if necessary, or simply allow native drag without layout updates.
