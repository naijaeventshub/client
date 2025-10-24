# Authentication & Authorization Guide

## Overview

The Event platform implements a comprehensive authentication and authorization system using Next.js, Next-Auth, and a custom permission-based access control (PBAC) layer. This guide covers the complete flow from JWT token management to component-level permission checking.

### Key Components

- **next-auth**: Session and JWT token management
- **Route Permissions System** (`lib/route-permissions.ts`): Central permission configuration
- **Proxy Middleware** (`proxy.ts`): Route protection at middleware level
- **API Guards**: Backend role and permission validation (RolesGuard, PermissionsGuard, JwtAuthGuard)

---

## Part 1: Next-Auth Configuration

### Setup Location

Authentication configuration is located at `lib/api/auth.ts` and is registered in `app/api/auth/[...nextauth]/route.ts`.

### Configuration File Structure

```typescript
// lib/api/auth.ts
export const authOptions: NextAuthOptions = {
  providers: [...],
  callbacks: {...},
  pages: {...},
  session: {...},
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
```

### Authentication Providers

#### 1. Social Providers (OAuth)

```typescript
(FacebookProvider({
  clientId: `${process.env.FACEBOOK_CLIENT_ID}`,
  clientSecret: `${process.env.FACEBOOK_CLIENT_SECRET}`,
}),
  GoogleProvider({
    clientId: `${process.env.GOOGLE_CLIENT_ID}`,
    clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
  }));
```

**Configuration:**

- OAuth 2.0 integration for Google and Facebook sign-in
- Requires valid client ID and client secret
- Social accounts are linked to user profiles on first sign-in

#### 2. Credentials Provider

```typescript
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
    // Authentication logic...
  },
});
```

**Features:**

- Email/password authentication
- Supports both API client and GraphQL authentication methods
- Configurable via `NEXT_PUBLIC_AUTH_METHOD` environment variable
- Defaults to `'api-client'` if not specified

### Authentication Methods

#### API Client Method (Default)

```typescript
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
```

**When to use:**

- Direct REST API authentication
- Simple username/email + password flow
- Endpoint: `POST /auth/login`

#### GraphQL Method

```typescript
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
```

**When to use:**

- When using Apollo Client with GraphQL backend
- Need to set `NEXT_PUBLIC_AUTH_METHOD=graphql` in environment
- Returns both user object and access token from GraphQL mutation

### Session Configuration

```typescript
session: {
  strategy: 'jwt',
  maxAge: 24 * 60 * 60, // 24 hours
}
```

**Key Points:**

- Uses JWT strategy (tokens stored in cookies)
- Sessions expire after 24 hours
- Token-based authentication (stateless)

### Next-Auth Callbacks

#### JWT Callback

```typescript
async jwt({ token, user }) {
  if (user) {
    // Use stored auth token or try to get from user object
    const accessToken = authToken || (user as any).accessToken;
    Object.assign(token, {
      user: user as any,
      accessToken,
    });
    authToken = null; // Clear after use
  }
  return token;
}
```

**Purpose:**

- Called whenever JWT is created or updated
- Stores user object and access token in JWT
- Clears temporary auth token variable after use

**Flow:**

1. When user logs in, `authorize()` stores token in `authToken` variable
2. JWT callback reads `authToken` and stores it in JWT
3. `authToken` is cleared for memory efficiency

#### Session Callback

```typescript
async session({ session, token }) {
  if (token) {
    Object.assign(session, {
      user: token.user,
      accessToken: token.accessToken,
    });
  }
  return session;
}
```

**Purpose:**

- Called whenever session is retrieved
- Populates session object with user and token data
- Makes data available in components via `useSession()`

#### SignIn Callback

