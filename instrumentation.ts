import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel('konfera-app');
}

// Request error handler for monitoring and logging
export function onRequestError(error: Error, request: Request) {
  console.error('[Request Error]', {
    method: request.method,
    url: request.url,
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });
}

// Optional: Add additional instrumentation configuration
if (process.env.NODE_ENV === 'production') {
  // Production-specific instrumentation
  console.log('[Instrumentation] Telemetry enabled for production');
}
