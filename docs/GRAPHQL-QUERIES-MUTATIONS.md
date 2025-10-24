# GraphQL Queries & Mutations Guide

## Overview

Event uses Apollo Client to manage GraphQL queries and mutations with seamless Redux Toolkit Query integration. This guide covers writing GraphQL queries/mutations, integrating with Redux, and best practices for data fetching.

### Key Technologies

- **Apollo Client**: GraphQL client with caching
- **Redux Toolkit Query**: RTK Query for data fetching and synchronization
- **Entity Factory**: Custom wrapper for creating Redux APIs with GraphQL support
- **GraphQL Operations**: Organized queries and mutations

---

## Part 1: GraphQL Setup

### Apollo Client Configuration

Apollo Client is configured at `lib/api/apollo-client.ts` with automatic authentication, WebSocket subscriptions, and file uploads:

```typescript
// lib/api/apollo-client.ts
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

const authLink = new SetContextLink(async (prevContext) => {
  const session = await getSession();
  const token = session?.accessToken || null;
  return {
    headers: {
      ...prevContext.headers,
      'x-apollo-operation-name': 'event',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
});

const httpUploadLink = new UploadHttpLink({ uri: GRAPHQL_URL });

// Split between authenticated and public operations
const authHttpLink = split(
  (operation) => !PUBLIC_OPERATIONS.includes(operation.operationName || ''),
  authLink.concat(httpUploadLink),
  httpUploadLink
);

// Split between subscriptions and HTTP operations
const link = split(
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

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});
```

**Key Features:**

- Automatic JWT authentication via `x-apollo-operation-name` header
- File upload support via `apollo-upload-client`
- WebSocket subscriptions support
- Public operations bypass auth (registration, login)
- Client-side and server-side URL configuration

### Apollo URLs

```env
# Server-side (Next.js)
NEXT_INTERNAL_API_URL=http://api:4000/graphql

# Client-side
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_GRAPHQL_PATH=graphql
NEXT_PUBLIC_WS_URL=ws://localhost:8000/graphql
```

---

## Part 2: Writing GraphQL Queries

### Query File Structure

Queries are organized in `graphql/queries/` directory:

