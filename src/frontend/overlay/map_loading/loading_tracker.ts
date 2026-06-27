interface LoadingObserver {
  update(stages: string[]): void;
}

class LoadingTracker {
  private readyStages: string[] = [];
  private observers: LoadingObserver[] = [];

  attach(observer: LoadingObserver): void {
    this.observers.push(observer);
  }

  detach(observer: LoadingObserver): void {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  notify(): void {
    this.observers.forEach((observer) => observer.update(this.readyStages));
  }

  notifyReady(stageName: string): void {
    if (this.readyStages.includes(stageName)) return; // avoid double-count
    this.readyStages.push(stageName);
    this.notify();
  }

  getReadyStages(): string[] {
    return [...this.readyStages];
  }

  reset(): void {
    this.readyStages = [];
  }
}

export default new LoadingTracker();
