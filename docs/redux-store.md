# Event Redux Store Documentation

This directory contains the Redux store configuration and API management for the Event client application using RTK Query with a custom entity factory pattern.

## Overview

The store is built around a custom `entityFactory` that provides a standardized way to create CRUD API endpoints with support for dynamic path segments and query parameters. The Event store manages entities across social networking, events, spaces, and real-time communication features.

The entity factory supports both **REST API** and **GraphQL** backends, allowing seamless integration with either API type. When GraphQL is enabled, queries and mutations are automatically handled through Apollo Client while maintaining the same Redux interface.

## GraphQL Integration

The entity factory has built-in support for GraphQL queries and mutations. When `useGraphQL: true` is set, the entity will use Apollo Client for data fetching instead of REST API.

```typescript
import { createEntity } from './entityFactory';
import type { User } from '../types/user';
import { USERS_QUERY, GET_USER_BY_ID_QUERY } from '@/graphql/queries/users';
import {
  CREATE_USER_MUTATION,
  UPDATE_USER_MUTATION,
} from '@/graphql/mutations/users';

export const users = createEntity<User>({
  reducerPath: 'usersApi',
  entityEndpoint: 'users',
  entityName: 'User',
  useGraphQL: true, // Enable GraphQL
  graphqlQueries: {
    getAll: USERS_QUERY,
    getById: GET_USER_BY_ID_QUERY,
  },
  graphqlMutations: {
    create: CREATE_USER_MUTATION,
    update: UPDATE_USER_MUTATION,
  },
});
```

For detailed information on GraphQL queries, mutations, and integration patterns, see [GraphQL Queries & Mutations Guide](GRAPHQL-QUERIES-MUTATIONS.md).

## Core Files

### `entityFactory.ts`

The main factory function that creates standardized API endpoints for any entity type with support for users, spaces, circles, chats, messages, and events.

### Entity Stores

Individual store files for each Event entity:

- `users.ts` - User profiles, authentication, privacy settings
- `spaces.ts` - Location-based space events
- `circles.ts` - Community circles and groups
- `chats.ts` - Direct and group messaging
- `messages.ts` - Message content and threads
- `events.ts` - Events and event management
- `connections.ts` - User connections and relationships

## Entity Factory Usage

### Basic Entity Creation for Users

```typescript
import { createEntity } from './entityFactory';
import type { User } from '../types/user';

export const users = createEntity<User>({
  reducerPath: 'usersApi',
  entityEndpoint: 'users',
});

export const {
  useGetAllQuery: useGetAllUsersQuery,
  useGetByIdQuery: useGetUserQuery,
  useCreateMutation: useCreateUserMutation,
  useUpdateMutation: useUpdateUserMutation,
  useDeleteMutation: useDeleteUserMutation,
} = users;
```

### Available Endpoints

Each entity automatically gets these endpoints:

- **`getAll`** - Get all entities with optional filtering and pagination
- **`getById`** - Get a single entity by ID
- **`getSingle`** - Get a single entity with query parameters
- **`create`** - Create a new entity
- **`update`** - Update an existing entity (PUT)
- **`patch`** - Partially update an entity (PATCH)
- **`delete`** - Delete an entity

## Advanced Features

### Extra Path Segments for Nested Resources

The entity factory supports dynamic path segments using the `extraPath` parameter for related resources:

```typescript
// Get user profile details
// URL: GET /users/user-123/profile
const { data } = users.useGetByIdQuery({
  id: 'user-123',
  extraPath: 'profile',
});

// Get all user highlights/stories
// URL: GET /users/user-123/highlights
const { data } = users.useGetByIdQuery({
  id: 'user-123',
  extraPath: 'highlights',
});

// Get user privacy settings
// URL: GET /users/privacy-settings
const { data } = users.useGetSingleQuery({
  extraPath: 'privacy-settings',
});

// Get space attendees
// URL: GET /spaces/space-123/attendees
const { data } = spaces.useGetByIdQuery({
  id: 'space-123',
  extraPath: 'attendees',
});

// Get circle members
// URL: GET /circles/circle-123/members
const { data } = circles.useGetByIdQuery({
  id: 'circle-123',
  extraPath: 'members',
});

// Get chat room messages
// URL: GET /chats/chat-room-123/messages
const { data } = chats.useGetByIdQuery({
  id: 'chat-room-123',
  extraPath: 'messages',
});
```

