# Frontend Architecture

## Background
The application must be a static site deployed to GitHub Pages with assets served via Cloudflare R2 to ensure zero maintenance and low running costs.

## Requirements

### Static Deployment
- The app MUST be fully static, built using Vite and React.
- The app MUST use React Router in Hash mode or configured specifically for GitHub Pages to prevent 404s.

### Asset Delivery
- All collection images (2GB) MUST be loaded from a Cloudflare R2 endpoint.
- The app MUST dynamically load a `catalog.json` at runtime which contains all metadata and image URLs, rather than hardcoding.