```typescript
async signIn({ user, account, profile }) {
  // Handle OAuth providers (Google, Facebook)
  if (account?.provider === 'google' || account?.provider === 'facebook') {
    try {
      console.log(`${account.provider} sign-in attempt:`, profile?.email);

      // Sync social auth with backend
      let socialResult: { user?: User; token?: string } | null = null;

      if (AUTH_METHOD === 'graphql') {
        socialResult = await authenticateSocialWithGraphQL({
          provider: account.provider.toUpperCase(),
          email: profile?.email,
          first_name: profile?.given_name || profile?.first_name || '',
          last_name: profile?.family_name || profile?.last_name || '',
          image: profile?.picture,
          socialProviderId: account.providerAccountId,
        });
      } else {
        socialResult = await authenticateSocialWithApi(profile, account);
      }

      if (socialResult?.token && socialResult?.user) {
        authToken = socialResult.token;
        // Store complete user object from backend
        Object.assign(user, socialResult.user);
      }
      return true;
    } catch (error) {
      console.error(`${account.provider} sign-in error:`, error);
      return false;
    }
  }

  // Allow sign in for other providers - role checking done at component level
  return true;
}
```

**Purpose:**

- Handles both social OAuth and credential-based sign-ins
- For OAuth: Syncs with backend via GraphQL/REST API
- Stores complete user object (with roles & permissions) for session
- Role/permission validation happens at middleware and component levels

**Social Auth Flow:**

1. OAuth provider returns profile (email, name, picture)
2. Backend creates/links user account via `socialAuth` mutation
3. Backend verifies email automatically (OAuth provider verified)
4. Full user object returned with roles and permissions
5. User data merged into session for consistent access control

### Authentication Pages

```typescript
pages: {
  signIn: '/auth/login',
  error: '/auth/login',
}
```

**Pages:**

- **signIn**: Redirect destination for unauthenticated users (`/auth/login`)
- **error**: Error page for authentication failures (`/auth/login`)

---

## Part 2: JWT Token Flow

### Token Lifecycle

```
1. User Credentials → Authenticate → Get Token
                           ↓
2. Store in JWT via Callback → Add to Session
                           ↓
3. Middleware Validates JWT → getToken()
                           ↓
4. Permission Checks → Extract User Permissions
                           ↓
5. Allowed → Proceed or Blocked → Redirect
```

### Token Storage

- **Location**: Secure HTTP-only Cookie
- **Name**: `next-auth.session-token`
- **Expiry**: 24 hours (configurable via `maxAge`)

### Token Retrieval

```typescript
import { getToken } from 'next-auth/jwt';

const token = await getToken({
  req,
  secret: process.env.NEXTAUTH_SECRET,
});

// Token contains: { user: {...}, accessToken: "..." }
```

**Usage in Middleware:**

- Retrieves token without database lookup
- Validates JWT signature
- Returns null if invalid or expired

---

## Part 2.5: Social Authentication (OAuth)

### Overview

Social authentication via Google and Facebook allows users to sign in using existing accounts without creating new credentials. Users are automatically created and verified upon first sign-in.

### Supported Providers

- **Google**: Full integration with profile picture auto-save
- **Facebook**: Configured for future use

### User Creation on First Sign-In

When a user signs in with a social provider for the first time:

1. **Profile Data Extracted**: email, name (first/last), picture
2. **User Created or Linked**:
   - If email exists: Link social account to existing user
   - If email new: Create new user with social account
3. **Email Verified**: `isVerified = true` (OAuth provider verified)
4. **Picture Saved**: Profile picture saved as user image if not already set
5. **Default Role**: USER role assigned (can be escalated separately)

### Backend Social Auth Mutation

