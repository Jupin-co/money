class ImageQueue {
  constructor() {
    this.queue = [];
    this.processingSrcs = new Map(); // Tracks concurrent requests: src -> array of callbacks
    this.cache = new Set();          // Instantly resolves previously loaded images
    this.isProcessing = false;
  }

  add(src, callback) {
    if (this.cache.has(src)) {
      callback(src);
      return;
    }
    
    if (this.processingSrcs.has(src)) {
      this.processingSrcs.get(src).push(callback);
      return;
    }

    this.processingSrcs.set(src, [callback]);
    this.queue.push(src);
    this.processNext();
  }

  processNext() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    const src = this.queue.shift();
    const img = new Image();
    img.src = src;
    
    const finish = () => {
      this.cache.add(src);
      const callbacks = this.processingSrcs.get(src) || [];
      callbacks.forEach(cb => cb(src));
      this.processingSrcs.delete(src);
      
      this.isProcessing = false;
      this.processNext();
    };

    img.onload = finish;
    img.onerror = finish;
  }
}

// We use three separate queues so thumbnails always prioritize over low-res, and low-res over high-res
export const thumbnailQueue = new ImageQueue();
export const lowResQueue = new ImageQueue();
export const highResQueue = new ImageQueue();
