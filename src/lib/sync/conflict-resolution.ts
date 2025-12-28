export class ConflictResolver {
  static resolve(local: any, remote: any): any {
    return remote.updatedAt > local.updatedAt ? remote : local;
  }
}
