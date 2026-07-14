## Why

The user has a large collection (2GB) of high-quality images of old paper money, coins, and stamps. They want to showcase these items online with a visually stunning, high-end "Modern Museum" aesthetic. The current setup consists of a set of image files with specific naming conventions for metadata extraction. A fast, zero-maintenance frontend solution is needed to present this collection, engage users, and provide a clear contact channel (Telegram/Phone). 

## What Changes

This change creates a new React-based static frontend deployed via GitHub Pages. 
- It sets up the core architecture to load metadata from a static JSON file.
- Images will be hosted on Cloudflare R2 for fast delivery via CDN and no egress costs.
- It builds a responsive, minimal, light-mode user interface using the `ui-ux-pro-max` design system generator (Exaggerated Minimalism pattern) tailored for Iranian users, featuring premium Persian typography.
- **CRITICAL**: All fonts, icons, and dependencies will be downloaded and hosted locally within the project to ensure 100% resilience against internet restrictions or external CDN removals.
- An "Apple-style" scroll-based hero animation will be implemented to hook users with gamification.
- It includes a masonry/grid gallery with a glassmorphism modal for deep viewing of items.

## Capabilities

### New Capabilities
- `frontend-architecture`: Scaffold Vite+React, routing, static JSON data loading, Cloudflare R2 image integration strategy.
- `museum-ui-system`: Implement "Exaggerated Minimalism" design tokens (colors, typography, massive whitespace) and Apple-style scroll animation hook.
- `gallery-viewer`: Develop lazy-loading thumbnail grid, glassmorphism modal for high-res view, and contact CTA integration.

### Modified Capabilities

## Impact

- Creates a new GitHub Pages deployment pipeline.
- Establishes the static metadata generation pattern (from file names).
- Sets up the Cloudflare R2 hosting architecture.
