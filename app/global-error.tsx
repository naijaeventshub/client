'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('[Global Error]', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    });

    // Send to external error tracking service (e.g., Sentry, DataDog, etc.)
    if (process.env.NEXT_PUBLIC_ERROR_TRACKING_ENABLED === 'true') {
      // Placeholder for error tracking integration
      // Example: Sentry.captureException(error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '20px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            backgroundColor: '#f8f9fa',
          }}
        >
          <div
            style={{
              maxWidth: '500px',
              width: '100%',
              padding: '40px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#ef4444',
                margin: '0 0 16px 0',
              }}
            >
              Something went wrong
            </h1>

            <p
              style={{
                fontSize: '16px',
                color: '#666',
                marginBottom: '24px',
                lineHeight: '1.6',
              }}
            >
              An unexpected error occurred. Our team has been notified and is
              working to fix the issue.
            </p>

            {error.message && (
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: '4px',
                  marginBottom: '24px',
                  fontSize: '14px',
                  color: '#991b1b',
                }}
              >
                <strong>Error:</strong> {error.message}
              </div>
            )}

            {error.digest && (
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '4px',
                  marginBottom: '24px',
                  fontSize: '12px',
                  color: '#6b7280',
                  wordBreak: 'break-all',
                }}
              >
                <strong>Error ID:</strong> {error.digest}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => reset()}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = '#2563eb')
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = '#3b82f6')
                }
              >
                Try again
              </button>

              <button
                onClick={() => (window.location.href = '/')}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  backgroundColor: '#e5e7eb',
                  color: '#1f2937',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = '#d1d5db')
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = '#e5e7eb')
                }
              >
                Go home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