```typescript
// graphql/queries/users.ts
import { gql } from '@apollo/client';

export const USERS_QUERY = gql`
  query Users($options: UserQueryInput) {
    users(options: $options) {
      total
      items {
        id
        email
        first_name
        last_name
        username
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_USER_BY_ID_QUERY = gql`
  query GetUserById($id: String!) {
    user(id: $id) {
      id
      email
      first_name
      last_name
      username
      createdAt
      updatedAt
    }
  }
`;

export const GET_SINGLE_USER_QUERY = gql`
  query GetSingleUser($options: UserQueryInput) {
    user(options: $options) {
      id
      email
      first_name
      last_name
      username
      createdAt
      updatedAt
    }
  }
`;
```

### Query Types

#### 1. Get All (List Query)

Used for fetching multiple items with pagination/filtering:

```typescript
export const USERS_QUERY = gql`
  query Users($options: UserQueryInput) {
    users(options: $options) {
      total
      items {
        id
        email
        first_name
        last_name
      }
    }
  }
`;

// Variables structure
{
  options: {
    pagination: { limit: 10, page: 1 },
    search: "John",
    sort: [{ field: "createdAt", direction: "DESC" }]
  }
}
```

**Response Structure:**

```typescript
{
  users: {
    total: 100,
    items: [
      { id: "1", email: "user@example.com", ... },
      // ... more items
    ]
  }
}
```

#### 2. Get By ID (Detail Query)

Used for fetching a single item by ID:

```typescript
export const GET_USER_BY_ID_QUERY = gql`
  query GetUserById($id: String!) {
    user(id: $id) {
      id
      email
      first_name
      last_name
      // ... all fields
    }
  }
`;

// Variables
{
  id: 'user-123';
}
```

#### 3. Get Single (Filtered Query)

Used for fetching a single item with custom filters:

```typescript
export const GET_SINGLE_USER_QUERY = gql`
  query GetSingleUser($options: UserQueryInput) {
    user(options: $options) {
      id
      email
      first_name
    }
  }
`;

// Variables
{
  options: {
    filters: {
      email: 'user@example.com';
    }
  }
}
```

### Query Best Practices

1. **Use Meaningful Names**: Prefix with operation type (GET*, FETCH*, LIST\_)

```typescript
// Good
export const GET_CIRCLES_QUERY = gql`query GetCircles { ... }`;
export const LIST_EVENTS_QUERY = gql`query ListEvents { ... }`;

// Avoid
export const QUERY_1 = gql`query { ... }`;
```

2. **Include All Required Fields**

```typescript
// Good - include all needed fields
export const GET_SPACE_QUERY = gql`
  query GetSpace($id: String!) {
    space(id: $id) {
      id
      name
      description
      attendeesCount
      createdAt
    }
  }
`;
```

3. **Use Fragments for Reusable Fields**

```typescript
export const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    email
    first_name
    last_name
    profilePicture
  }
`;

export const GET_USER_QUERY = gql`
  query GetUser($id: String!) {
    user(id: $id) {
      ...UserFields
      createdAt
      updatedAt
    }
  }
  ${USER_FRAGMENT}
`;
```

4. **Define Type-Safe Variables**

```typescript
// Good
export const SEARCH_USERS_QUERY = gql`
  query SearchUsers($query: String!, $limit: Int!, $offset: Int!) {
    searchUsers(query: $query, limit: $limit, offset: $offset) {
      items { ... }
      total
    }
  }
`;
```

---

## Part 3: Writing GraphQL Mutations

### Mutation File Structure

Mutations are organized in `graphql/mutations/` directory:

```typescript
// graphql/mutations/users.ts
import { gql } from '@apollo/client';
import { USER_FRAGMENT } from '@/graphql/queries/users';

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ...UserFields
      createdAt
    }
  }
  ${USER_FRAGMENT}
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: String!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      ...UserFields
      updatedAt
    }
  }
  ${USER_FRAGMENT}
`;

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: String!) {
    deleteUser(id: $id)
  }
`;
```

### Mutation Types

#### 1. Create Mutation

Creates a new resource:

```typescript
export const CREATE_CIRCLE_MUTATION = gql`
  mutation CreateCircle($input: CreateCircleInput!) {
    createCircle(input: $input) {
      id
      name
      description
      createdAt
      createdBy {
        id
        first_name
      }
    }
  }
`;

// Variables
{
  input: {
    name: "Tech Enthusiasts",
    description: "A circle for tech lovers",
    visibility: "PUBLIC"
  }
}
```

#### 2. Update Mutation

Updates an existing resource:

```typescript
export const UPDATE_CIRCLE_MUTATION = gql`
  mutation UpdateCircle($id: String!, $input: UpdateCircleInput!) {
    updateCircle(id: $id, input: $input) {
      id
      name
      description
      updatedAt
    }
  }
`;

// Variables
{
  id: "circle-123",
  input: {
    name: "Tech Enthusiasts 2.0",
    description: "Updated description"
  }
}
```

#### 3. Delete Mutation

Deletes a resource:

```typescript
export const DELETE_CIRCLE_MUTATION = gql`
  mutation DeleteCircle($id: String!) {
    deleteCircle(id: $id)
  }
`;

// Variables
{
  id: 'circle-123';
}
```

### Mutation Best Practices

1. **Use Input Types**

```typescript
// Good
mutation CreateEvent($input: CreateEventInput!) {
  createEvent(input: $input) { ... }
}

// Avoid - individual arguments
mutation CreateEvent(
  $title: String!
  $description: String!
  $date: DateTime!
) {
  createEvent(title: $title, description: $description, date: $date) { ... }
}
```

2. **Return Only Needed Fields**

```typescript
// Good - return relevant fields
export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      first_name
      last_name
      profilePicture
      bio
    }
  }
`;
```

3. **Include Operation Names**

```typescript
// Good - operation name for debugging
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      user { ... }
    }
  }
