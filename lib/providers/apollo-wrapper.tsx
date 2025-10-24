'use client';

import { ApolloNextAppProvider } from '@apollo/client-integration-nextjs';
import apolloClient from '@/lib/api/apollo-client';
import type React from 'react';

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ApolloNextAppProvider makeClient={() => apolloClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
