export class WebSocketClient {{
  private ws: WebSocket | null = null;

  connect(url: string): Promise<void> {{
    return new Promise((resolve, reject) => {{
      this.ws = new WebSocket(url);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (error) => reject(error);
    }});
  }}

  joinRoom(room: string): void {{
    this.send({{ type: 'join', room }});
  }}

  on(event: string, callback: (data: any) => void): void {{
    if (!this.ws) return;
    this.ws.onmessage = (message) => {{
      const data = JSON.parse(message.data);
      if (data.event === event) callback(data.data);
    }};
  }}

  send(data: any): void {{
    if (this.ws?.readyState === WebSocket.OPEN) {{
      this.ws.send(JSON.stringify(data));
    }}
  }}

  disconnect(): void {{
    this.ws?.close();
  }}
}}