```typescript
// From client/graphql/mutations/login.ts
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

**Input Data:**

- `provider`: 'GOOGLE' or 'FACEBOOK'
- `email`: User's email from OAuth provider
- `first_name`: User's first name
- `last_name`: User's last name
- `image`: Profile picture URL
- `socialProviderId`: Unique ID from OAuth provider

**Response:**

- `accessToken`: JWT for API authentication
- `user`: Complete user object with roles and permissions (same as credentials login)

### Consistency with Credentials Login

Social auth returns the same user structure as credentials login, ensuring:

- ✅ Session storage is identical
- ✅ Role-based access control works the same way
- ✅ Permissions are evaluated consistently
- ✅ No special handling needed in components

### Implementation Files

| File                                            | Purpose                                  |
| ----------------------------------------------- | ---------------------------------------- |
| `client/lib/api/auth.ts`                        | NextAuth signIn callback for social auth |
| `client/graphql/mutations/login.ts`             | GraphQL socialAuth mutation              |
| `api/src/modules/auth/social-auth.service.ts`   | Backend user creation/linking            |
| `api/src/modules/auth/dto/social-auth.input.ts` | Input/output DTOs                        |

````

---

## Part 3: Route Permissions System

### Overview

The route permissions system (`lib/route-permissions.ts`) provides centralized permission configuration for all routes, enabling dynamic access control based on user permissions.

### Interface Definition

```typescript
export interface RoutePermission {
  pattern: RegExp; // Route pattern matching
  href: string; // Route identifier
  permissions: string[]; // Required permissions
}
```

### Permission Configuration

#### Admin Dashboard Routes

```typescript
{
  href: '/admin/dashboard/users',
  pattern: /^\/admin\/dashboard\/users(\/.+)?$/,
  permissions: ['user:read'],
},
{
  href: '/admin/dashboard/team',
  pattern: /^\/admin\/dashboard\/team(\/.+)?$/,
  permissions: ['role:read'],
},
{
  href: '/admin/dashboard/events/management',
  pattern: /^\/admin\/dashboard\/events\/management(\/.+)?$/,
  permissions: ['event:read'],
},
```

#### User Dashboard Routes

```typescript
{
  href: '/dashboard',
  pattern: /^\/dashboard$/,
  permissions: [], // All authenticated users
},
{
  href: '/dashboard/users',
  pattern: /^\/dashboard\/users(\/.+)?$/,
  permissions: ['user:read'],
},
{
  href: '/dashboard/profile',
  pattern: /^\/dashboard\/profile$/,
  permissions: [], // All authenticated users
},
```

### Permission Naming Convention

Permissions follow a `resource:action` naming pattern:

- `user:read` - Read user information
- `user:create` - Create users
- `user:update` - Update user data
- `user:delete` - Delete users
- `role:read` - Read role information
- `event:read` - Read event data
- `admin:read` - General admin access
- `report:read` - Read reports
- `setting:read` - Read settings

### Helper Functions

#### 1. Check User Permissions

```typescript
export function hasRequiredPermissions(
  userPermissions: string[],
  requiredPermissions: string[]
): boolean {
  if (requiredPermissions.length === 0) {
    return true; // No permissions required
  }

  return requiredPermissions.some(
    (permission) =>
      userPermissions.includes(permission) || userPermissions.includes('*')
  );
}
```

**Usage:**

```typescript
const userPerms = ['user:read', 'user:update'];
const canAccess = hasRequiredPermissions(userPerms, ['user:read']);
// Returns: true

const canDelete = hasRequiredPermissions(userPerms, ['user:delete']);
// Returns: false
```

**Features:**

- Supports wildcard `'*'` for full access
- Returns `true` if any required permission matches
- Returns `true` if no permissions are required

#### 2. Extract User Permissions

```typescript
export function getUserPermissions(user: User): string[] {
  return (user?.allPermissions || []).map((permission: Permission) => {
    return permission.name;
  });
}
```

**Usage:**

```typescript
const session = await getSession();
const userPerms = getUserPermissions(session.user);
// Returns: ['user:read', 'user:update', 'role:read']
```

#### 3. Get Permissions for Path

```typescript
export function getPermissionsForPath(pathname: string): string[] {
  // First, try to find exact match
  const exactMatch = routePermissions.find((route) =>
    route.pattern.test(pathname)
  );
  if (exactMatch) {
    return exactMatch.permissions;
  }

  // If no exact match, find the closest parent route
  const pathSegments = pathname.split('/').filter(Boolean);
  let closestParent: RoutePermission | null = null;
  let maxMatchLength = 0;

  for (const route of routePermissions) {
    const routeSegments = route.href.split('/').filter(Boolean);

    if (pathSegments.length > routeSegments.length) {
      const isParent = routeSegments.every(
        (segment, index) => pathSegments[index] === segment
      );

      if (isParent && routeSegments.length > maxMatchLength) {
        closestParent = route;
        maxMatchLength = routeSegments.length;
      }
    }
  }

  return closestParent ? closestParent.permissions : [];
}
```

**Usage:**

```typescript
const perms1 = getPermissionsForPath('/admin/dashboard/users');
// Returns: ['user:read']

const perms2 = getPermissionsForPath('/admin/dashboard/users/123/edit');
// Returns: ['user:read'] (from parent route)

