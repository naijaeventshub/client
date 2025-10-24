# Google Authentication Integration Guide

## Overview

Google OAuth authentication is fully integrated into the `/auth/login` page using NextAuth.js. Users can sign in with their Google account, and their profile is automatically created with verified email status.

## Architecture

### Authentication Flow

```
User clicks Google Sign-In
         ↓
NextAuth intercepts OAuth callback
         ↓
Frontend extracts profile data (email, name, picture)
         ↓
GraphQL socialAuth mutation sends profile data to backend
         ↓
Backend creates/links user account & sets verified=true
         ↓
Backend returns full user object with roles & permissions
         ↓
Frontend stores user in session
         ↓
User redirected to dashboard
```

## Implementation Details

### 1. Frontend Flow ([client/lib/api/auth.ts](client/lib/api/auth.ts))

#### Social Auth Providers

- Google Provider with OAuth credentials
- Facebook Provider (configured for future use)

#### Sign-In Callback

When a social provider returns a profile, the `signIn` callback:

1. Extracts profile data (email, name, picture) from NextAuth
2. Calls `authenticateSocialWithGraphQL()` to sync with backend
3. Stores the complete user object (including roles & permissions) in the session
4. Returns `true` to allow sign-in

```typescript
async signIn({ user, account, profile }) {
  if (account?.provider === 'google' || account?.provider === 'facebook') {
    const socialResult = await authenticateSocialWithGraphQL({
      provider: account.provider.toUpperCase(),
      email: profile?.email,
      first_name: profile?.given_name || profile?.first_name || '',
      last_name: profile?.family_name || profile?.last_name || '',
      image: profile?.picture,
      socialProviderId: account.providerAccountId,
    });

    if (socialResult?.token && socialResult?.user) {
      authToken = socialResult.token;
      Object.assign(user, socialResult.user);
    }
    return true;
  }
  return true;
}
```

### 2. GraphQL Mutation ([client/graphql/mutations/login.ts](client/graphql/mutations/login.ts))

The `socialAuth` mutation sends profile data to the backend and returns complete user details:

```graphql
mutation SocialAuth($input: SocialAuthInput!) {
  socialAuth(input: $input) {
    accessToken
    user {
      id
      email
      first_name
      last_name
      image
      username
      roles {
        name
      }
      allPermissions {
        name
      }
    }
  }
}
```

### 3. Backend Processing ([api/src/modules/auth/social-auth.service.ts](api/src/modules/auth/social-auth.service.ts))

#### User Creation/Linking

When `authenticateSocialUser()` is called with profile data:

1. **Check if user exists by social ID** - If found, user already linked
2. **Check if user exists by email** - If found, link the social account:
   - Set `socialId` and `socialProvider`
   - Set `isVerified = true`
   - Save Google picture if user has no image
3. **Create new user if needed**:
   - Mark as verified (no email confirmation needed)
   - Create username from email prefix
   - Save Google picture as profile image
   - Grant USER role by default

#### Key Features

- ✅ No email verification required (OAuth provider already verified)
- ✅ Google picture automatically saved as user image
- ✅ Existing users can link their Google account
- ✅ Returns complete user object with roles & permissions

### 4. Session Storage

Both JWT and Session callbacks ensure social auth users have complete data:

```typescript
async jwt({ token, user, account }) {
  if (user) {
    Object.assign(token, {
      user: user,
      accessToken: authToken,
      provider: account?.provider,
    });
  }
  return token;
}

async session({ session, token }) {
  Object.assign(session, {
    user: token.user,
    accessToken: token.accessToken,
    provider: token.provider,
  });
  return session;
}
```

## Environment Variables

### Required for Google OAuth

```env
# Client-side
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id
NEXTAUTH_URL=http://localhost:3000  # or https://yourdomain.com

# Server-side
GOOGLE_CLIENT_SECRET=your_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
```

## Database Schema

### User Entity Fields

```typescript
// Auto-populated from Google OAuth
socialId: string; // Google user ID
socialProvider: string; // 'google' or 'facebook'
email: string; // From OAuth provider
first_name: string; // From OAuth provider
last_name: string; // From OAuth provider
image: string; // Google profile picture
isVerified: boolean = true; // Always true for social auth
```

## Security Considerations

✅ **Email Verification**: Not required (OAuth provider verified)
✅ **Profile Completeness**: Picture auto-saved, name required
✅ **Account Linking**: Existing users can link social accounts
✅ **Role Management**: Default USER role, escalation handled separately
✅ **Token Management**: JWT stored in session, no client-side exposure

## Troubleshooting

### Issue: "Fragment UserFields cannot be spread here"

**Solution**: Ensure backend returns `User` type, not `SocialAuthUserResponse`

### Issue: "invalid_client" or 502 Bad Gateway

**Solution**: Check CORS middleware settings and ensure API is accessible

### Issue: User created but no picture

**Solution**: Ensure `image`/`photo` field is properly passed through the chain

## Testing

To test the flow locally:

1. Set up Google OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/)
2. Add `http://localhost:3000` to authorized origins
3. Set environment variables in `.env.local`
4. Start the development server
5. Click "Sign in with Google" and complete OAuth flow

Expected behavior:

- User is created if new, or existing user is verified
- Profile picture is saved
- Full user data with roles appears in session
- User is redirected to dashboard

2. **Update Environment Variables:**

   ```env
   # Production URLs
   NEXTAUTH_URL=https://yourdomain.com

   # Production Google credentials
   GOOGLE_CLIENT_ID=your-production-client-id
   GOOGLE_CLIENT_SECRET=your-production-client-secret
   ```

3. **Security Checklist:**
   - Never commit secrets to version control
   - Use environment variable management system (AWS Secrets Manager, HashiCorp Vault, etc.)
   - Enable HTTPS for all OAuth redirects
   - Rotate credentials regularly

## Troubleshooting

### Google Sign-In button not appearing

- Verify `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set correctly
- Check browser console for errors
- Ensure `GoogleOAuthProvider` wrapper is rendering

### "Google login failed" error

- Check network tab for OAuth requests
- Verify credentials in environment variables
- Ensure redirect URI matches Google OAuth settings
- Check browser DevTools console for specific errors

### Session not persisting

- Verify `NEXTAUTH_SECRET` is set
- Check NextAuth route at `/api/auth/[...nextauth]`
- Verify session strategy is JWT in auth config

## Future Enhancements

- Add Apple Sign-In (already partially configured)
- Add LinkedIn OAuth integration
- Add multi-factor authentication (MFA)
- Add social profile sync to user database
- Add manual account linking between OAuth and email login

## Related Files

- [LoginForm Component](client/app/auth/login/LoginForm.tsx)
- [NextAuth Configuration](client/lib/api/auth.ts)
- [NextAuth Route Handler](client/app/api/auth/[...nextauth]/route.ts)
- [Environment Configuration](client/.env.local)
- [Login Hook](client/hooks/admin/useLogin.tsx)