### Query Parameters for Filtering & Pagination

Use the `params` object to add query string parameters:

```typescript
// Get paginated list of users with filters
// URL: GET /users?page=1&limit=20&isVerified=true
const { data } = users.useGetAllQuery({
  params: {
    page: 1,
    limit: 20,
    isVerified: true,
  },
});

// Search spaces by location
// URL: GET /spaces?latitude=40.7128&longitude=-74.0060&radius=50
const { data } = spaces.useGetAllQuery({
  params: {
    latitude: 40.7128,
    longitude: -74.006,
    radius: 50,
  },
});

// Get active circles with filters
// URL: GET /circles?isPublic=true&status=PUBLISHED&limit=10
const { data } = circles.useGetAllQuery({
  params: {
    isPublic: true,
    status: 'PUBLISHED',
    limit: 10,
  },
});

// Combine params with extraPath
// URL: GET /users/user-123/highlights?limit=10&isActive=true
const { data } = users.useGetByIdQuery({
  id: 'user-123',
  params: {
    limit: 10,
    isActive: true,
  },
  extraPath: 'highlights',
});
```

## Examples of Using params with extraPath

### 1. User Discovery

```typescript
// Get paginated discovery users with filters
// URL: GET /users/discovery?page=1&limit=20&interests=technology
const { data } = users.useGetSingleQuery({
  params: {
    page: 1,
    limit: 20,
    interests: ['technology', 'innovation'],
  },
  extraPath: 'discovery',
});
```

### 2. Search with Filters

```typescript
// Search circles by name and filters
// URL: GET /circles?search=tech&isPublic=true&limit=15
const { data } = circles.useGetAllQuery({
  params: {
    search: 'tech',
    isPublic: true,
    limit: 15,
    sort: 'createdAt',
  },
});
```

### 3. Location-Based Spaces

```typescript
// Get nearby spaces with geofencing
// URL: GET /spaces?latitude=40.7128&longitude=-74.0060&radius=5&status=ACTIVE
const { data } = spaces.useGetAllQuery({
  params: {
    latitude: 40.7128,
    longitude: -74.006,
    radius: 5,
    status: 'ACTIVE',
  },
});
```

### 4. Chat Room Messages with Pagination

```typescript
// Get paginated chat messages
// URL: GET /chats/chat-123/messages?page=1&limit=50&sort=createdAt
const { data } = chats.useGetByIdQuery({
  id: 'chat-123',
  params: {
    page: 1,
    limit: 50,
    sort: 'createdAt',
  },
  extraPath: 'messages',
});
```

### 5. User Connections with Status Filter

```typescript
// Get user connections filtered by status
// URL: GET /users/user-123/connections?status=ACCEPTED&limit=20
const { data } = users.useGetByIdQuery({
  id: 'user-123',
  params: {
    status: 'ACCEPTED',
    limit: 20,
  },
  extraPath: 'connections',
});
```

### 6. Circle Members with Role Filter

```typescript
// Get circle members filtered by role
// URL: GET /circles/circle-123/members?role=MODERATOR&isActive=true
const { data } = circles.useGetByIdQuery({
  id: 'circle-123',
  params: {
    role: 'MODERATOR',
    isActive: true,
  },
  extraPath: 'members',
});
```

### 7. Space Analytics

```typescript
// Get space attendance analytics
// URL: GET /spaces/space-123/analytics?metric=attendance&period=daily
const { data } = spaces.useGetByIdQuery({
  id: 'space-123',
  params: {
    metric: 'attendance',
    period: 'daily',
  },
  extraPath: 'analytics',
});
```

### 8. Mutation with Parameters - Create Event

```typescript
// Create event with auto-publish flag
// URL: POST /events?autoPublish=true&notifyCircle=true
const [createEvent] = events.useCreateMutation();

await createEvent({
  data: {
    name: 'Tech Meetup',
    description: 'Monthly tech community gathering',
    startDate: '2026-02-15T18:00:00Z',
    circleId: 'circle-123',
  },
  config: {
    params: {
      autoPublish: true,
      notifyCircle: true,
    },
  },
});
```

### 9. Dynamic Parameters Based on State

