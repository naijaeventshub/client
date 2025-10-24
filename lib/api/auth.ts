/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '@/types/user';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { apiClient } from './api-client';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import apolloClient from './apollo-client';
import {
  LOGIN_MUTATION,
  LoginResponse,
  SOCIAL_AUTH_MUTATION,
  SocialAuthResponse,
} from '@/graphql/mutations/login';

const AUTH_METHOD = process.env.NEXT_PUBLIC_AUTH_METHOD || 'api-client';

// Store token temporarily for use in callbacks
let authToken: string | null = null;

async function authenticateWithApiClient(email: string, password: string) {
  const { data } = await apiClient.post<{
    item: { user: User; token: string };
  }>('/auth/login', {
    email,
    password,
  });

  const { user, token } = data.item;
  if (user && token) {
    return { user, token };
  } else {
    throw new Error('Invalid credentials');
  }
}

async function authenticateWithGraphQL(email: string, password: string) {
  try {
    const { data } = await apolloClient.mutate<LoginResponse>({
      mutation: LOGIN_MUTATION,
      variables: { email, password },
    });

    if (data?.login?.accessToken && data?.login?.user) {
      return {
        user: data.login.user,
        token: data.login.accessToken,
      };
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error: any) {
    console.error('GraphQL authentication error:', error);
    throw new Error(
      error?.message ||
        error?.graphQLErrors?.[0]?.message ||
        'Authentication failed'
    );
  }
}

// Social auth helpers
async function authenticateSocialWithGraphQL(input: {
  provider: string;
  email: string;
  first_name: string;
  last_name: string;
  image?: string;
  socialProviderId: string;
}) {
  try {
    const result = await apolloClient.mutate<SocialAuthResponse>({
      mutation: SOCIAL_AUTH_MUTATION,
      variables: { input },
    });

    if (result.data?.socialAuth?.accessToken && result.data.socialAuth.user) {
      return {
        user: result.data.socialAuth.user,
        token: result.data.socialAuth.accessToken,
      };
    }

    throw new Error('Social GraphQL authentication failed');
  } catch (error: any) {
    console.error('Social GraphQL auth error:', error);
    throw error;
  }
}

async function authenticateSocialWithApi(
  profile: any,
  account: any
): Promise<{ user: User; token: string }> {
  try {
    const payload = {
      provider: account.provider,
      email: profile?.email || '',
      first_name: profile?.given_name || profile?.first_name || '',
      last_name: profile?.family_name || profile?.last_name || '',
      image: profile?.picture,
      socialProviderId: account.providerAccountId,
    };

    const { data } = await apiClient.post<{
      item: { user: User; token: string };
    }>('/auth/social-login', payload);
    const item = data?.item;
    if (item?.token && item?.user) {
      return { user: item.user, token: item.token };
    }

    throw new Error('Social API authentication failed');
  } catch (error: any) {
    console.error('Social API auth error:', error);
    throw error;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    FacebookProvider({
      clientId: `${process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID}`,
      clientSecret: `${process.env.FACEBOOK_CLIENT_SECRET}`,
    }),
    GoogleProvider({
      clientId: `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          let user, token;

          if (AUTH_METHOD === 'graphql') {
            const result = await authenticateWithGraphQL(
              credentials.email,
              credentials.password
            );
            user = result.user;
            token = result.token;
          } else {
            // Default to api-client
            const result = await authenticateWithApiClient(
              credentials.email,
              credentials.password
            );
            user = result.user;
            token = result.token;
          }

          // Store token for JWT callback
          authToken = token;

          // Return only user object (next-auth expects User | null)
          return user;
        } catch (error: any) {
          console.error('Authorization error:', error);
          throw new Error(error?.message || 'Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // Use stored auth token or try to get from user object
        const accessToken = authToken || (user as any).accessToken;
        Object.assign(token, {
          user: user as any,
          accessToken,
          provider: account?.provider,
        });
        authToken = null; // Clear after use
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        Object.assign(session, {
          user: token.user,
          accessToken: token.accessToken,
          provider: token.provider,
        });
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Handle OAuth providers (Google, Facebook)
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        try {
          const oauthProfile = profile as Record<string, any> | undefined;
          console.log(
            `${account.provider} sign-in attempt:`,
            oauthProfile?.email
          );

          // Use configured auth method to sync with backend
          let socialResult: { user?: User; token?: string } | null = null;

          if (AUTH_METHOD === 'graphql') {
            socialResult = await authenticateSocialWithGraphQL({
              provider: account.provider.toUpperCase(),
              email: oauthProfile?.email || '',
              first_name:
                oauthProfile?.given_name || oauthProfile?.first_name || '',
              last_name:
                oauthProfile?.family_name || oauthProfile?.last_name || '',
              image: oauthProfile?.picture,
              socialProviderId: account.providerAccountId,
            });
          } else {
            socialResult = await authenticateSocialWithApi(profile, account);
          }

          if (socialResult?.token && socialResult?.user) {
            authToken = socialResult.token;
            Object.assign(user, socialResult.user);
            console.log(
              `${account.provider} user synced with API successfully`
            );
          }

          return true;
        } catch (error) {
          console.error(`${account.provider} sign-in error:`, error);
          // Block sign-in if API sync fails
          return false;
        }
      }
      // Allow sign in for all users - role checking will be done in components
      return true;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
