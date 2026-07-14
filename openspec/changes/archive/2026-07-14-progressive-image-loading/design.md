## Context

The current `ImageCard.jsx` handles image loading by requesting a lightweight `thumbnailUrl`, applying a `blur(5px)` CSS filter, and then hot-swapping to a `lowResUrl` once downloaded. To manage this network orchestration, `src/utils/imageQueue.js` was built to limit concurrent requests. However, this custom logic is complex, blocks the UI thread, and scales poorly when scrolling quickly through the gallery.

By moving to Progressive WebP (or Progressive JPEG) formats, we can eliminate the dual-URL architecture. A progressive image renders a low-quality preview instantly and sharpens as data streams in. Paired with native HTML lazy loading (`loading="lazy"`), the browser acts as a highly optimized queue manager.

## Goals / Non-Goals

**Goals:**
- Simplify React components by removing custom loading state and blur filters.
- Eliminate the custom Javascript image queue (`imageQueue.js`).
- Reduce the number of HTTP requests by consolidating thumbnails and low-res images.
- Improve time-to-first-paint for gallery images via progressive encoding.
- Ensure off-screen images do not consume bandwidth until scrolled into view.

**Non-Goals:**
- Creating a backend image processing pipeline (we will batch convert static assets locally/manually for now).
- Implementing IntersectionObserver in Javascript (we rely on native `<img loading="lazy">`).

## Decisions

**1. Consolidate to Single Progressive Image**
Instead of having `item.thumbnailUrl` and `item.lowResUrl`, we will just use a single `item.imageUrl` which points to a Progressive WebP file. 
*Rationale:* Browsers handle progressive decoding natively. The very first packets of a progressive WebP act exactly like a thumbnail. This removes 50% of our network requests.

**2. Native Lazy Loading**
We will apply `loading="lazy"` and `decoding="async"` to the image tags.
*Rationale:* The browser's native lazy loading is highly optimized, respects viewport margins, and requires zero Javascript overhead compared to an `IntersectionObserver` polyfill.

**3. Deletion of `imageQueue.js`**
We will completely remove the custom queuing logic.
*Rationale:* The primary reason for the queue was to prevent low-res images from blocking thumbnail downloads. Since we are moving to a single progressive image per card + lazy loading, the browser will manage connection concurrency perfectly.

## Risks / Trade-offs

- **Risk:** Safari/iOS older versions may have varied support for aggressive native lazy loading.
  *Mitigation:* The fallback is that images load eagerly, which is no worse than the original architecture if we didn't have the queue. Progressive WebP is widely supported.
- **Trade-off:** We must manually re-process the static image assets to ensure they are encoded as Progressive. Standard encoding will lose the "blurry-to-sharp" benefit.
