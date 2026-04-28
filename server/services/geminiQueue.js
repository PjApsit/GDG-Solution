/**
 * Gemini Rate Limit Queue
 * WHY: Free tier is 15 RPM. This queue serializes requests with a ~4.2s gap
 * to stay safely under the limit (~14 RPM effective).
 */

class GeminiQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.MIN_INTERVAL_MS = 4200; // ~14 RPM to stay safely under 15 RPM
  }

  async add(job) {
    return new Promise((resolve, reject) => {
      this.queue.push({ job, resolve, reject });
      this.processNext();
    });
  }

  async processNext() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;
    const { job, resolve, reject } = this.queue.shift();
    try {
      const result = await job();
      resolve(result);
    } catch (err) {
      reject(err);
    }
    setTimeout(() => {
      this.processing = false;
      this.processNext();
    }, this.MIN_INTERVAL_MS);
  }

  get pending() {
    return this.queue.length;
  }
}

// Singleton instance
const geminiQueue = new GeminiQueue();
export default geminiQueue;
