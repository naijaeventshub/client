# Event

A modern full-stack Next.js application with TypeScript, Apollo Client, and comprehensive authentication and file management capabilities.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Overview](#project-overview)
- [Folder Structure](#folder-structure)
- [Code Conventions](#code-conventions)
- [Setup Instructions](#setup-instructions)
- [Startup Commands](#startup-commands)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.x or higher
- **pnpm**: v8.x or higher (recommended) or npm v9.x+
- **Git**: v2.x or higher
- **Docker**: Optional, for containerized development

## Project Overview

Event is a Next.js-based application built with:

- **Frontend**: React 18+ with TypeScript
- **Backend**: Next.js API routes with authentication
- **State Management**: Redux Toolkit & Apollo Client
- **Styling**: Tailwind CSS with Radix UI components
- **Form Handling**: React Hook Form with Zod validation
- **Testing**: Cypress for E2E and component testing
- **File Storage**: Support for AWS S3, Azure Blob Storage, and local storage
- **Authentication**: NextAuth.js integration

## Folder Structure

```
event/
├── app/                          # Next.js App Router directory
│   ├── _components/              # Private folder for internal components
│   ├── api/                      # API Route handlers
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── [...nextauth]/    # Dynamic route for NextAuth
│   │   │   └── token/            # Token endpoint
│   │   ├── proxy/                # Generic proxy endpoint
│   │   │   └── [...path]/        # Catch-all dynamic route
│   │   └── upload/               # File upload endpoints
│   │       ├── azure-blob/       # Azure Blob Storage upload
│   │       ├── local/            # Local storage upload
│   │       ├── presigned-url/    # S3 presigned URL endpoint
│   │       └── s3-proxy/         # S3 proxy endpoint
│   ├── dashboard/                # Dashboard (Protected routes)
│   │   ├── _components/          # Private folder for internal components
│   │   ├── layout.tsx            # Dashboard Layout
│   │   └── page.tsx              # Dashboard page (/dashboard route)
│   ├── error.tsx                 # Global error boundary
│   ├── global-error.tsx          # Global error boundary
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout (wraps all routes)
│   └── page.tsx                  # Home page (/ route)
│
├── components/                   # Reusable React components
│   └── ui/                       # UI component library (Radix UI based)
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── command.tsx
│       ├── confirmation-modal.tsx
│       ├── data-table.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── file-upload.tsx
│       ├── google-places-autocomplete.tsx
│       ├── image-upload-field.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── loading-skeleton.tsx
│       ├── modal.tsx
│       ├── MonthYearPicker.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── status-badge.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       └── tooltip.tsx
│   │   └── ... (other UI components)
│
├── cypress/                      # End-to-end and component testing
│   ├── component/                # Component test specs
│   │   └── example.cy.tsx        # Example component test
│   ├── e2e/                      # E2E test specs
│   │   └── home.cy.ts            # Home page E2E test
│   ├── fixtures/                 # Test fixtures
│   │   └── example.json          # Example fixture data
│   ├── screenshots/              # Cypress screenshots
│   └── support/                  # Test support utilities
│       ├── commands.ts           # Custom Cypress commands
│       ├── component-index.html  # Component test runner HTML
│       ├── component.ts          # Component test setup
│       └── e2e.ts                # E2E test setup
│
├── docs/                         # Project documentation
│   ├── export-pdf.md             # PDF export documentation
│   ├── file-upload-system.md     # File upload system documentation
│   └── redux-store.md            # Redux store documentation
│
├── hooks/                        # Custom React hooks
│   ├── use-file-upload.ts        # File upload hook
│   ├── use-image-upload.ts       # Image upload hook
│   ├── use-mobile.tsx            # Mobile detection hook
│   └── use-toast.ts              # Toast notification hook
│
├── lib/                          # Utility libraries and helpers
│   ├── api/                      # API helpers
│   │   ├── api-client.ts         # API client configuration
│   │   ├── apollo-client.ts      # Apollo Client setup
│   │   ├── auth.ts               # Authentication utilities
│   │   └── cors.ts               # CORS configuration
│   ├── pdf-templates/            # PDF generation templates
│   │   ├── image-utils.ts        # Image utilities for PDFs
│   │   └── index.ts              # PDF templates index
│   ├── providers/                # Application providers and contexts
│   │   ├── apollo-wrapper.tsx    # Apollo Client provider wrapper
│   │   ├── context-factory.tsx   # React context factory
│   │   ├── delete-modal-context.tsx # Delete modal context
│   │   ├── entity-layout-factory.tsx # Entity layout factory
│   │   ├── index.tsx             # Providers index
│   │   ├── session-timeout.tsx    # Session timeout handler
│   │   └── theme-provider.tsx    # Theme provider
│   ├── storage/                  # Storage provider implementations
│   │   ├── providers/            # Storage provider implementations
│   │   │   ├── aws/              # AWS S3 provider
│   │   │   ├── azure/            # Azure Blob Storage provider
│   │   │   └── cloudinary/       # Cloudinary provider
│   │   ├── index.ts              # Storage factory
│   │   ├── local-provider.ts     # Local storage provider
│   │   ├── storage-factory.ts    # Storage provider factory
│   │   ├── storage-provider.ts   # Storage provider interface
│   │   └── utils.ts              # Storage utilities
│   ├── date-utils.ts             # Date manipulation utilities
│   ├── handle-delete.ts          # Delete handler utility
│   ├── label-formatters.ts       # Label formatting utilities
│   ├── notifications.tsx         # Notification utilities
│   ├── route-permissions.ts      # Route permission checks
│   └── utils.ts                  # General utilities
│
├── public/                       # Static assets (served at root)
│   ├── avatars/                  # User avatar images
│   ├── font/                     # Font files
│   ├── icons/                    # SVG icons
│   └── images/                   # Image assets
│       ├── searching/            # Search-related images
│       └── users/                # User-related images
│
├── store/                        # Redux store configuration
│   ├── entityFactory.ts          # Entity factory for store
│   ├── index.ts                  # Store setup
│   └── users.ts                  # User store slice
│
├── types/                        # TypeScript type definitions
│   ├── data-table-types.ts       # Data table type definitions
│   ├── global.d.ts               # Global type declarations
│   ├── next-auth.d.ts            # NextAuth type extensions
│   ├── permission.ts             # Permission types
│   ├── role-permission.ts        # Role-permission mapping types
│   ├── role.ts                   # Role types
│   └── user.ts                   # User types
│
├── .env.local                    # Local environment variables (not tracked)
├── .gitignore                    # Git ignore rules
├── README.md                     # This file
├── components.json               # Component library configuration
├── cypress.config.ts             # Cypress configuration
├── docker-compose.yml            # Docker Compose configuration
├── Dockerfile                    # Docker image definition
├── eslint.config.mjs             # ESLint configuration
├── instrumentation-client.ts     # Client-side instrumentation
├── instrumentation.ts            # Instrumentation
├── next-env.d.ts                 # TypeScript declarations for Next.js
├── next.config.ts                # Next.js configuration
├── package.json                  # Project dependencies and scripts
├── postcss.config.mjs            # PostCSS configuration
├── proxy.ts                      # Next.js request proxy
├── pnpm-lock.yaml                # pnpm lock file
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

### Next.js App Directory Conventions

The `app/` directory uses Next.js App Router with the following special files:

#### Routing Files

- **`layout.tsx`** - Shared UI for a route segment and its children (render hierarchy)
- **`page.tsx`** - Makes a route publicly accessible (required for a route to be accessible)
- **`route.ts`** - API endpoint handler
- **`loading.tsx`** - Loading skeleton/UI (React Suspense boundary)
- **`error.tsx`** - Error boundary UI for handling errors in a route segment
- **`not-found.tsx`** - Not found UI for handling 404 errors
- **`template.tsx`** - Re-rendered layout wrapper (component instance per navigation)

#### Dynamic Routes

- **`[segment]`** - Single parameter (e.g., `[id]` for `/blog/123`)
- **`[...segment]`** - Catch-all route (e.g., `[...slug]` for `/docs/a/b/c`)
- **`[[...segment]]`** - Optional catch-all route (e.g., `/docs` or `/docs/a/b`)

#### Route Organization

- **Route Groups** - Use `(groupName)` to organize routes without affecting the URL path
- **Private Folders** - Use `_folderName` to opt out of routing and indicate private implementation details
- **Colocation** - Non-routable files can be safely colocated within route segments

## Code Conventions

### Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`, `DataTable.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useFileUpload.ts`, `useMobile.tsx`)
- **Functions**: camelCase (e.g., `handleDelete()`, `formatDate()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`, `API_BASE_URL`)
- **Types/Interfaces**: PascalCase (e.g., `User`, `UploadResponse`)
- **CSS Classes**: kebab-case with Tailwind (e.g., `flex`, `gap-4`)

### File Organization

- **Components**: One component per file unless very small
- **API Routes**: Organize by feature in `app/api/{feature}/{endpoint}`
- **Hooks**: Place in `hooks/` directory with `use-` prefix
- **Types**: Create feature-specific or global type files in `types/`
- **Utilities**: Group related utilities in subdirectories

### Code Style

- **TypeScript**: Always use strict mode (`strict: true`)
- **React**: Use functional components and hooks
- **Imports**:
  - Absolute imports using `@/` alias
  - Group imports: React → external → internal
- **Components**: Props should be properly typed with interfaces
- **Error Handling**: Try-catch blocks with proper error logging

Example component structure:

```typescript
'use client'; // Add if using client-side features

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface UserCardProps {
  userId: string;
  userName: string;
  children?: ReactNode;
}

export function UserCard({ userId, userName, children }: UserCardProps) {
  const { toast } = useToast();

  const handleAction = () => {
    toast({ title: 'Success', description: 'Action completed' });
  };

  return <div className="flex gap-4">{children}</div>;
}
```

### Git Conventions

- **Branches**: `feature/description`, `bugfix/description`, `hotfix/description`
- **Commits**: Use conventional commits
  - `feat: description`
  - `fix: description`
  - `docs: description`
  - `test: description`
  - `refactor: description`

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Database
DATABASE_URL=your-database-url

# AWS S3 (optional)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Azure Blob Storage (optional)
AZURE_STORAGE_ACCOUNT=your-account
AZURE_STORAGE_KEY=your-key

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3000/graphql
```

### Next.js Project Organization

This project follows the **"Store project files outside of app"** strategy from Next.js best practices, keeping the `app` directory purely for routing purposes while storing shared application code (components, hooks, lib, store, types) in the root-level directories.

#### Key Principles

1. **Colocation**: Non-routable files can be safely colocated within route segments without accidentally becoming routable
2. **Private Folders**: Use `_folderName` to explicitly mark folders as private implementation details not part of routing
3. **Route Groups**: Use `(groupName)` to organize routes logically without affecting the URL path
4. **Separation of Concerns**: Keep routing logic in `app/` separate from business logic in shared folders

#### Component Hierarchy

Components in `app/` are rendered in this order:

1. `layout.tsx` - Wrapping layout
2. `template.tsx` - Re-rendered layout (optional)
3. `error.tsx` - Error boundary
4. `loading.tsx` - Loading skeleton (Suspense boundary)
5. `not-found.tsx` - Not found UI
6. `page.tsx` - Page content

#### Routing Structure Examples

**Root layout** wraps all routes:

```
app/layout.tsx → / (root)
```

**Nested routes** with shared layouts:

```
app/blog/layout.tsx → /blog and descendants
app/blog/page.tsx → /blog
app/blog/[slug]/page.tsx → /blog/my-first-post
```

**Dynamic routes** with catch-all patterns:

```
app/blog/[...slug]/page.tsx → /blog/clothing, /blog/clothing/shirts
app/docs/[[...slug]]/page.tsx → /docs (optional catch-all)
```

**API routes** follow REST conventions:

```
app/api/users/route.ts → GET/POST /api/users
app/api/auth/[...nextauth]/route.ts → NextAuth dynamic routes
```

#### Colocation with Private Folders

Use private folders (`_folderName`) to colocate route-specific files within route segments. This keeps related files together without making them routable.

**Example structure for a blog route:**

```
app/blog/
├── layout.tsx                    # Layout for /blog
├── page.tsx                      # /blog page
├── [slug]/
│   ├── page.tsx                  # /blog/[slug] page
│   ├── _components/              # Private folder for route-specific components
│   │   ├── ArticleHeader.tsx     # Not routable; used only in this route
│   │   ├── ArticleContent.tsx    # Not routable; used only in this route
│   │   └── RelatedArticles.tsx   # Not routable; used only in this route
│   └── _lib/                     # Private folder for route-specific utilities
│       ├── formatDate.ts         # Not routable; used only in this route
│       └── fetchArticle.ts       # Not routable; used only in this route
```

**Benefits of this approach:**

- **Organization**: Related files are colocated near where they're used
- **Clarity**: Private folders make intent explicit (internal, not routable)
- **Scalability**: Easy to understand route-specific vs shared code
- **Safety**: Private folders prevent accidental routing

**Routing result**: Only `/blog` and `/blog/[slug]` are publicly accessible. The `_components` and `_lib` folders are completely private and non-routable.

#### Next.js Project Organization

This project follows the **"Store project files outside of app"** strategy from Next.js best practices, keeping the `app` directory purely for routing purposes while storing shared application code (components, hooks, lib, store, types) in the root-level directories.

#### Key Principles

1. **Colocation**: Non-routable files can be safely colocated within route segments without accidentally becoming routable
2. **Private Folders**: Use `_folderName` to explicitly mark folders as private implementation details not part of routing
3. **Route Groups**: Use `(groupName)` to organize routes logically without affecting the URL path
4. **Separation of Concerns**: Keep routing logic in `app/` separate from business logic in shared folders

#### Component Hierarchy

Components in `app/` are rendered in this order:

1. `layout.tsx` - Wrapping layout
2. `template.tsx` - Re-rendered layout (optional)
3. `error.tsx` - Error boundary
4. `loading.tsx` - Loading skeleton (Suspense boundary)
5. `not-found.tsx` - Not found UI
6. `page.tsx` - Page content

#### Routing Structure Examples

**Root layout** wraps all routes:

```
app/layout.tsx → / (root)
```

**Nested routes** with shared layouts:

```
app/blog/layout.tsx → /blog and descendants
app/blog/page.tsx → /blog
app/blog/[slug]/page.tsx → /blog/my-first-post
```

**Dynamic routes** with catch-all patterns:

```
app/blog/[...slug]/page.tsx → /blog/clothing, /blog/clothing/shirts
app/docs/[[...slug]]/page.tsx → /docs (optional catch-all)
```

**API routes** follow REST conventions:

```
app/api/users/route.ts → GET/POST /api/users
app/api/auth/[...nextauth]/route.ts → NextAuth dynamic routes
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd event
```

### 2. Install Dependencies

Using pnpm (recommended):

```bash
pnpm install
```

Or using npm:

```bash
npm install
```

### 3. Setup Environment Variables

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

### 4. Database Setup (if applicable)

```bash
# Run migrations
pnpm run db:migrate

# Seed database
pnpm run db:seed
```

### 5. Verify Setup

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint
```

## Startup Commands

### Development Mode

Start the development server with automatic reloading:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Quick Start (Recommended)

Run the complete development setup with linting, type checking, and formatting:

```bash
pnpm dev:start
```

This command:

1. Installs dependencies
2. Runs ESLint fixes
3. Performs type checking
4. Formats code with Prettier
5. Starts the development server

### Production Build

Build the application for production:

```bash
pnpm build
```

### Analyze Bundle Size

```bash
pnpm build:analyze
```

### Debug Memory Usage

```bash
pnpm build:debug-memory
```

### Generate Heap Profile

```bash
pnpm build:heap
```

### Start Production Server

```bash
pnpm start
```

### Start with Verbose OTEL Logging

```bash
pnpm start:otel-verbose
```

### Code Quality

**Format code** with Prettier:

```bash
pnpm format
```

**Check formatting** without making changes:

```bash
pnpm format:check
```

**Lint code** for issues:

```bash
pnpm lint
```

**Fix linting issues** automatically:

```bash
pnpm lint:fix
```

**Type checking** (without emitting files):

```bash
pnpm type-check
```

**Watch mode for type checking**:

```bash
pnpm type-check:watch
```

## Development Workflow

### Personal Notes During Development

The project includes a `notes` folder for tracking personal notes, TODOs, and development reminders. Use this folder to:

- Track in-progress work and next steps
- Document temporary solutions or workarounds
- Keep notes on bugs encountered and their fixes
- Record ideas for future improvements
- Note any deployment considerations or gotchas

This folder is included in `.gitignore` and is for your personal use only—it won't be committed to the repository.

### Creating a New Feature

1. Create a feature branch:

   ```bash
   git checkout -b feature/my-feature origin/develop
   ```

2. Develop your feature following the code conventions

3. Ensure code quality:

   ```bash
   pnpm lint:fix
   pnpm format
   pnpm type-check
   ```

4. Test your changes (see Testing section)

5. Commit with conventional commits:

   ```bash
   git add .
   git commit -m "feat: add my feature"
   ```

6. Push and create a pull request:
   ```bash
   git push origin feature/my-feature
   ```

### Working with Components

All UI components are located in `components/ui/` and built on Radix UI primitives.

Example: Creating a new feature component:

```typescript
// components/MyFeature.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function MyFeature() {
  const [loading, setLoading] = useState(false);

  return (
    <Card className="p-6">
      <Button onClick={() => setLoading(!loading)}>
        {loading ? 'Loading...' : 'Click me'}
      </Button>
    </Card>
  );
}
```

### Working with API Routes

API routes are located in `app/api/` and follow Next.js conventions.

Example: Creating a new endpoint:

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const users = await fetchUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = await createUser(body);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 400 }
    );
  }
}
```

## Monitoring and Instrumentation

This project includes built-in observability and monitoring capabilities powered by OpenTelemetry and Vercel's OTEL integration.

### Global Error Handling

The application includes a comprehensive global error boundary in `app/global-error.tsx` that:

- Catches unhandled errors across the entire application
- Logs errors with stack traces and error IDs for debugging
- Sends errors to external monitoring services (e.g., Sentry, DataDog)
- Displays a user-friendly error UI with retry and home navigation options
- Tracks error digests for correlation and analysis

### Server-Side Instrumentation

Server-side instrumentation is configured in `instrumentation.ts` and provides:

- OpenTelemetry integration via Vercel OTEL
- Request error monitoring and logging
- Distributed tracing support
- Production telemetry setup

### Client-Side Instrumentation

Client-side utilities in `lib/instrumentation-client.ts` offer:

```typescript
// Track async operations
await trackAsync('operation_name', async () => {
  // Your async code here
});

