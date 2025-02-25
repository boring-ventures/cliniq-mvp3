"use client";

import { ReactNode } from "react";
import { Permission } from "@prisma/client";
import { usePermissions } from "@/hooks/use-permissions";

interface PermissionGuardProps {
  /**
   * The permission(s) required to render the children
   */
  permissions: Permission | Permission[];

  /**
   * Whether all permissions are required (true) or any permission is sufficient (false)
   */
  requireAll?: boolean;

  /**
   * The content to render if the user has the required permissions
   */
  children: ReactNode;

  /**
   * Optional content to render if the user doesn't have the required permissions
   */
  fallback?: ReactNode;
}

/**
 * A component that conditionally renders content based on user permissions
 */
export function PermissionGuard({
  permissions,
  requireAll = false,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const { hasAllPermissions, hasAnyPermission } = usePermissions();

  // Convert single permission to array
  const permissionArray = Array.isArray(permissions)
    ? permissions
    : [permissions];

  // Check if user has the required permissions
  const hasRequiredPermissions = requireAll
    ? hasAllPermissions(permissionArray)
    : hasAnyPermission(permissionArray);

  // Render children if user has permissions, otherwise render fallback
  return hasRequiredPermissions ? <>{children}</> : <>{fallback}</>;
}

/**
 * A component that renders content only if the user has a specific permission
 */
export function HasPermission({
  permission,
  children,
  fallback = null,
}: {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { hasPermission } = usePermissions();

  return hasPermission(permission) ? <>{children}</> : <>{fallback}</>;
}