```typescript
// React component example with dynamic parameters
function SpaceDiscovery({
  latitude,
  longitude,
  selectedRadius,
  userInterests,
}) {
  const { data, isLoading } = spaces.useGetAllQuery({
    params: {
      latitude,
      longitude,
      radius: selectedRadius,
      status: 'ACTIVE',
      privacyType: 'PUBLIC',
    },
  });

  // Component logic...
}
```

### 10. Conditional Parameters - User Permissions

```typescript
// Conditional parameters based on user role
function getCircleData(userRole: string, circleId: string) {
  const baseParams = {
    circleId,
    limit: 20,
  };

  const roleSpecificParams =
    userRole === 'HOST' || userRole === 'MODERATOR'
      ? { includeSensitive: true, includeAnalytics: true }
      : { includePublic: true };

  return circles.useGetByIdQuery({
    id: circleId,
    params: { ...baseParams, ...roleSpecificParams },
    extraPath: 'detailed',
  });
}
```

## Real-World Examples

### User Profile Management

```typescript
// Get current user profile with privacy settings
const { data: currentUser } = users.useGetSingleQuery({
  extraPath: 'current',
});

// Get another user's public profile
const { data: userProfile } = users.useGetByIdQuery({
  id: 'user-123',
});

// Update current user privacy settings
const [updatePrivacySettings] = users.useUpdateMutation();
await updatePrivacySettings({
  data: {
    profileVisibility: 'PUBLIC',
    allowConnectionRequests: true,
    locationSharingEnabled: false,
  },
  extraPath: 'privacy-settings',
});
```

### Space Discovery and Management

```typescript
// Discover nearby spaces
const { data: nearbySpaces } = spaces.useGetAllQuery({
  params: {
    latitude: 40.7128,
    longitude: -74.006,
    radius: 5,
    status: 'ACTIVE',
  },
});

// Get space attendees
const { data: attendees } = spaces.useGetByIdQuery({
  id: 'space-123',
  params: {
    limit: 50,
  },
  extraPath: 'attendees',
});

// Create a new space
const [createSpace] = spaces.useCreateMutation();
await createSpace({
  data: {
    name: 'Tech Meetup',
    description: 'Monthly gathering',
    startDate: new Date(),
    durationMinutes: 120,
    latitude: 40.7128,
    longitude: -74.006,
    privacyType: 'PUBLIC',
  },
});
```

### Circle Community Management

```typescript
// Get all circles user is in
const { data: myCircles } = circles.useGetAllQuery({
  params: {
    membershipType: 'JOINED',
    limit: 20,
  },
});

// Get circle members
const { data: members } = circles.useGetByIdQuery({
  id: 'circle-123',
  params: {
    limit: 100,
  },
  extraPath: 'members',
});

// Join a circle
const [joinCircle] = circles.useCreateMutation();
await joinCircle({
  data: { circleId: 'circle-123' },
  extraPath: 'join',
});

// Update circle details (Host only)
const [updateCircle] = circles.useUpdateMutation();
await updateCircle({
  id: 'circle-123',
  data: {
    name: 'Tech Entrepreneurs Updated',
    description: 'New description',
  },
});
```

### Chat and Messaging

```typescript
// Get user's chat rooms
const { data: chatRooms } = chats.useGetAllQuery({
  params: {
    limit: 20,
  },
});

// Get messages in a chat room
const { data: messages } = chats.useGetByIdQuery({
  id: 'chat-room-123',
  params: {
    page: 1,
    limit: 50,
  },
  extraPath: 'messages',
});

// Send a message
const [sendMessage] = messages.useCreateMutation();
await sendMessage({
  data: {
    chatRoomId: 'chat-room-123',
    content: 'Hello everyone!',
    type: 'TEXT',
  },
});

// Get direct messages with a user
const { data: directMessages } = messages.useGetAllQuery({
  params: {
    recipientId: 'user-456',
    limit: 50,
  },
});
```

### User Connections

```typescript
// Get user connections
const { data: connections } = connections.useGetAllQuery({
  params: {
    status: 'ACCEPTED',
    limit: 20,
  },
});

// Send connection request
const [sendConnectionRequest] = connections.useCreateMutation();
await sendConnectionRequest({
  data: {
    recipientId: 'user-456',
    message: "Hi! Let's connect",
  },
});

// Accept connection request
const [acceptConnection] = connections.useUpdateMutation();
await acceptConnection({
  id: 'connection-123',
  data: { status: 'ACCEPTED' },
});

// Block a user
const [blockUser] = connections.useCreateMutation();
await blockUser({
  data: { userId: 'user-456' },
  extraPath: 'block',
});
```