const perms3 = getPermissionsForPath('/dashboard');
// Returns: [] (no permissions required)
```

**Algorithm:**

1. First tries exact RegExp pattern match
2. Falls back to closest parent route matching
3. Finds the deepest matching parent route
4. Returns empty array if no match found

#### 4. Check Route Permission

```typescript
export function hasPermissionForRoute(
  routePath: string,
  userPermissions: { name: string }[] | undefined
): boolean {
  if (!userPermissions) {
    return false;
  }

  const routeConfig = routePermissions.find(
    (route) => route.href === routePath
  );

  if (!routeConfig) {
    return false;
  }

  const permissionNames = userPermissions.map((p) => p.name);

  return routeConfig.permissions.some((permission) =>
    permissionNames.includes(permission)
  );
}
```

**Usage:**

```typescript
const user = {
  allPermissions: [{ name: 'user:read' }, { name: 'user:update' }],
};

const canAccess = hasPermissionForRoute(
  '/admin/dashboard/users',
  user.allPermissions
);
// Returns: true

const canAccessTeam = hasPermissionForRoute(
  '/admin/dashboard/team',
  user.allPermissions
);
// Returns: false
```

---

## Part 3: Proxy Middleware

### Overview

The proxy middleware (`proxy.ts`) is a Next.js middleware that runs on every request to:

- Validate authentication status
- Manage route-based redirects
- Check permissions for protected routes
- Prevent unauthorized access

### Middleware Configuration

```typescript
export const config = {
  matcher: [
    '/auth/:path*',
    '/admin/auth/:path*',
    '/dashboard/:path*',
    '/admin/dashboard/:path*',
  ],
};
```

**Routes Protected:**

- `/auth/*` - Authentication pages
- `/admin/auth/*` - Admin authentication pages
- `/dashboard/*` - User dashboard pages
- `/admin/dashboard/*` - Admin dashboard pages

### Middleware Flow

```typescript
export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 1. Redirect authenticated users away from auth routes
  if (token && isAuthRoute(pathname)) {
    const redirectUrl = isAdminPath(pathname)
      ? '/admin/dashboard'
      : '/dashboard';
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  // 2. Redirect unauthenticated users away from dashboard routes
  if (!token && isDashboardRoute(pathname)) {
    const loginUrl = isAdminPath(pathname)
      ? '/admin/auth/login'
      : '/auth/login';
    return NextResponse.redirect(new URL(loginUrl, req.url));
  }

  // 3. Skip permission checks for no-permissions pages
  if (
    pathname === '/dashboard/no-permissions' ||
    pathname === '/admin/dashboard/no-permissions'
  ) {
    return NextResponse.next();
  }

  // 4. Check permissions for dashboard routes
  if (isDashboardRoute(pathname)) {
    const userPermissions = token?.user ? getUserPermissions(token.user) : [];
    const isAdmin = isAdminPath(pathname);

    if (userPermissions.length === 0) {
      return NextResponse.redirect(
        new URL('/dashboard/no-permissions', req.url)
      );
    }

    const requiredPermissions = getPermissionsForPath(pathname);
    if (!hasRequiredPermissions(userPermissions, requiredPermissions)) {
      const redirectUrl = isAdmin
        ? '/admin/dashboard/no-permissions'
        : '/dashboard/no-permissions';
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }
  }

  return NextResponse.next();
}
```

### Helper Functions

#### Route Type Detection

```typescript
const isAuthRoute = (pathname: string) =>
  pathname === '/auth' ||
  pathname.startsWith('/auth/') ||
  pathname === '/admin/auth' ||
  pathname.startsWith('/admin/auth/');

const isDashboardRoute = (pathname: string) =>
  pathname === '/dashboard' ||
  pathname.startsWith('/dashboard/') ||
  pathname === '/admin/dashboard' ||
  pathname.startsWith('/admin/dashboard/');

const isAdminPath = (pathname: string) => pathname.startsWith('/admin');
```

### Middleware Flow Steps

#### Step 1: Authenticated User on Auth Route

```typescript
if (token && isAuthRoute(pathname)) {
  // Redirect to dashboard
  const redirectUrl = isAdminPath(pathname) ? '/admin/dashboard' : '/dashboard';
  return NextResponse.redirect(new URL(redirectUrl, req.url));
}
```

**Scenario:** User tries to access `/auth/login` while already logged in
**Action:** Redirect to `/dashboard` (or `/admin/dashboard` for admin users)
**Purpose:** Prevent authenticated users from seeing login page

#### Step 2: Unauthenticated User on Dashboard Route

```typescript
if (!token && isDashboardRoute(pathname)) {
  // Redirect to login
  const loginUrl = isAdminPath(pathname) ? '/admin/auth/login' : '/auth/login';
  return NextResponse.redirect(new URL(loginUrl, req.url));
}
```

**Scenario:** User tries to access `/dashboard` without login
**Action:** Redirect to `/auth/login`
**Purpose:** Protect dashboard routes from unauthenticated access

#### Step 3: No-Permissions Pages Exception

```typescript
if (
  pathname === '/dashboard/no-permissions' ||
  pathname === '/admin/dashboard/no-permissions'
) {
  return NextResponse.next();
}
```

**Scenario:** User redirected to no-permissions page
**Action:** Allow access without further checks
**Purpose:** Prevent infinite redirect loops

#### Step 4: Permission Validation

```typescript
if (isDashboardRoute(pathname)) {
  const userPermissions = token?.user ? getUserPermissions(token.user) : [];
  const isAdmin = isAdminPath(pathname);

  if (userPermissions.length === 0) {
    return NextResponse.redirect(new URL('/dashboard/no-permissions', req.url));
  }

  const requiredPermissions = getPermissionsForPath(pathname);
  if (!hasRequiredPermissions(userPermissions, requiredPermissions)) {
    const redirectUrl = isAdmin
      ? '/admin/dashboard/no-permissions'
      : '/dashboard/no-permissions';
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }
}
```

**Scenarios:**

- User has no permissions at all → redirect to `/dashboard/no-permissions`
- User lacks specific permission → redirect to `/dashboard/no-permissions`
- User has permission → allow access with `NextResponse.next()`

### Permission Check Logic

```typescript
const userPermissions = token?.user ? getUserPermissions(token.user) : [];
const requiredPermissions = getPermissionsForPath(pathname);

if (!hasRequiredPermissions(userPermissions, requiredPermissions)) {
  // Redirect to appropriate no-permissions page
}
```

**Process:**

1. Extract user permissions from session token
2. Get required permissions for current path
3. Check if user has any required permission
4. Allow if match found, redirect otherwise

---

## Part 4: Backend Access Control

### Guard Implementation

The backend uses three guards to enforce authentication and authorization:

#### 1. JWT Auth Guard

```typescript
// jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if user is SUPER_ADMIN
    const user = context.switchToHttp().getRequest().user;
    if (user?.isSuperAdmin) {
      return true; // SUPER_ADMIN can access everything
    }

    // Normal JWT validation
    return super.canActivate(context);
  }
}
```

**Purpose:** Validate JWT token on protected resolvers
**SUPER_ADMIN Bypass:** SUPER_ADMIN users bypass token validation

#### 2. Roles Guard

```typescript
// roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if user is SUPER_ADMIN
    const user = context.switchToHttp().getRequest().user;
    if (user?.isSuperAdmin) {
      return true; // SUPER_ADMIN bypasses role checks
    }

    // Normal role validation
    const requiredRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler()
    );
    return user?.userRoles?.some((ur) => requiredRoles.includes(ur.role.name));
  }
}
```

**Usage:**

```typescript
@UseGuards(RolesGuard)
@SetMetadata('roles', ['admin', 'spacer'])
@Query(() => [User])
getAllUsers(): Promise<User[]> {
  // Only accessible to admin/spacer roles or SUPER_ADMIN
}
```

#### 3. Permissions Guard

```typescript
// permissions.guard.ts
@Injectable()
export class PermissionsGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if user is SUPER_ADMIN
    const user = context.switchToHttp().getRequest().user;
    if (user?.isSuperAdmin) {
      return true; // SUPER_ADMIN bypasses permission checks
    }

    // Normal permission validation
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler()
    );
    return user?.allPermissions?.some((p) =>
      requiredPermissions.includes(p.name)
    );
  }
}
```

**Usage:**

```typescript
@UseGuards(PermissionsGuard)
@SetMetadata('permissions', ['user:read', 'user:update'])
@Query(() => [User])
getAllUsers(): Promise<User[]> {
  // Only accessible to users with user:read or user:update permissions or SUPER_ADMIN
}
```

### SUPER_ADMIN Bypass

SUPER_ADMIN users automatically bypass all role and permission checks:

```typescript
if (user?.isSuperAdmin) {
  return true; // Complete bypass
}
```

**Features:**

- Full access to all endpoints
- No permission requirements
- No role restrictions
- Activated by `isSuperAdmin` flag on user object

---

## Part 5: Session Context API

### Overview

Event provides a React Context API wrapper around Next-Auth's session management for cleaner component integration. The `SessionContext` simplifies access to session data without directly importing `useSession` everywhere.

### SessionContext Setup

```typescript
// lib/context/SessionContext.tsx
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
        status: (status as 'authenticated' | 'loading' | 'unauthenticated') || 'loading',
    };

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSessionContext() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSessionContext must be used within SessionProvider');
    }
    return context;
}
```

### Context Type Definition

```typescript
interface SessionContextType {
  session: Session | null; // Authenticated session or null
  status:
    | 'authenticated' // User is logged in
    | 'loading' // Session is loading
    | 'unauthenticated'; // User is not logged in
}
```

### Using SessionContext in Components

#### Basic Usage

```typescript
'use client';

import { useSessionContext } from '@/lib/context/SessionContext';

export function UserDashboard() {
  const { session, status } = useSessionContext();

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') return <div>Not authenticated</div>;

  return (
    <div>
      <h1>Welcome, {session?.user?.first_name}</h1>
      <p>Email: {session?.user?.email}</p>
      <p>Permissions: {session?.user?.allPermissions?.map(p => p.name).join(', ')}</p>
    </div>
  );
}
```

#### Accessing Session Data

```typescript
const { session, status } = useSessionContext();

// User information
const userId = session?.user?.id;
const email = session?.user?.email;
const first_name = session?.user?.first_name;
const accountType = session?.user?.accountType; // 'user' | 'spacer' | 'host'

// Permissions
const permissions = session?.user?.allPermissions;
const roles = session?.user?.userRoles;

// Access token (for API calls)
const token = session?.accessToken;
```

#### Loading State Handling

```typescript
export function ProtectedComponent() {
  const { session, status } = useSessionContext();

  return (
    <>
      {status === 'loading' && <LoadingSpinner />}
      {status === 'authenticated' && (
        <div>
          <p>Hello, {session?.user?.first_name}!</p>
        </div>
      )}
      {status === 'unauthenticated' && <SignInPrompt />}
    </>
  );
}
```

### Comparison: useSession vs useSessionContext

#### Using Next-Auth's useSession

```typescript
import { useSession } from 'next-auth/react';

export function Component() {
  const { data: session, status } = useSession();
  // Use directly
}
```

**Pros:**

- Direct access to Next-Auth hook
- No additional wrapper
- Lighter weight

**Cons:**

- Requires Next-Auth import throughout app
- Less consistent naming (`data` vs `session`)

#### Using Event's useSessionContext

```typescript
import { useSessionContext } from '@/lib/context/SessionContext';

export function Component() {
  const { session, status } = useSessionContext();
  // Use directly
}
```

**Pros:**

- Cleaner API (`session` not `data`)
- Centralized session logic
- Consistent with Event patterns
- Easy to extend with additional features

**Cons:**

- Requires SessionProvider wrapper in app
- One additional component layer

### Provider Setup

The `SessionProvider` must wrap your app for `useSessionContext` to work:

```typescript
// app/layout.tsx
import { SessionProvider } from '@/lib/context/SessionContext';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NextAuthSessionProvider>
          <SessionProvider>
            {/* Your app routes */}
            {children}
          </SessionProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
