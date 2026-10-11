export class DeduplicationLock {
  private inFlight: Set<string> = new Set();

  public acquire(key: string): boolean {
    if (this.inFlight.has(key)) {
      return false; // Already analyzing this entry
    }
    this.inFlight.add(key);
    return true;
  }

  public release(key: string): void {
    this.inFlight.delete(key);
  }
}

export const dedupLock = new DeduplicationLock();
