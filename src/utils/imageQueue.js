class ImageQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  add(src, callback) {
    // Prevent duplicate processing
    if (this.queue.find(item => item.src === src)) return;
    
    this.queue.push({ src, callback });
    this.processNext();
  }

  processNext() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    const { src, callback } = this.queue.shift();
    const img = new Image();
    img.src = src;
    
    const finish = () => {
      callback(src);
      this.isProcessing = false;
      this.processNext();
    };

    img.onload = finish;
    img.onerror = finish; // Proceed even if an image fails
  }
}

// We use two separate queues so thumbnails always prioritize over low-res
export const thumbnailQueue = new ImageQueue();
export const lowResQueue = new ImageQueue();