```

---

## Part 6: Component-Level Usage

### Getting Current Session

**Method 1: Using Context API (Recommended)**

```typescript
'use client';

import { useSessionContext } from '@/lib/context/SessionContext';

export function UserDashboard() {
  const { session, status } = useSessionContext();

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') return <div>Not authenticated</div>;

  return (
    <div>
      <h1>Welcome, {session?.user?.first_name}</h1>
      <p>Email: {session?.user?.email}</p>
      <p>Permissions: {session?.user?.allPermissions?.map(p => p.name).join(', ')}</p>
    </div>
  );
}
```

**Method 2: Using Next-Auth Directly**

```typescript
'use client';

import { useSession } from 'next-auth/react';

export function UserDashboard() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') return <div>Not authenticated</div>;

  return (
    <div>
      <h1>Welcome, {session?.user?.first_name}</h1>
      <p>Email: {session?.user?.email}</p>
      <p>Permissions: {session?.user?.allPermissions?.map(p => p.name).join(', ')}</p>
    </div>
  );
}
```

### Session Data Structure

```typescript
{
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    profilePicture: string;
    accountType: 'user' | 'spacer' | 'host';
    isVerified: boolean;
    isSuspended: boolean;
    allPermissions: Permission[];
    userRoles: UserRole[];
    // ... other user fields
  };
  accessToken: string;
}
```

### Checking Permissions in Components

```typescript
'use client';

