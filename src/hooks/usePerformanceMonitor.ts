import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderCount: number;
  renderTime: number;
  lastRenderDuration: number;
  averageRenderTime: number;
}

interface PerformanceMonitorOptions {
  enabled?: boolean;
  threshold?: number; // ms
  logToConsole?: boolean;
  onSlowRender?: (metrics: PerformanceMetrics) => void;
}

/**
 * Hook para monitorar performance de componentes React
 * 
 * Útil para identificar componentes com re-renders lentos ou excessivos
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const metrics = usePerformanceMonitor('MyComponent', {
 *     threshold: 16, // 60fps = ~16ms por frame
 *     logToConsole: true,
 *   });
 *   
 *   return <div>Render count: {metrics.renderCount}</div>;
 * }
 * ```
 */
export function usePerformanceMonitor(
  componentName: string,
  options: PerformanceMonitorOptions = {}
): PerformanceMetrics {
  const {
    enabled = import.meta.env.DEV, // Apenas em desenvolvimento por padrão
    threshold = 16, // 60fps threshold
    logToConsole = false,
    onSlowRender,
  } = options;

  const renderCount = useRef(0);
  const renderTimes = useRef<number[]>([]);
  const renderStart = useRef<number>(0);
  const metrics = useRef<PerformanceMetrics>({
    renderCount: 0,
    renderTime: 0,
    lastRenderDuration: 0,
    averageRenderTime: 0,
  });

  // Marcar início do render
  if (enabled) {
    renderStart.current = performance.now();
  }

  useEffect(() => {
    if (!enabled) return;

    renderCount.current += 1;
    const renderEnd = performance.now();
    const duration = renderEnd - renderStart.current;

    // Atualizar métricas
    renderTimes.current.push(duration);
    
    // Manter apenas últimos 100 renders para cálculo de média
    if (renderTimes.current.length > 100) {
      renderTimes.current.shift();
    }

    const averageTime = 
      renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length;

    metrics.current = {
      renderCount: renderCount.current,
      renderTime: renderEnd,
      lastRenderDuration: duration,
      averageRenderTime: averageTime,
    };

    // Log se render foi lento
    if (duration > threshold) {
      const warning = `⚠️ [Performance] ${componentName}: Render lento (${duration.toFixed(2)}ms)`;
      
      if (logToConsole) {
        console.warn(warning, {
          renderCount: renderCount.current,
          averageTime: averageTime.toFixed(2) + 'ms',
          threshold: threshold + 'ms',
        });
      }

      onSlowRender?.(metrics.current);
    }

    // Log periódico a cada 50 renders
    if (logToConsole && renderCount.current % 50 === 0) {
      console.log(`📊 [Performance] ${componentName}:`, {
        totalRenders: renderCount.current,
        averageTime: averageTime.toFixed(2) + 'ms',
        lastRender: duration.toFixed(2) + 'ms',
      });
    }
  });

  return metrics.current;
}

/**
 * Hook para medir tempo de execução de funções
 * 
 * @example
 * ```tsx
 * const measureTime = usePerformanceMeasure('ExpensiveCalculation');
 * 
 * const result = measureTime(() => {
 *   // cálculo pesado
 *   return heavyCalculation();
 * });
 * ```
 */
export function usePerformanceMeasure(
  measureName: string,
  options: { threshold?: number; logToConsole?: boolean } = {}
) {
  const { threshold = 100, logToConsole = import.meta.env.DEV } = options;

  return useCallback(
    <T,>(fn: () => T): T => {
      const start = performance.now();
      const result = fn();
      const duration = performance.now() - start;

      if (duration > threshold && logToConsole) {
        console.warn(
          `⚠️ [Performance] ${measureName}: ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`
        );
      }

      return result;
    },
    [measureName, threshold, logToConsole]
  );
}

/**
 * Hook para detectar re-renders desnecessários
 * 
 * Compara props e state entre renders e loga quando mudanças ocorrem
 * 
 * @example
 * ```tsx
 * function MyComponent({ userId, data }) {
 *   useWhyDidYouUpdate('MyComponent', { userId, data });
 *   // ...
 * }
 * ```
 */
export function useWhyDidYouUpdate(
  componentName: string,
  props: Record<string, any>
): void {
  const previousProps = useRef<Record<string, any>>();

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps: Record<string, { from: any; to: any }> = {};

      allKeys.forEach((key) => {
        if (previousProps.current![key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current![key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        console.log(`🔄 [Why Update] ${componentName}:`, changedProps);
      }
    }

    previousProps.current = props;
  });
}
