/**
 * Access Control Rules for Agri Hub Liberia
 * Defines which user roles can access which routes
 */

export type UserRole = 'admin' | 'extension-officer' | 'farmer' | 'buyer' | 'supplier'

export interface AccessRule {
  path: string
  allowedRoles: UserRole[]
  redirectTo?: string
}

/**
 * PRD-compliant role access control
 * 
 * Super Admin: Full platform access
 * Extension Officer: Content + farmer management  
 * Farmer: Personal dashboard + market/weather/tips
 * Buyer: Marketplace + farmer listings
 */
export const ACCESS_RULES: AccessRule[] = [
  // Admin routes - Super Admin only
  {
    path: '/admin',
    allowedRoles: ['admin', 'extension-officer'],
    redirectTo: '/dashboard',
  },
  
  // Extension officer specific routes
  {
    path: '/admin/farmers',
    allowedRoles: ['admin', 'extension-officer'],
    redirectTo: '/dashboard',
  },
  {
    path: '/admin/content',
    allowedRoles: ['admin', 'extension-officer'],
    redirectTo: '/dashboard',
  },
  
  // Admin-only routes
  {
    path: '/admin/dashboard',
    allowedRoles: ['admin'],
    redirectTo: '/admin/farmers',
  },
  {
    path: '/admin/users',
    allowedRoles: ['admin'],
    redirectTo: '/dashboard',
  },
  {
    path: '/admin/analytics',
    allowedRoles: ['admin'],
    redirectTo: '/dashboard',
  },
  
  // Farmer routes - accessible by farmers
  {
    path: '/dashboard',
    allowedRoles: ['farmer', 'admin', 'extension-officer'],
    redirectTo: '/marketplace',
  },
  {
    path: '/my-farm',
    allowedRoles: ['farmer', 'admin'],
    redirectTo: '/marketplace',
  },
  {
    path: '/inventory',
    allowedRoles: ['farmer', 'admin'],
    redirectTo: '/marketplace',
  },
  
  // Marketplace - accessible by buyers, farmers, and admins
  {
    path: '/marketplace',
    allowedRoles: ['buyer', 'farmer', 'admin'],
    redirectTo: '/dashboard',
  },
  
  // Public features - accessible by all authenticated users
  {
    path: '/market',
    allowedRoles: ['farmer', 'buyer', 'admin', 'extension-officer'],
    redirectTo: '/auth/login',
  },
  {
    path: '/weather',
    allowedRoles: ['farmer', 'buyer', 'admin', 'extension-officer'],
    redirectTo: '/auth/login',
  },
  {
    path: '/tips',
    allowedRoles: ['farmer', 'buyer', 'admin', 'extension-officer'],
    redirectTo: '/auth/login',
  },
]

/**
 * Check if a user role has access to a specific path
 */
export function canAccess(userRole: UserRole, path: string): boolean {
  const rule = ACCESS_RULES.find((r) => path.startsWith(r.path))
  
  if (!rule) {
    // No rule defined = allow access (public route)
    return true
  }
  
  return rule.allowedRoles.includes(userRole)
}

/**
 * Get redirect path for unauthorized access
 */
export function getRedirectPath(userRole: UserRole, path: string): string {
  const rule = ACCESS_RULES.find((r) => path.startsWith(r.path))
  
  if (!rule) {
    return '/dashboard'
  }
  
  // Role-specific default redirects per PRD
  if (userRole === 'admin') return '/admin/dashboard'
  if (userRole === 'extension-officer') return '/admin/farmers'
  if (userRole === 'buyer') return '/marketplace'
  if (userRole === 'farmer') return '/dashboard'
  
  return rule.redirectTo || '/dashboard'
}

/**
 * Get default route for a user role after login
 */
export function getDefaultRoute(userRole: UserRole): string {
  switch (userRole) {
    case 'admin':
      return '/admin/dashboard'
    case 'extension-officer':
      return '/admin/farmers'
    case 'buyer':
      return '/marketplace'
    case 'farmer':
      return '/dashboard'
    default:
      return '/dashboard'
  }
}