import { useSessionContext } from '@/lib/context/SessionContext';
import { hasPermissionForRoute, getUserPermissions } from '@/lib/route-permissions';

export function AdminUsersPanel() {
  const { session } = useSessionContext();

  // Check specific permission
  const canViewUsers = hasPermissionForRoute(
    '/admin/dashboard/users',
    session?.user?.allPermissions
  );

  // Get all user permissions
  const userPerms = getUserPermissions(session?.user);
  const canManageRoles = userPerms.includes('role:read');

  if (!canViewUsers) {
    return <div>You don't have permission to view users</div>;
  }

  return (
    <div>
      <h2>Users Management</h2>
      {canManageRoles && <RolesSection />}
      {/* ... */}
    </div>
  );
}
```

### Protected Component Wrapper

```typescript
'use client';

import { useSessionContext } from '@/lib/context/SessionContext';
import { hasRequiredPermissions, getUserPermissions } from '@/lib/route-permissions';

interface PermissionGuardProps {
  permissions: string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGuard({
  permissions,
  fallback = null,
  children
}: PermissionGuardProps) {
  const { session } = useSessionContext();
  const userPerms = getUserPermissions(session?.user);

  const hasAccess = hasRequiredPermissions(userPerms, permissions);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// Usage
<PermissionGuard permissions={['user:delete']}>
  <DeleteUserButton />
</PermissionGuard>

// With fallback
<PermissionGuard
  permissions={['report:read']}
  fallback={<div>Insufficient permissions</div>}
>
  <ReportsPanel />
</PermissionGuard>
```

---

## Part 7: Environment Configuration

### Required Environment Variables

```env
# Next-Auth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers (optional)
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Authentication Method
NEXT_PUBLIC_AUTH_METHOD=api-client  # or 'graphql'

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

### NEXTAUTH_SECRET Generation

```bash
# Generate a secure secret
openssl rand -base64 32
```

---

## Part 8: Common Workflows

### Workflow 1: User Login with Permission Extraction

```
1. User enters credentials on /auth/login
   ↓
2. CredentialsProvider.authorize() called
   ↓
3. authenticateWithGraphQL() or authenticateWithApiClient()
   ↓
4. User object and access token returned
   ↓
5. JWT callback stores token and user in JWT
   ↓
6. Session callback populates session with user/token
   ↓
7. JWT stored in secure HTTP-only cookie
   ↓
8. User redirected to /dashboard
```

### Workflow 2: Accessing Protected Route

```
1. User navigates to /admin/dashboard/users
   ↓
2. Middleware extracts JWT token via getToken()
   ↓
3. Check isAuthRoute() → No
   ↓
4. Check isDashboardRoute() → Yes
   ↓
5. Check if user has token → Yes
   ↓
6. Get user permissions from token
   ↓
7. Get required permissions for /admin/dashboard/users → ['user:read']
   ↓
8. Check hasRequiredPermissions(userPerms, ['user:read'])
   ↓
9. If true → Allow access (NextResponse.next())
   If false → Redirect to /admin/dashboard/no-permissions
```

### Workflow 3: Component-Level Permission Check

```typescript
// Inside a React component
const { data: session } = useSession();

// Get user permissions
const userPerms = getUserPermissions(session?.user);

// Check if specific permission exists
if (userPerms.includes('user:delete')) {
  // Show delete button
}

// Check if any required permission exists
if (hasRequiredPermissions(userPerms, ['role:read'])) {
  // Show roles management panel
}
```

---

## Part 9: Security Best Practices

### 1. Session Management

- ✅ Use JWT strategy for stateless sessions
- ✅ Set appropriate session timeout (24 hours)
- ✅ Always validate NEXTAUTH_SECRET
- ✅ Use secure HTTP-only cookies for token storage

### 2. Permission Validation

- ✅ Always check permissions on both frontend AND backend
- ✅ Never trust frontend permission checks alone
- ✅ Use PBAC (Permission-Based Access Control) not RBAC alone
- ✅ Implement wildcard permissions only for SUPER_ADMIN

### 3. Token Handling

- ✅ Extract permissions from token in middleware
- ✅ Cache token validation results
- ✅ Clear temporary token variables after use
- ✅ Never expose tokens in URL parameters

### 4. Route Protection

- ✅ Protect all sensitive routes in middleware
- ✅ Implement fallback pages for insufficient permissions
- ✅ Log permission denial events
- ✅ Provide clear user feedback on permission errors

### 5. Backend Guards

- ✅ Always use @UseGuards() on protected resolvers
- ✅ Combine multiple guards for defense-in-depth
- ✅ Use SUPER_ADMIN bypass judiciously
- ✅ Validate permissions at GraphQL resolver level

---

## Part 10: Troubleshooting

### Issue: User stuck on login loop

**Cause:** Session callback not properly assigning user/token to session

**Solution:**

```typescript
async session({ session, token }) {
  if (token) {
    Object.assign(session, {
      user: token.user,
      accessToken: token.accessToken,
    });
  }
  return session;
}
```

### Issue: Permissions not working in middleware

**Cause:** User permissions array is empty

**Solution:**

```typescript
// Ensure getUserPermissions() correctly maps permission objects
const userPerms = getUserPermissions(session?.user);
console.log('User permissions:', userPerms);

// Should output: ['user:read', 'role:read', ...]
```

### Issue: Routes not being protected

**Cause:** Route not included in middleware matcher

**Solution:**

```typescript
export const config = {
  matcher: [
    '/auth/:path*',
    '/admin/auth/:path*',
    '/dashboard/:path*',
    '/admin/dashboard/:path*',
    '/new-protected-path/:path*', // Add new route here
  ],
};
```

### Issue: SUPER_ADMIN bypass not working

**Cause:** `isSuperAdmin` flag not set on user object

**Solution:**

```typescript
// In your authorization header or JWT, ensure user object includes:
{
  user: {
    id: '123',
    email: 'admin@event.com',
    isSuperAdmin: true, // Must be present and true
    // ... other fields
  }
}
```

### Issue: OAuth login not working

**Cause:** Missing provider configuration

**Solution:**

```env
# Ensure all required env variables are set
FACEBOOK_CLIENT_ID=xxx
FACEBOOK_CLIENT_SECRET=xxx
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```

---

## Part 11: Related Documentation

- [Users Guide](USERS-GUIDE.md) - User management and operations
- [Spaces Guide](SPACES-GUIDE.md) - Space management
- [Route Permissions Source](../lib/route-permissions.ts) - Permission definitions
- [SessionContext Source](../lib/context/SessionContext.tsx) - Context API for session management
- [Proxy Middleware Source](../proxy.ts) - Middleware implementation
- [Auth Configuration Source](../lib/api/auth.ts) - Next-Auth setup

---

## Summary

The Event authentication and authorization system provides:

1. **Multi-method Authentication** - Credentials, Google, Facebook
2. **JWT-based Sessions** - Stateless token management
3. **Permission-based Access Control** - Fine-grained permission system
4. **Session Context API** - React Context wrapper for cleaner session access
5. **Middleware Protection** - Automatic route validation
6. **Backend Guards** - API-level access control with SUPER_ADMIN bypass
7. **Component-level Checks** - Frontend permission verification

This layered approach ensures secure access control at multiple levels while maintaining flexibility for admin users through the SUPER_ADMIN bypass mechanism. The SessionContext provides a consistent, centralized way to access session data throughout the application.
````
