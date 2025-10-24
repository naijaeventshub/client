'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';

interface SessionContextType {
  session: Session | null;
  status: 'authenticated' | 'loading' | 'unauthenticated';
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const value: SessionContextType = {
    session: session || null,
    status:
      (status as 'authenticated' | 'loading' | 'unauthenticated') || 'loading',
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessionContext must be used within SessionProvider');
  }
  return context;
}
