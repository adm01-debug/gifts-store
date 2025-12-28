export class PresenceService {
  private channel: any;
  
  join(roomId: string, userId: string) {
    this.channel = supabase.channel(`room:${roomId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = this.channel.presenceState();
        console.log('Users online:', Object.keys(state));
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          await this.channel.track({ userId, online_at: new Date().toISOString() });
        }
      });
  }
}
