## Context

The system needs to render a high-performance, visually stunning image gallery for 2GB of numismatic collection images. The constraints are a zero-maintenance deployment model on GitHub Pages, utilizing Cloudflare R2 for asset delivery.

## Goals / Non-Goals

**Goals:**
- Deploy a static React frontend to GitHub Pages.
- Fetch images dynamically from Cloudflare R2 using a static `catalog.json` index.
- Implement a "Modern Museum" (Exaggerated Minimalism) design system: Light mode, high contrast, Inter typography, large whitespace.
- Build an Apple-style scroll-tied animation for the hero section to hook users.

**Non-Goals:**
- Implementing a full backend server or live database (Cloudflare D1 is deferred for later).
- Implementing image processing pipelines on the fly (images are pre-processed into thumbs/high-res).
- User authentication or purchasing workflows.

## Decisions

**Frontend Framework:** Vite + React. Excellent performance, easy static building for GitHub Pages.
**Styling Strategy:** Vanilla CSS with variables mapped to our "Exaggerated Minimalism" design tokens (generated via the `ui-ux-pro-max` skill).
  - `--color-primary`: `#18181B`
  - `--color-background`: `#FAFAFA`
  - Typography: `Inter` and Persian fonts will be downloaded as `.woff2` files and served locally from the `public/fonts` directory. No Google Fonts or external CDNs will be used for fonts or icons.
**Scroll Animation:** Use a library like `framer-motion` or GSAP ScrollTrigger to tie the rotation of the hero coin image to the window scroll position, achieving the gamified hook.
**Data Flow:** A pre-generated `catalog.json` file will act as the "database", containing URLs to Cloudflare R2.
**Cloudflare R2:** Used as a public bucket with a custom domain/CDN in front of it to ensure fast delivery.

## Risks / Trade-offs

- **Risk**: GitHub Pages bandwidth limits. → **Mitigation**: We are offloading all 2GB of images to Cloudflare R2/CDN. Only HTML/JS/CSS hits GitHub Pages.
- **Risk**: Scroll animations causing jank on low-end mobile devices. → **Mitigation**: Respect `prefers-reduced-motion` and optimize 3D transforms using CSS `will-change: transform`.
