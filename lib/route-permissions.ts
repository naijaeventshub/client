import { Permission } from '@/types/permission';
import { User } from '@/types/user';

export interface RoutePermission {
  pattern: RegExp;
  href: string;
  permissions: string[]; // Array of permission names required to access this route
}

export const routePermissions: RoutePermission[] = [
  // Admin Dashboard Routes
  {
    href: '/admin/dashboard',
    pattern: /^\/admin\/dashboard$/,
    permissions: [], // All authenticated users can access dashboard
  },
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
    href: '/admin/dashboard/settings',
    pattern: /^\/admin\/dashboard\/settings$/,
    permissions: ['setting:read'],
  },
  {
    href: '/admin/dashboard/hosts',
    pattern: /^\/admin\/dashboard\/hosts(\/.+)?$/,
    permissions: ['admin:read'],
  },
  {
    href: '/admin/dashboard/spaces/management',
    pattern: /^\/admin\/dashboard\/spaces\/management(\/.+)?$/,
    permissions: ['admin:read'],
  },
  {
    href: '/admin/dashboard/spaces/aggregation',
    pattern: /^\/admin\/dashboard\/spaces\/aggregation(\/.+)?$/,
    permissions: ['admin:read'],
  },
  {
    href: '/admin/dashboard/spacers',
    pattern: /^\/admin\/dashboard\/spacers(\/.+)?$/,
    permissions: ['admin:read'],
  },
  {
    href: '/admin/dashboard/events/management',
    pattern: /^\/admin\/dashboard\/events\/management(\/.+)?$/,
    permissions: ['event:read'],
  },
  {
    href: '/admin/dashboard/events/aggregation',
    pattern: /^\/admin\/dashboard\/events\/aggregation(\/.+)?$/,
    permissions: ['event:read'],
  },
  {
    href: '/admin/dashboard/analytics',
    pattern: /^\/admin\/dashboard\/analytics(\/.+)?$/,
    permissions: ['admin:read'],
  },
  {
    href: '/admin/dashboard/algorithms',
    pattern: /^\/admin\/dashboard\/algorithms$/,
    permissions: ['admin:read'],
  },
  {
    href: '/admin/dashboard/content-moderation',
    pattern: /^\/admin\/dashboard\/content-moderation(\/.+)?$/,
    permissions: ['report:read'],
  },
  {
    href: '/admin/dashboard/moderation',
    pattern: /^\/admin\/dashboard\/moderation$/,
    permissions: ['report:read'],
  },
  {
    href: '/admin/dashboard/support',
    pattern: /^\/admin\/dashboard\/support$/,
    permissions: ['admin:read'],
  },

  // User Dashboard Routes
  {
    href: '/dashboard',
    pattern: /^\/dashboard$/,
    permissions: [], // All authenticated users can access dashboard
  },
  {
    href: '/dashboard/users',
    pattern: /^\/dashboard\/users(\/.+)?$/,
    permissions: ['user:read'],
  },
  {
    href: '/dashboard/profile',
    pattern: /^\/dashboard\/profile$/,
    permissions: [], // All authenticated users can view their profile
  },
];

// Helper function to check if user has any of the required permissions
export function hasRequiredPermissions(
  userPermissions: string[],
  requiredPermissions: string[]
): boolean {
  if (requiredPermissions.length === 0) {
    return true; // No permissions required, accessible to all
  }

  return requiredPermissions.some(
    (permission) =>
      userPermissions.includes(permission) || userPermissions.includes('*')
  );
}

// Helper function to get user permissions from session
export function getUserPermissions(user: User | undefined | null): string[] {
  if (!user) return [];
  return (user?.allPermissions || []).map((permission: Permission) => {
    return permission.name;
  });
}

// Helper function to find the appropriate permissions for a given path
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

    // Check if this route is a parent of the current path
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

export function hasPermissionForRoute(
  routePath: string,
  userPermissions: { name: string }[] | undefined
): boolean {
  if (!userPermissions) {
    return false;
  }

  const permissionNames = userPermissions.map((p) => p.name);
  if (permissionNames.includes('*')) {
    return true;
  }

  const routeConfig = routePermissions.find(
    (route) => route.href === routePath
  );

  if (!routeConfig) {
    return false;
  }

  return routeConfig.permissions.some((permission) =>
    permissionNames.includes(permission)
  );
}
