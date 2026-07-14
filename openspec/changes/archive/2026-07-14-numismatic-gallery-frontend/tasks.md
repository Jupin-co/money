## Setup
- [x] Initialize a new Vite + React project (`npm create vite@latest . -- --template react`)
- [x] Clear boilerplate code and set up standard folder structure (`src/components`, `src/styles`, `src/data`).
- [x] Configure `vite.config.js` with the correct `base` path for GitHub Pages deployment.

## Design System Implementation
- [x] Implement "Exaggerated Minimalism" design tokens (from `ui-ux-pro-max`) in `src/styles/index.css` (variables for primary/background colors).
- [x] Download `Inter` and a Persian web font (e.g., `Vazirmatn`) `.woff2` files into `public/fonts/` and set up local `@font-face` rules. **Do not use external CDNs.**
- [x] Download necessary SVG icons locally or use a library that bundles them statically (like `phosphor-icons`).
- [x] Set up global typographic rules and massive whitespace padding.

## Data Layer Setup
- [x] Create a mock `catalog.json` file in `public/` that points to sample Cloudflare R2 URLs.
- [x] Create a React Context or custom hook `useGalleryData()` to fetch and serve this data to components.

## Core Components
- [x] Build the `Hero` component with the scroll-tied gamified rotation animation (using Framer Motion).
- [x] Build the responsive `GalleryGrid` component.
- [x] Implement lazy loading for the `ImageCard` components.
- [x] Build the `GlassModal` component that displays the high-res image, metadata, and Telegram/Phone CTAs.

## Integration & Polish
- [x] Assemble all components in `App.jsx`.
- [x] Add smooth transitions between states (hover effects, modal open/close).
- [x] Test on mobile layouts specifically (375px width).

## Deployment Prep
- [x] Ensure `npm run build` succeeds locally.
- [x] Add a GitHub Actions workflow `.github/workflows/deploy.yml` for automated GitHub Pages deployment.