## API Method Signatures

### Query Methods

```typescript
// GetAll
useGetAllQuery(params?: QueryArg<Record<string, any>> | void)

// GetById
useGetByIdQuery(id: IdArg | string)

// GetSingle
useGetSingleQuery(params?: QueryArg<Record<string, any>> | void)
```

### Mutation Methods

```typescript
// Create
useCreateMutation();
// Usage: create({ data: T, extraPath?: string })

// Update
useUpdateMutation();
// Usage: update({ id: string, data: T, extraPath?: string })

// Patch
usePatchMutation();
// Usage: patch({ id: string, data: T, extraPath?: string })

// Delete
useDeleteMutation();
// Usage: delete({ id: string, extraPath?: string })
```

## Type Definitions

### QueryArg

```typescript
type QueryArg<T = any> =
  | T
  | {
      params?: T;
      config?: ApiRequestConfig;
      extraPath?: string;
    };
```

### IdArg

```typescript
type IdArg = {
  id: string;
  config?: ApiRequestConfig;
  extraPath?: string;
};
```

### MutationArg

```typescript
type MutationArg<T = any> =
  | {
      data: T;
      config?: ApiRequestConfig;
      extraPath?: string;
    }
  | T;
```

## Error Handling

The entity factory includes built-in error handling:

```typescript
const { data, error, isLoading } = distributors.useGetByIdQuery({
  id: 'invalid-id',
  extraPath: 'performance',
});

if (error) {
  console.error('API Error:', error);
  // Handle error state
}
```

## Configuration Options

### EntityApiOptions

```typescript
type EntityApiOptions<T, CreateT = Partial<T>, UpdateT = Partial<T>> = {
  reducerPath: string; // Redux store path
  entityEndpoint: string; // API endpoint base path
  tagTypes?: string[]; // RTK Query cache tags
};
```

## Best Practices

1. **Consistent Naming**: Use descriptive reducer paths and endpoint names
2. **Type Safety**: Always provide proper TypeScript types for your entities
3. **Error Handling**: Implement proper error handling in your components
4. **Caching**: Leverage RTK Query's automatic caching for better performance
5. **Extra Paths**: Use extraPath for related endpoints that share the same data structure
6. **Parameters**: Use params for filtering, pagination, and search functionality

## Store Integration

The store is integrated with the main Redux store in `index.ts`:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { users } from './users';
import { spaces } from './spaces';
import { circles } from './circles';
import { chats } from './chats';
import { messages } from './messages';
import { events } from './events';
import { connections } from './connections';

