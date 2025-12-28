export class BackgroundSync {
  async register(tag: string, data: any) {
    if ('sync' in self.registration) {
      await self.registration.sync.register(tag);
      localStorage.setItem(`sync_${tag}`, JSON.stringify(data));
    }
  }
}
