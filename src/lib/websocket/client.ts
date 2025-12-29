// WebSocket client for real-time communication

type MessageHandler = (data: any) => void;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private handlers = new Map<string, MessageHandler[]>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(url);
        
        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          resolve();
        };
        
        this.ws.onerror = (error) => reject(error);
        
        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (e) {
            console.error('Failed to parse WebSocket message:', e);
          }
        };
        
        this.ws.onclose = () => {
          this.attemptReconnect(url);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleMessage(data: { event: string; payload?: any; data?: any }): void {
    const handlers = this.handlers.get(data.event);
    if (handlers) {
      handlers.forEach((handler) => handler(data.payload || data.data));
    }
  }

  private attemptReconnect(url: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnecting (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        this.connect(url).catch(console.error);
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  joinRoom(room: string): void {
    this.send({ type: 'join', room });
  }

  leaveRoom(room: string): void {
    this.send({ type: 'leave', room });
  }

  on(event: string, callback: MessageHandler): () => void {
    const handlers = this.handlers.get(event) || [];
    handlers.push(callback);
    this.handlers.set(event, handlers);

    return () => {
      const current = this.handlers.get(event) || [];
      this.handlers.set(event, current.filter((h) => h !== callback));
    };
  }

  send(data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect(): void {
    this.reconnectAttempts = this.maxReconnectAttempts;
    this.ws?.close();
    this.ws = null;
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const wsClient = new WebSocketClient();
