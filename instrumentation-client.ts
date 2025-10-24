import { context, trace, metrics } from '@opentelemetry/api';

/**
 * Client-side instrumentation utilities for monitoring and observability
 */

const tracer = trace.getTracer('konfera-app-client');
// Note: meter is kept for future metrics implementation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const meter = metrics.getMeter('konfera-app-client');

/**
 * Create a span for tracking an operation
 */
export function createSpan(
  name: string,
  attributes?: Record<string, string | number | boolean>
) {
  return tracer.startSpan(name, {
    attributes,
  });
}

/**
 * Track an async operation with automatic span management
 */
export async function trackAsync<T>(
  operationName: string,
  fn: () => Promise<T>,
  attributes?: Record<string, string | number | boolean>
): Promise<T> {
  const span = createSpan(operationName, attributes);

  return context.with(trace.setSpan(context.active(), span), async () => {
    try {
      const result = await fn();
      span.setStatus({ code: 0 }); // OK
      return result;
    } catch (error) {
      span.setStatus({
        code: 2, // ERROR
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      span.recordException(error as Error);
      throw error;
    } finally {
      span.end();
    }
  });
}

/**
 * Track a synchronous operation with automatic span management
 */
export function trackSync<T>(
  operationName: string,
  fn: () => T,
  attributes?: Record<string, string | number | boolean>
): T {
  const span = createSpan(operationName, attributes);

  return context.with(trace.setSpan(context.active(), span), () => {
    try {
      const result = fn();
      span.setStatus({ code: 0 }); // OK
      return result;
    } catch (error) {
      span.setStatus({
        code: 2, // ERROR
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      span.recordException(error as Error);
      throw error;
    } finally {
      span.end();
    }
  });
}

/**
 * Log an event to the current span
 */
export function logEvent(
  name: string,
  attributes?: Record<string, string | number | boolean>
): void {
  const span = trace.getActiveSpan();
  if (span) {
    span.addEvent(name, attributes);
  }
}

/**
 * Record a metric value
 */

export function recordMetric(metricName: string): void {
  try {
    // Metrics recording logic would go here
    // This is a placeholder for future implementation
  } catch (error) {
    console.error(
      `[Instrumentation] Failed to record metric ${metricName}:`,
      error
    );
  }
}

/**
 * Add custom attributes to the current span
 */
export function addSpanAttribute(
  key: string,
  value: string | number | boolean
): void {
  const span = trace.getActiveSpan();
  if (span) {
    span.setAttribute(key, value);
  }
}

/**
 * Track API call with automatic timing and error handling
 */
export async function trackApiCall(
  method: string,
  url: string,
  options?: RequestInit
): Promise<Response> {
  return trackAsync(
    `api.${method.toLowerCase()}`,
    async () => {
      const startTime = performance.now();
      const response = await fetch(url, options);
      const duration = performance.now() - startTime;

      addSpanAttribute('http.method', method);
      addSpanAttribute('http.url', url);
      addSpanAttribute('http.status_code', response.status);
      addSpanAttribute('http.duration_ms', Math.round(duration));

      if (!response.ok) {
        logEvent('api_error', {
          status: response.status,
          statusText: response.statusText,
        });
      }

      return response;
    },
    {
      'http.method': method,
      'http.url': url,
    }
  );
}

/**
 * Initialize client-side instrumentation
 */
export function initializeClientInstrumentation(): void {
  // Set up global error handler
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      trackSync('global_error', () => {
        logEvent('unhandled_error', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        });
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      trackSync('unhandled_promise_rejection', () => {
        logEvent('promise_rejection', {
          reason: event.reason?.message || String(event.reason),
        });
      });
    });
  }
}

export default {
  createSpan,
  trackAsync,
  trackSync,
  logEvent,
  recordMetric,
  addSpanAttribute,
  trackApiCall,
  initializeClientInstrumentation,
} as const;
