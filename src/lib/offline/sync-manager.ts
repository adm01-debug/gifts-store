interface SyncTask {
  id: string;
  type: 'create' | 'update' | 'delete';
  resource: string;
  data: any;
}

export class SyncManager {
  private queue: SyncTask[] = [];
  
  async addTask(task: Omit<SyncTask, 'id'>): Promise<void> {
    this.queue.push({ ...task, id: crypto.randomUUID() });
    if (navigator.onLine) await this.processQueue();
  }
  
  private async processQueue(): Promise<void> {
    while (this.queue.length > 0) {
      const task = this.queue[0];
      try {
        await fetch(`/api/${task.resource}`, {
          method: task.type === 'create' ? 'POST' : task.type === 'update' ? 'PUT' : 'DELETE',
          body: JSON.stringify(task.data)
        });
        this.queue.shift();
      } catch (error) {
        break;
      }
    }
  }
}
