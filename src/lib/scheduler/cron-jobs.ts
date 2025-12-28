export class CronScheduler {
  private jobs = new Map<string, NodeJS.Timeout>();
  
  schedule(name: string, interval: number, task: () => void) {
    const job = setInterval(task, interval);
    this.jobs.set(name, job);
  }
  
  cancel(name: string) {
    const job = this.jobs.get(name);
    if (job) {
      clearInterval(job);
      this.jobs.delete(name);
    }
  }
}
