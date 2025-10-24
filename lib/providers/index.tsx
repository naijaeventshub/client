'use client';

import { DeleteModalProvider } from '@/lib/providers/delete-modal-context';
import { ApolloWrapper } from '@/lib/providers/apollo-wrapper';
import { store } from '@/store';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { SessionProvider } from '@/lib/context/SessionContext';
import type React from 'react';
import { Provider as ReduxProvider } from 'react-redux';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <ApolloWrapper>
        <NextAuthSessionProvider
          refetchInterval={0}
          refetchOnWindowFocus={false}
        >
          <SessionProvider>
            <DeleteModalProvider>{children}</DeleteModalProvider>
          </SessionProvider>
        </NextAuthSessionProvider>
      </ApolloWrapper>
    </ReduxProvider>
  );
}
