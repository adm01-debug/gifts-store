export interface SyncEntity {
  id: string;
  updatedAt: Date | string;
  [key: string]: unknown;
}

export class ConflictResolver {
  static resolve<T extends SyncEntity>(local: T, remote: T): T {
    const localTime = new Date(local.updatedAt).getTime();
    const remoteTime = new Date(remote.updatedAt).getTime();
    return remoteTime > localTime ? remote : local;
  }

  static mergeArrays<T extends SyncEntity>(local: T[], remote: T[]): T[] {
    const merged = new Map<string, T>();

    for (const item of local) {
      merged.set(item.id, item);
    }

    for (const item of remote) {
      const existing = merged.get(item.id);
      if (!existing) {
        merged.set(item.id, item);
      } else {
        merged.set(item.id, this.resolve(existing, item));
      }
    }

    return Array.from(merged.values());
  }
}
