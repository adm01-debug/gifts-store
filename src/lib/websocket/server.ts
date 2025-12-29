// WebSocket server types and utilities
// Note: This is for reference/typing purposes. Actual server runs in Node.js/Deno

export interface WebSocketMessage {
  type: 'join' | 'leave' | 'message' | 'broadcast';
  room?: string;
  event?: string;
  data?: any;
}

export interface RoomMessage {
  event: string;
  data: any;
  sender?: string;
}

export interface RealtimeServerConfig {
  port: number;
  heartbeatInterval?: number;
  maxConnectionsPerRoom?: number;
}

// Helper to create message payloads
export function createBroadcastMessage(event: string, data: any): string {
  return JSON.stringify({ event, data });
}

export function createJoinMessage(room: string): WebSocketMessage {
  return { type: 'join', room };
}

export function createLeaveMessage(room: string): WebSocketMessage {
  return { type: 'leave', room };
}

// Room management utilities (for server-side use)
export class RoomManager {
  private rooms = new Map<string, Set<string>>();

  addToRoom(roomId: string, clientId: string): void {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId)!.add(clientId);
  }

  removeFromRoom(roomId: string, clientId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.delete(clientId);
      if (room.size === 0) {
        this.rooms.delete(roomId);
      }
    }
  }

  getClientsInRoom(roomId: string): string[] {
    const room = this.rooms.get(roomId);
    return room ? Array.from(room) : [];
  }

  getRoomCount(): number {
    return this.rooms.size;
  }
}
