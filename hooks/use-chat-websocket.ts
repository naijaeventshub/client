'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSessionContext } from '@/lib/context/SessionContext';

export interface ChatMessage {
  type:
    | 'message'
    | 'message_ack'
    | 'typing'
    | 'typing_stop'
    | 'user_status'
    | 'error';
  message_id?: string;
  user_id?: string;
  to_user_id?: string;
  content?: string;
  message_type?: string;
  timestamp?: number;
  status?: string;
  error?: string;
}

export interface UseChatWebSocketOptions {
  recipientId?: string;
  onMessage?: (message: ChatMessage) => void;
  onError?: (error: Error) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
}

export function useChatWebSocket(options: UseChatWebSocketOptions = {}) {
  const { session } = useSessionContext();
  const wsRef = useRef<WebSocket | null>(null);
  const connectRef = useRef<(() => void) | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 1000;

  const connect = useCallback(() => {
    if (!session?.user?.id) {
      console.warn('Cannot connect: No user session');
      return;
    }

    // Determine WebSocket URL
    // In production, WebSocket should go through nginx proxy
    // For local development, connect directly to notifications service
    let wsUrl: string;
    if (process.env.NEXT_PUBLIC_WS_URL) {
      wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    } else if (typeof window !== 'undefined') {
      // Use same protocol and host as current page, but different port for local dev
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsHost = window.location.hostname;
      const wsPort = process.env.NEXT_PUBLIC_WS_PORT || '8080';
      wsUrl = `${wsProtocol}//${wsHost}:${wsPort}`;
    } else {
      wsUrl = 'ws://localhost:8080';
    }

    console.log('Attempting to connect to WebSocket at:', wsUrl);

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;

        // Authenticate user
        ws.send(
          JSON.stringify({
            type: 'auth',
            user_id: session.user.id,
            timestamp: Date.now(),
          })
        );

        options.onConnected?.();
      };

      ws.onmessage = (event) => {
        try {
          const message: ChatMessage = JSON.parse(event.data);

          if (message.type === 'error') {
            console.error('WebSocket error:', message.error);
            setError(new Error(message.error || 'Unknown error'));
            options.onError?.(new Error(message.error || 'Unknown error'));
          } else {
            options.onMessage?.(message);
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onerror = () => {
        // Only log first error attempt to avoid spam
        if (reconnectAttempts.current <= 1) {
          console.warn(
            'WebSocket connection failed - will continue with polling mode'
          );
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        options.onDisconnected?.();

        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current += 1;
          const delay =
            reconnectDelay * Math.pow(2, reconnectAttempts.current - 1);
          if (reconnectAttempts.current <= 2) {
            console.log(
              `WebSocket reconnecting in ${delay}ms (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`
            );
          }

          reconnectTimeoutRef.current = setTimeout(() => {
            connectRef.current?.();
          }, delay);
        } else {
          // Max reconnection attempts reached - continue with polling mode
          if (reconnectAttempts.current === maxReconnectAttempts) {
            console.warn(
              'WebSocket unavailable - chat will use polling mode via GraphQL'
            );
          }
        }
      };

      wsRef.current = ws;
    } catch (_err) {
      if (reconnectAttempts.current <= 1) {
        console.warn(
          'WebSocket connection attempt failed - will retry with exponential backoff'
        );
      }
      // Don't set error state - allow graceful degradation to polling mode
    }
  }, [session, options]);

  // Store connect function in ref so it can be called from within itself
  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
  }, []);

  const sendMessage = useCallback(
    (message: Omit<ChatMessage, 'type' | 'timestamp'>) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        console.error('WebSocket is not connected');
        return false;
      }

      if (!session?.user?.id) {
        console.error('Cannot send message: No user session');
        return false;
      }

      try {
        const fullMessage: ChatMessage = {
          ...message,
          type: 'message',
          user_id: session.user.id,
          timestamp: Date.now(),
        };

        wsRef.current.send(JSON.stringify(fullMessage));
        return true;
      } catch (err) {
        console.error('Failed to send message:', err);
        return false;
      }
    },
    [session]
  );

  const sendTyping = useCallback(
    (recipientId: string) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        return false;
      }

      if (!session?.user?.id) {
        return false;
      }

      try {
        wsRef.current.send(
          JSON.stringify({
            type: 'typing',
            user_id: session.user.id,
            to_user_id: recipientId,
            timestamp: Date.now(),
          })
        );
        return true;
      } catch (err) {
        console.error('Failed to send typing indicator:', err);
        return false;
      }
    },
    [session]
  );

  const sendTypingStop = useCallback(
    (recipientId: string) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        return false;
      }

      if (!session?.user?.id) {
        return false;
      }

      try {
        wsRef.current.send(
          JSON.stringify({
            type: 'typing_stop',
            user_id: session.user.id,
            to_user_id: recipientId,
            timestamp: Date.now(),
          })
        );
        return true;
      } catch (err) {
        console.error('Failed to send typing stop:', err);
        return false;
      }
    },
    [session]
  );

  useEffect(() => {
    if (session?.user?.id) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [session?.user?.id, connect, disconnect]);

  return {
    isConnected,
    error,
    sendMessage,
    sendTyping,
    sendTypingStop,
    connect,
    disconnect,
  };
}