export const store = configureStore({
  reducer: {
    [users.reducerPath]: users.reducer,
    [spaces.reducerPath]: spaces.reducer,
    [circles.reducerPath]: circles.reducer,
    [chats.reducerPath]: chats.reducer,
    [messages.reducerPath]: messages.reducer,
    [events.reducerPath]: events.reducer,
    [connections.reducerPath]: connections.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      users.middleware,
      spaces.middleware,
      circles.middleware,
      chats.middleware,
      messages.middleware,
      events.middleware,
      connections.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## Migration Guide

### From Basic RTK Query

If you're migrating from basic RTK Query endpoints:

1. Replace manual endpoint definitions with `createEntity`
2. Update component imports to use the generated hooks
3. Add `extraPath` support for related resources
4. Update API calls to use the new parameter structure

### Example Migration - User Profile

**Before:**

```typescript
// Manual endpoint definition
const usersApi = createApi({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (id) => `/users/${id}`,
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `/users/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});
```

**After:**

```typescript
// Using entity factory
export const users = createEntity<User>({
  reducerPath: 'usersApi',
  entityEndpoint: 'users',
});

// Usage
const { data: user } = users.useGetByIdQuery({ id: 'user-123' });
const [updateUser] = users.useUpdateMutation();
```

### Example Migration - Space Discovery

**Before:**

```typescript
// Manual parameters and URL building
const spaceApi = createApi({
  endpoints: (builder) => ({
    getNearbySpaces: builder.query({
      query: (filters) =>
        `/spaces?latitude=${filters.lat}&longitude=${filters.lng}&radius=${filters.radius}`,
    }),
  }),
});
```

**After:**

```typescript
// Using entity factory with params
const { data: spaces } = spaces.useGetAllQuery({
  params: {
    latitude: 40.7128,
    longitude: -74.006,
    radius: 5,
  },
});
```

## Troubleshooting

### Common Issues

1. **URL Building**: Ensure `extraPath` is properly extracted from arguments
   - Example: `/users/{id}/highlights` requires `extraPath: 'highlights'`

2. **Type Errors**: Make sure entity types match the API response structure
   - Check User, Space, Circle types against GraphQL schema

3. **Cache Issues**: Use proper cache tags for invalidation
   - Tags for users: `['User']`
   - Tags for spaces: `['Space']`
   - Tags for circles: `['Circle']`

4. **Parameter Handling**: Check that params are properly URL-encoded
   - Arrays may need special handling: `interests: ['tech', 'startup']`
   - Dates should be ISO format: `startDate: '2026-02-15T18:00:00Z'`

### Debug Tips

1. **Network Inspector**: Check Network tab to see actual API calls

   ```
   // Example: /users/search?page=1&limit=20&interests=technology
   ```

2. **Redux DevTools**: Use Redux DevTools to inspect store state
   - Monitor entity caching
   - Track query status (pending, fulfilled, rejected)

3. **Console Logging**: Add logs to verify parameters

   ```typescript
   const { data } = users.useGetAllQuery({
     params: { page: 1, limit: 20 },
   });
   console.log('Fetching users with params:', { page: 1, limit: 20 });
   ```

4. **RTK Query Status**: Monitor loading and error states

   ```typescript
   const { data, isLoading, error } = users.useGetAllQuery(params);

   if (isLoading) return <LoadingSpinner />;
   if (error) return <ErrorMessage error={error} />;
   ```

## Contributing

When adding new entities to Event:

1. Create the entity type in `types/` (e.g., `types/user.ts`, `types/space.ts`)
2. Create the store file using `createEntity` (e.g., `store/users.ts`, `store/spaces.ts`)
3. Export the generated hooks from the store file
4. Add the reducer and middleware to `store/index.ts`
5. Update this documentation with examples for the new entity

### Example: Adding a New Entity

```typescript
// Step 1: Create type (types/newEntity.ts)
export interface NewEntity {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

// Step 2: Create store (store/newEntity.ts)
import { createEntity } from './entityFactory';
import type { NewEntity } from '../types/newEntity';

export const newEntity = createEntity<NewEntity>({
  reducerPath: 'newEntityApi',
  entityEndpoint: 'new-entity',
});

export const {
  useGetAllQuery: useGetAllNewEntitiesQuery,
  useGetByIdQuery: useGetNewEntityQuery,
  useCreateMutation: useCreateNewEntityMutation,
} = newEntity;

// Step 3: Update store/index.ts
import { newEntity } from './newEntity';

export const store = configureStore({
  reducer: {
    [newEntity.reducerPath]: newEntity.reducer,
    // ... other reducers
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(newEntity.middleware),
});
```

## Event Entities Overview

### Users (`users.ts`)

- User profiles and authentication
- Privacy settings and visibility controls
- Followers and following
- User highlights/stories
- Blocking and hiding features

### Spaces (`spaces.ts`)

- Location-based temporary events
- Geofencing and attendance verification
- Space highlights and attendee interactions
- Real-time crowd analytics

### Circles (`circles.ts`)

- Community groups and circles
- Circle membership and roles
- Moderators and permissions
- Circle events and broadcasts

### Chats (`chats.ts`)

- Direct message threads
- Group chat rooms
- Circle-specific chat rooms
- Event chat rooms

### Messages (`messages.ts`)

- Individual message content
- Message types (text, image, link, system)
- Message reactions and threading
- Broadcast messages

### Events (`events.ts`)

- Event creation and management
- Event sessions and scheduling
- Event attendees and registration
- Event highlights and comments

### Connections (`connections.ts`)

- User connection requests
- Connection statuses (PENDING, ACCEPTED, REJECTED, BLOCKED)
- Private connections and notes
- Mutual connections

## License

This Redux store implementation is part of the Event client application.