// Track sync operations
trackSync('operation_name', () => {
  // Your sync code here
});

// Track API calls with automatic timing
await trackApiCall('GET', '/api/users');

// Record custom metrics
recordMetric('custom_metric', value);

// Add custom span attributes
addSpanAttribute('user_id', userId);
```

### Build Commands for Performance Analysis

The project includes specialized build commands for performance profiling:

```bash
# Analyze bundle size
pnpm build:analyze

# Debug memory usage during build
pnpm build:debug-memory

# Generate heap profile
pnpm build:heap

# Start with verbose OTEL logging
pnpm start:otel-verbose
```

## Testing

### Running Tests

**Open Cypress Test Runner** (interactive mode):

```bash
pnpm cypress:open
```

**Run all tests** (headless mode):

```bash
pnpm cypress:run
```

### Writing Tests

- **E2E Tests**: `cypress/e2e/*.cy.ts`
- **Component Tests**: `cypress/component/*.cy.tsx`

Example test:

```typescript
// cypress/e2e/example.cy.ts
describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the header', () => {
    cy.get('header').should('be.visible');
  });

  it('should navigate to login', () => {
    cy.get('a[href="/login"]').click();
    cy.url().should('include', '/login');
  });
});
```

## Troubleshooting

### Common Issues

**Issue: Port 3000 already in use**

```bash
# On macOS/Linux
lsof -i :3000
kill -9 <PID>

# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Issue: Dependencies not installed**

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Issue: Type errors after changes**

```bash
# Restart TypeScript server in VS Code
# Command Palette (Cmd+Shift+P): "TypeScript: Restart TS Server"
```

**Issue: ESLint/Prettier conflicts**

```bash
# Run both formatters in order
pnpm lint:fix
pnpm format
```

**Issue: Apollo Client cache issues**

```bash
# Clear Apollo cache in browser DevTools or:
# Add to your query: { fetchPolicy: 'network-only' }
```

### Getting Help

- Check existing documentation in `docs/` folder
- Review component examples in `components/ui/`
- Check Apollo Client setup in `lib/apollo-client.ts`
- Review auth configuration in `lib/auth.ts`

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Cypress Documentation](https://docs.cypress.io)

---

**Last Updated**: December 2025
**Maintainers**: Development Team