`;

// Avoid - anonymous mutation
export const LOGIN_MUTATION = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) { ... }
  }
`;
```

---

## Part 4: Entity Factory & Redux Integration

### Entity Factory Overview

The `entityFactory.ts` is a custom wrapper around Redux Toolkit Query that provides:

- **GraphQL Support**: Automatic query/mutation handling
- **REST Fallback**: Falls back to REST API if GraphQL not enabled
- **Type Safety**: Full TypeScript support
- **Cache Management**: Automatic tag-based invalidation
- **Flexible Arguments**: Supports params, config, and extra paths

### Creating an Entity with GraphQL

```typescript
// store/users.ts
import type { User } from '@/types/user';
import { createEntity } from './entityFactory';
import {
  USERS_QUERY,
  GET_USER_BY_ID_QUERY,
  GET_SINGLE_USER_QUERY,
} from '@/graphql/queries/users';
import {
  CREATE_USER_MUTATION,
  UPDATE_USER_MUTATION,
  DELETE_USER_MUTATION,
} from '@/graphql/mutations/users';

export const users = createEntity<User>({
  reducerPath: 'usersApi',
  entityEndpoint: 'users',
  entityName: 'User',
  useGraphQL: true,
  graphqlQueries: {
    getAll: USERS_QUERY,
    getById: GET_USER_BY_ID_QUERY,
    getSingle: GET_SINGLE_USER_QUERY,
  },
  graphqlMutations: {
    create: CREATE_USER_MUTATION,
    update: UPDATE_USER_MUTATION,
    delete: DELETE_USER_MUTATION,
  },
});

// Export hooks for use in components
export const {
  useGetAllQuery: useGetUsersQuery,
  useGetByIdQuery: useGetUserQuery,
  useCreateMutation: useCreateUserMutation,
  useUpdateMutation: useUpdateUserMutation,
  useDeleteMutation: useDeleteUserMutation,
} = users;
```

### Entity Configuration Options

```typescript
interface EntityApiOptions<T> {
  // Required
  reducerPath: string; // Redux store path (e.g., 'usersApi')

  // Optional but recommended
  entityEndpoint?: string; // REST endpoint (fallback)
  entityName?: string; // Singular entity name (e.g., 'User')
  tagTypes?: string[]; // Cache invalidation tags

  // GraphQL Configuration
  graphqlQueries?: {
    getAll?: DocumentNode; // List query
    getById?: DocumentNode; // Get by ID query
    getSingle?: DocumentNode; // Get single with filters
  };
  graphqlMutations?: {
    create?: DocumentNode; // Create mutation
    update?: DocumentNode; // Update mutation
    patch?: DocumentNode; // Partial update
    delete?: DocumentNode; // Delete mutation
  };
  graphqlClient?: ApolloClient; // Custom Apollo client
  useGraphQL?: boolean; // Enable GraphQL (default: false)
}
```

---

## Part 5: Using GraphQL with Redux

### 5.1 Querying Data in Components

#### Get All Query

```typescript
'use client';

import { useGetUsersQuery } from '@/store/users';

export function UsersList() {
  // Simple call - no parameters
  const { data: users, isLoading, error } = useGetUsersQuery();

  // With parameters
  const {
    data: users,
    isLoading,
    error,
    refetch
  } = useGetUsersQuery({
    params: {
      options: {
        pagination: { limit: 20, page: 1 },
        search: "John",
        sort: [{ field: "createdAt", direction: "DESC" }]
      }
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>{user.first_name} {user.last_name}</div>
      ))}
    </div>
  );
}
```

#### Get By ID Query

```typescript
'use client';

import { useGetUserQuery } from '@/store/users';

