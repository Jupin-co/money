## Context

The user requested a massive aesthetic shift from the "dark velvet" background with clear cards, to a "museum cream" background with "white frosted glass" cards.
Simultaneously, we need to address a performance bug in Framer Motion drag handling on mobiles, and refactor the card placards to match the new frosted glass aesthetic.

## Goals / Non-Goals

**Goals:**
- Transition the core theme tokens (`--background`, `--foreground`) in `src/styles/index.css`.
- Update `Hero.jsx` and `GlassModal.jsx` to respect the new color palette.
- Refactor `ImageCard.jsx` visual structure: replace the opaque placard with a frosted glass equivalent and update text color for contrast against the light theme.
- Improve drag performance on mobile by eliminating unnecessary React state (`dragOffset`) re-renders.

**Non-Goals:**
- Changing the actual logic of how the 3D card stack is built (which is already efficient).
- Modifying the underlying data or image sources.

## Decisions

1. **Theme Tokens**: We will use `#F4F0E6` (warm museum cream) as the new `--background`, and a dark fountain pen blue `#1c3b72` or deep charcoal `#1F1A15` for the `--foreground` (depending on the exact UI component).
2. **Frosted Glass Cards**: The white frosted glass effect will be achieved using a semi-transparent white background (`rgba(255,255,255, 0.4)`) combined with a strong blur (`backdrop-filter: blur(12px)`) and a delicate white border (`rgba(255,255,255, 0.6)`) to ensure it stands out on the cream background. Drop shadows will be darkened slightly to provide contrast.
3. **Placard Refactor**: We will remove the noise gradient and solid `#FDFBF7` background from the bottom placard in `ImageCard.jsx`. It will now inherit or match the glassy material of the main card, creating a unified glass object.
4. **Drag Performance**: We will completely remove `onDrag={(e, info) => setDragOffset(info.offset.x)}` and the `dragOffset` state hook from `ImageCard.jsx`. The framer motion `drag` props alone are sufficient for the physics to work, saving a full re-render cycle on every single dragged pixel.

## Risks / Trade-offs

- **Contrast Risk** -> Light frosted glass on a light background can wash out. **Mitigation**: We will use well-calibrated drop shadows (`box-shadow: 0 10px 30px rgba(0,0,0, 0.15)`) to ensure the cards detach visually from the background.
- **Hero Legibility Risk** -> If the hero text is light on a light background, it won't be seen. **Mitigation**: Update all hero text colors to the dark fountain pen blue (`#1c3b72`).
