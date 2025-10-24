import { ApolloClient, InMemoryCache } from '@apollo/client-integration-nextjs';
import { split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { SetContextLink } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs';
import { getSession } from 'next-auth/react';

const PUBLIC_OPERATIONS = [
  'login',
  'InitiateRegistration',
  'ResendOTP',
  'VerifyRegistrationEmail',
  'CompleteRegistration',
];
const GRAPHQL_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${process.env.NEXT_PUBLIC_API_GRAPHQL_PATH || 'graphql'}`;
const GRAPHQL_WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ||
  (typeof window !== 'undefined'
    ? `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/graphql`
    : 'ws://localhost:8000/graphql');

const authLink = new SetContextLink(async (prevContext) => {
  const session = await getSession();
  const token = session?.accessToken || null;
  return {
    headers: {
      ...prevContext.headers,
      'x-apollo-operation-name': 'konfera',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
});

const httpUploadLink = new UploadHttpLink({
  uri: GRAPHQL_URL,
  credentials: 'include',
});

const authHttpLink = split(
  (operation) => !PUBLIC_OPERATIONS.includes(operation.operationName || ''),
  authLink.concat(httpUploadLink),
  httpUploadLink
);

let link = authHttpLink;

if (typeof window !== 'undefined') {
  const wsLink = new GraphQLWsLink(
    createClient({
      url: GRAPHQL_WS_URL,
      connectionParams: async () => {
        const session = await getSession();
        const token = session?.accessToken || null;
        return {
          authorization: token ? `Bearer ${token}` : undefined,
        };
      },
    })
  );

  link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    authHttpLink
  );
}

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

export default apolloClient;
