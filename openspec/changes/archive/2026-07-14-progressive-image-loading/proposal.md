## Why

The current image loading architecture uses a custom queue and React state to manually orchestrate downloading thumbnails, applying CSS blurs, and then hot-swapping low-resolution images. This architecture floods the network with requests, leading to slow perceived load times and bandwidth bottlenecks. Shifting to native progressive image encoding combined with lazy loading will drastically improve performance, reduce code complexity, and provide a flawless user experience where images naturally sharpen as bytes stream in.

## What Changes

- Convert all image assets to Progressive format (e.g., Progressive WebP or JPEG).
- Remove the custom Javascript image queue (`src/utils/imageQueue.js`).
- Remove complex loading state management from the `CardContent` component.
- Consolidate `thumbnailUrl` and `lowResUrl` into a single, optimized progressive image URL.
- Implement native HTML lazy loading (`loading="lazy"`) and asynchronous decoding (`decoding="async"`) on gallery images.

## Capabilities

### New Capabilities
- `progressive-images`: Native browser-level rendering of progressive image formats for immediate blurry placeholders that sharpen over time.
- `lazy-viewport-loading`: Deferring network requests for images until they enter or approach the browser viewport.

### Modified Capabilities

## Impact

- **Code:** Deletion of `src/utils/imageQueue.js`. Drastic simplification of `src/components/ImageCard.jsx` (removing `useEffect` loaders and duplicate `motion.img` layers).
- **Data:** The `catalog.json` data structure will be simplified to use a single image URL per item instead of separate thumbnail and low-res URLs.
- **Assets:** All existing images in the catalog must be batch-converted to a progressive format.
- **Performance:** Massive reduction in initial network payload and connection contention.
