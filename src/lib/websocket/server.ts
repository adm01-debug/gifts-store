import {{ WebSocketServer, WebSocket }} from 'ws';

export class RealtimeService {{
  private wss: WebSocketServer;
  private rooms = new Map<string, Set<WebSocket>>();

  constructor(port: number = 8080) {{
    this.wss = new WebSocketServer({{ port }});
    this.setupHandlers();
  }}

  private setupHandlers() {{
    this.wss.on('connection', (ws: WebSocket) => {{
      ws.on('message', (message: string) => {{
        const data = JSON.parse(message);
        this.handleMessage(ws, data);
      }});
    }});
  }}

  private handleMessage(ws: WebSocket, data: any) {{
    switch (data.type) {{
      case 'join':
        this.joinRoom(ws, data.room);
        break;
      case 'broadcast':
        this.broadcast(data.room, data.event, data.payload);
        break;
    }}
  }}

  joinRoom(ws: WebSocket, room: string): void {{
    if (!this.rooms.has(room)) {{
      this.rooms.set(room, new Set());
    }}
    this.rooms.get(room)!.add(ws);
  }}

  broadcast(room: string, event: string, data: any): void {{
    const clients = this.rooms.get(room);
    if (!clients) return;

    const message = JSON.stringify({{ event, data }});
    clients.forEach(client => {{
      if (client.readyState === WebSocket.OPEN) {{
        client.send(message);
      }}
    }});
  }}
}}

export const realtimeService = new RealtimeService();
