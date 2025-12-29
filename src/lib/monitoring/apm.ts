// Application Performance Monitoring - Browser compatible

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

export class APMService {
  private metrics: PerformanceMetric[] = [];

  track(metric: string, value: number) {
    console.log(`[APM] ${metric}: ${value}`);
    this.metrics.push({
      name: metric,
      value,
      timestamp: Date.now(),
    });
  }

  startTransaction(name: string) {
    const start = Date.now();
    return {
      end: () => {
        this.track(name, Date.now() - start);
      }
    };
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  clearMetrics(): void {
    this.metrics = [];
  }
}

export const apm = new APMService();
