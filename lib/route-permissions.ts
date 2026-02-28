export interface RoutePermission {
  pattern: RegExp;
  href: string;
  permissions: string[]; // Array of permission names required to access this route
}

export const routePermissions: RoutePermission[] = [
  // Audit Logs
  {
    href: "/dashboard/audit-logs",
    pattern: /^\/dashboard\/audit-logs$/,
    permissions: ["view audit logs"],
  },
  {
    href: "/dashboard/audit-logs/system",
    pattern: /^\/dashboard\/audit-logs\/system$/,
    permissions: ["view audit logs"],
  },
  {
    href: "/dashboard/audit-logs/users",
    pattern: /^\/dashboard\/audit-logs\/users$/,
    permissions: ["view audit logs"],
  },

  // Dashboard
  {
    href: "/dashboard",
    pattern: /^\/dashboard$/,
    permissions: ["view dashboard"],
  },
  {
    href: "/dashboard/no-permissions",
    pattern: /^\/dashboard\/no-permissions$/,
    permissions: [],
  },

  // Locations
  {
    href: "/dashboard/locations",
    pattern: /^\/dashboard\/locations$/,
    permissions: ["view locations"],
  },
  {
    href: "/dashboard/locations/create",
    pattern: /^\/dashboard\/locations\/create$/,
    permissions: ["create locations"],
  },
  {
    href: "/dashboard/locations/[id]",
    pattern: /^\/dashboard\/locations\/\d+$/,
    permissions: ["view locations"],
  },
  {
    href: "/dashboard/locations/[id]/edit",
    pattern: /^\/dashboard\/locations\/\d+\/edit$/,
    permissions: ["edit locations"],
  },

  // Reports
  {
    href: "/dashboard/reports",
    pattern: /^\/dashboard\/reports$/,
    permissions: ["view reports"],
  },
  {
    href: "/dashboard/reports/sales",
    pattern: /^\/dashboard\/reports\/sales$/,
    permissions: ["view reports"],
  },

  // Roles
  {
    href: "/dashboard/roles",
    pattern: /^\/dashboard\/roles$/,
    permissions: ["view roles"],
  },
  {
    href: "/dashboard/roles/create",
    pattern: /^\/dashboard\/roles\/create$/,
    permissions: ["create roles"],
  },
  {
    href: "/dashboard/roles/[id]",
    pattern: /^\/dashboard\/roles\/\d+$/,
    permissions: ["view roles"],
  },
  {
    href: "/dashboard/roles/[id]/edit",
    pattern: /^\/dashboard\/roles\/\d+\/edit$/,
    permissions: ["edit roles"],
  },

  // Settings
  {
    href: "/dashboard/settings",
    pattern: /^\/dashboard\/settings$/,
    permissions: ["view dashboard"],
  },
  {
    href: "/dashboard/settings/preferences",
    pattern: /^\/dashboard\/settings\/preferences$/,
    permissions: ["view dashboard"],
  },
  {
    href: "/dashboard/settings/profile",
    pattern: /^\/dashboard\/settings\/profile$/,
    permissions: ["view dashboard"],
  },
  {
    href: "/dashboard/settings/system",
    pattern: /^\/dashboard\/settings\/system$/,
    permissions: ["view dashboard"],
  },

  // Users
  {
    href: "/dashboard/users",
    pattern: /^\/dashboard\/users$/,
    permissions: ["view users"],
  },
  {
    href: "/dashboard/users/create",
    pattern: /^\/dashboard\/users\/create$/,
    permissions: ["create users"],
  },
  {
    href: "/dashboard/users/[id]",
    pattern: /^\/dashboard\/users\/\d+$/,
    permissions: ["view users"],
  },
  {
    href: "/dashboard/users/[id]/edit",
    pattern: /^\/dashboard\/users\/\d+\/edit$/,
    permissions: ["edit users"],
  },
];

// Helper function to check if user has any of the required permissions
export function hasRequiredPermissions(
  userPermissions: string[],
  requiredPermissions: string[],
): boolean {
  if (requiredPermissions.length === 0) {
    return true; // No permissions required, accessible to all
  }

  return requiredPermissions.some((permission) =>
    userPermissions.includes(permission),
  );
}

// Helper function to get user permissions from session
export function getUserPermissions(user: any): string[] {
  if (!user?.role?.permissions) {
    return [];
  }

  return user.role.permissions.map((permission: any) => permission.name);
}

// Helper function to find the appropriate permissions for a given path
export function getPermissionsForPath(pathname: string): string[] {
  // First, try to find exact match
  const exactMatch = routePermissions.find((route) =>
    route.pattern.test(pathname),
  );
  if (exactMatch) {
    return exactMatch.permissions;
  }

  // If no exact match, find the closest parent route
  const pathSegments = pathname.split("/").filter(Boolean);
  let closestParent: RoutePermission | null = null;
  let maxMatchLength = 0;

  for (const route of routePermissions) {
    const routeSegments = route.href.split("/").filter(Boolean);

    // Check if this route is a parent of the current path
    if (pathSegments.length > routeSegments.length) {
      const isParent = routeSegments.every(
        (segment, index) => pathSegments[index] === segment,
      );

      if (isParent && routeSegments.length > maxMatchLength) {
        closestParent = route;
        maxMatchLength = routeSegments.length;
      }
    }
  }

  return closestParent ? closestParent.permissions : [];
}
