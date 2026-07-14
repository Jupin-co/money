## 1. Asset Conversion (Manual Prerequisite)

- [x] 1.1 Batch convert existing image assets in `public/images/` to Progressive WebP format (or document process for user to do so).
- [x] 1.2 Verify that converted images render progressively in a test browser.

## 2. Data Schema Update

- [x] 2.1 Update `public/data/catalog.json` to replace `thumbnailUrl` and `lowResUrl` with a single `imageUrl`.
- [x] 2.2 Update `src/data/GalleryContext.jsx` to parse and map `imageUrl` correctly, ensuring fallback logic works for dev server routing.

## 3. UI Component Simplification

- [x] 3.1 Delete `src/utils/imageQueue.js` entirely.
- [x] 3.2 Refactor `CardContent` in `src/components/ImageCard.jsx` to remove all `useEffect` image loading logic.
- [x] 3.3 Refactor `CardContent` to remove CSS `blur` filter states.
- [x] 3.4 Refactor `CardContent` to use a single `<motion.img>` tag with `src={variant.imageUrl}`.
- [x] 3.5 Add `loading="lazy"` and `decoding="async"` to the image tag.

## 4. Testing & Verification

- [x] 4.1 Run local dev server and throttle network speed to `Fast 3G` in DevTools.
- [x] 4.2 Verify that scrolling down triggers network requests only for visible images (Lazy Loading).
- [x] 4.3 Verify that images render a blurry placeholder instantly and sharpen sequentially (Progressive Loading).
- [x] 4.4 Verify that drag physics and stacking remain perfectly functional with the new image structure.