export function UserDetail({ userId }: { userId: string }) {
  // Pass ID directly
  const { data: user, isLoading, error } = useGetUserQuery(userId);

  // Or with configuration
  const {
    data: user,
    isLoading,
    error,
    refetch
  } = useGetUserQuery({
    id: userId,
    config: { headers: { 'X-Custom-Header': 'value' } }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user</div>;

  return (
    <div>
      <h1>{user?.first_name} {user?.last_name}</h1>
      <p>{user?.email}</p>
    </div>
  );
}
```

#### Get Single Query (Filtered)

```typescript
'use client';

import { useGetSingleQuery } from '@/store/users';

export function UserByEmail({ email }: { email: string }) {
  const {
    data: user,
    isLoading,
    error
  } = useGetSingleQuery({
    params: {
      options: {
        filters: { email }
      }
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return user ? <div>{user.first_name}</div> : <div>Not found</div>;
}
```

### 5.2 Mutating Data in Components

#### Create Mutation

```typescript
'use client';

import { useCreateUserMutation } from '@/store/users';
import { useEffect } from 'react';

export function CreateUserForm() {
  const [createUser, { isLoading, error, data }] = useCreateUserMutation();

  const handleSubmit = async (formData: any) => {
    try {
      // Method 1: Pass data directly
      await createUser(formData).unwrap();

      // Method 2: With configuration
      await createUser({
        data: formData,
        config: { headers: { 'X-Request-Id': 'req-123' } }
      }).unwrap();
    } catch (err) {
      console.error('Failed to create user:', err);
    }
  };

  useEffect(() => {
    if (data) {
      console.log('User created:', data);
    }
  }, [data]);

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      handleSubmit({
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        email: formData.get('email'),
      });
    }}>
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create'}
      </button>
      {error && <div className="error">{(error as any).data?.message}</div>}
    </form>
  );
}
```

#### Update Mutation

```typescript
'use client';

import { useUpdateUserMutation } from '@/store/users';

export function EditUserForm({ userId, initialData }: any) {
  const [updateUser, { isLoading, error }] = useUpdateUserMutation();

  const handleSubmit = async (formData: any) => {
    try {
      // Pass ID and data
      await updateUser({
        id: userId,
        data: formData
      }).unwrap();

      console.log('User updated successfully');
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      // Extract form data and submit
      const formData = new FormData(e.currentTarget);
      handleSubmit(Object.fromEntries(formData));
    }}>
      {/* Form fields with initial values */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update'}
      </button>
      {error && <div className="error">Update failed</div>}
    </form>
  );
}
```

#### Delete Mutation

```typescript
'use client';

import { useDeleteUserMutation } from '@/store/users';

export function DeleteUserButton({ userId }: { userId: string }) {
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  const handleDelete = async () => {
    if (confirm('Are you sure?')) {
      try {
        // Pass ID directly or as object
        await deleteUser(userId).unwrap();
        // Or: await deleteUser({ id: userId }).unwrap();

        console.log('User deleted');
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  return (
    <button onClick={handleDelete} disabled={isLoading}>
      {isLoading ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

---

## Part 6: Advanced Patterns

### 6.1 Combining Multiple Queries

```typescript
'use client';

import { useGetUserQuery } from '@/store/users';
import { useGetCirclesQuery } from '@/store/circles';

export function UserProfile({ userId }: { userId: string }) {
  // Multiple parallel queries
  const userQuery = useGetUserQuery(userId);
  const circlesQuery = useGetCirclesQuery({
    params: { filters: { memberId: userId } }
  });

  const isLoading = userQuery.isLoading || circlesQuery.isLoading;
  const error = userQuery.error || circlesQuery.error;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div>
      <h1>{userQuery.data?.first_name}</h1>
      <div>
        <h2>Circles</h2>
        {circlesQuery.data?.map(circle => (
          <div key={circle.id}>{circle.name}</div>
        ))}
      </div>
    </div>
  );
}
```

### 6.2 Dependent Queries

```typescript
'use client';

import { useGetUserQuery } from '@/store/users';
import { useGetUserConnectionsQuery } from '@/store/connections';

export function UserConnections({ userId }: { userId: string }) {
  // First query
  const userQuery = useGetUserQuery(userId);

  // Second query depends on first - skip while loading first
  const connectionsQuery = useGetUserConnectionsQuery(
    { params: { userId } },
    { skip: !userQuery.data?.id } // Skip until user is loaded
  );

  if (userQuery.isLoading) return <div>Loading user...</div>;
  if (connectionsQuery.isLoading) return <div>Loading connections...</div>;

  return (
    <div>
      <h1>{userQuery.data?.first_name}'s Connections</h1>
      {connectionsQuery.data?.map(conn => (
        <div key={conn.id}>{conn.name}</div>
      ))}
    </div>
  );
}
```

### 6.3 Polling & Refetching

```typescript
'use client';

import { useGetUsersQuery } from '@/store/users';
import { useEffect } from 'react';

export function UsersList() {
  // Poll every 5 seconds
  const { data, refetch, isLoading } = useGetUsersQuery(undefined, {
    pollingInterval: 5000 // milliseconds
  });

  // Manual refetch on button click
  const handleRefresh = () => {
    refetch();
  };

  // Refetch on interval
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <div>
      <button onClick={handleRefresh}>Refresh</button>
      {isLoading && <div>Loading...</div>}
      {data?.map(user => <div key={user.id}>{user.first_name}</div>)}
    </div>
  );
}
```

### 6.4 Cache Invalidation & Revalidation

```typescript
'use client';

import { useCreateUserMutation } from '@/store/users';
import { useDispatch } from 'react-redux';
import { users } from '@/store/users';

export function CreateAndRefresh() {
  const dispatch = useDispatch();
  const [createUser] = useCreateUserMutation();

  const handleCreateAndRefresh = async (userData: any) => {
    try {
      // Create user - automatically invalidates LIST cache
      await createUser(userData).unwrap();

      // Manually refetch list if needed
      dispatch(users.endpoints.getAll.initiate());
    } catch (err) {
      console.error('Failed:', err);
    }
  };

  return (
    <button onClick={() => handleCreateAndRefresh({ /* data */ })}>
      Create User
    </button>
  );
}
```

---

## Part 7: Error Handling

### Query Errors

```typescript
'use client';

import { useGetUserQuery } from '@/store/users';

export function UserDetail({ userId }: { userId: string }) {
  const { data, isLoading, error, isError } = useGetUserQuery(userId);

  if (isLoading) return <div>Loading...</div>;

  if (isError) {
    const errorData = error as any;
    const message = errorData?.data?.message || 'Failed to load user';
    const status = errorData?.status;

    if (status === 404) {
      return <div>User not found</div>;
    }

    if (status === 403) {
      return <div>Access denied</div>;
    }

    return <div>Error: {message}</div>;
  }

  return <div>{data?.first_name}</div>;
}
```

### Mutation Errors

```typescript
'use client';

import { useCreateUserMutation } from '@/store/users';

export function CreateUserForm() {
  const [createUser, { isLoading, error, isError }] = useCreateUserMutation();

  const handleSubmit = async (data: any) => {
    try {
      await createUser(data).unwrap();
    } catch (err: any) {
      // RTK Query error object structure
      if (err.status === 'FETCH_ERROR') {
        console.error('Network error:', err.error);
      } else if (err.status === 'CUSTOM_ERROR') {
        console.error('Server error:', err.error);
      } else if (err.status === 'PARSING_ERROR') {
        console.error('Parse error:', err.error);
      } else if (err.data) {
        // GraphQL/API error
        console.error('Error:', err.data.message);
      }
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(e.currentTarget));
      handleSubmit(formData);
    }}>
      {/* Form fields */}
      {isError && (
        <div className="error">
          {(error as any)?.data?.message || 'An error occurred'}
        </div>
      )}
      <button type="submit" disabled={isLoading}>Submit</button>
    </form>
  );
}
```

---

## Part 8: Best Practices

### 1. Operation Naming

```typescript
// Good: Descriptive operation names for debugging
export const LIST_ACTIVE_USERS_QUERY = gql`
  query ListActiveUsers($limit: Int!) {
    users(filter: { isActive: true }, limit: $limit) {
      items { ... }
      total
    }
  }
`;

// Good: Mutation with clear intent
export const ACCEPT_CONNECTION_REQUEST_MUTATION = gql`
  mutation AcceptConnectionRequest($requestId: String!) {
    acceptConnectionRequest(requestId: $requestId) {
      id
      status
    }
  }
`;
```

### 2. Fragment Reuse

```typescript
// Define once, use everywhere
export const USER_CARD_FRAGMENT = gql`
  fragment UserCard on User {
    id
    first_name
    last_name
    profilePicture
    email
  }
`;

export const LIST_USERS_QUERY = gql`
  query ListUsers {
    users {
      items {
        ...UserCard
      }
      total
    }
  }
  ${USER_CARD_FRAGMENT}
`;

export const GET_USER_DETAIL_QUERY = gql`
  query GetUserDetail($id: String!) {
    user(id: $id) {
      ...UserCard
      bio
      createdAt
    }
  }
  ${USER_CARD_FRAGMENT}
`;
```

### 3. Type Safety

```typescript
// Define response types
export interface UsersResponse {
  users: {
    items: User[];
    total: number;
  };
}

// Use in entity
export const users = createEntity<User, CreateUserInput, UpdateUserInput>({
  reducerPath: 'usersApi',
  entityName: 'User',
  useGraphQL: true,
  graphqlQueries: {
    getAll: USERS_QUERY,
    // ...
  },
});
```

### 4. Query Variables

```typescript
// Good: Type-safe variables
interface GetUserVariables {
  id: string;
}

export const GET_USER_QUERY = gql`
  query GetUser($id: String!) {
    user(id: $id) {
      id
      first_name
      last_name
    }
  }
`;

// Usage
const { data } = useGetUserQuery(userId); // Type checked
```

### 5. Lazy Queries

```typescript
'use client';

import { useLazyGetUserQuery } from '@/store/users';
import { useCallback } from 'react';

export function UserSearch() {
  const [getUser, { data, isLoading }] = useLazyGetUserQuery();

  const handleSearch = useCallback((userId: string) => {
    getUser(userId); // Execute on demand
  }, [getUser]);

  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isLoading && <div>Searching...</div>}
      {data && <div>{data.first_name}</div>}
    </div>
  );
}
```

---

## Part 9: Common Patterns

### Pagination

```typescript
'use client';

import { useGetUsersQuery } from '@/store/users';
import { useState } from 'react';

export function UsersWithPagination() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useGetUsersQuery({
    params: {
      options: {
        pagination: { limit, page }
      }
    }
  });

  return (
    <div>
      {data?.items?.map(user => (
        <div key={user.id}>{user.first_name}</div>
      ))}
      <div>
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page} of {Math.ceil((data?.total || 0) / limit)}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={!data?.items?.length || data.items.length < limit}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

### Searching & Filtering

```typescript
'use client';

import { useGetUsersQuery } from '@/store/users';
import { useState, useCallback } from 'react';

export function UserSearch() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});

  const { data, isLoading } = useGetUsersQuery({
    params: {
      options: {
        search,
        filters
      }
    }
  });

  const handleSearch = useCallback((query: string) => {
    setSearch(query);
  }, []);

  return (
    <div>
      <input
        placeholder="Search users..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {isLoading && <div>Searching...</div>}
      {data?.items?.map(user => (
        <div key={user.id}>{user.first_name}</div>
      ))}
    </div>
  );
}
```

---

## Part 10: Related Documentation

- [Redux Store Guide](redux-store.md) - Redux Toolkit Query setup and patterns
- [Authentication Guide](AUTHENTICATION-AUTHORIZATION.md) - JWT token management
- [API Configuration](../lib/api/) - Apollo Client and API setup
- [GraphQL Schema](../../api/schema.gql) - Complete GraphQL schema

---

## Summary

The Event GraphQL implementation provides:

1. **Organized Structure** - Queries and mutations in dedicated directories
2. **Apollo Client** - Automatic authentication, subscriptions, and file uploads
3. **Entity Factory** - Type-safe Redux integration with GraphQL support
4. **Flexible Patterns** - REST fallback, lazy queries, polling, refetching
5. **Error Handling** - Comprehensive error management and user feedback
6. **Best Practices** - Fragment reuse, operation naming, type safety

This layered approach enables efficient data fetching with full type safety and automatic cache management throughout the application.
