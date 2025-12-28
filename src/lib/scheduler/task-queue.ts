export class TaskQueue {
  private queue: (() => Promise<void>)[] = [];
  private processing = false;
  
  async add(task: () => Promise<void>) {
    this.queue.push(task);
    if (!this.processing) await this.process();
  }
  
  private async process() {
    this.processing = true;
    while (this.queue.length > 0) {
      const task = this.queue.shift()!;
      await task();
    }
    this.processing = false;
  }
}
