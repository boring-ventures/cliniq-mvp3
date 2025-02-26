import { prisma } from "@/lib/prisma";
import { RoleEnum } from "@prisma/client";

// Define our Permission enum
export enum Permission {
  CREATE_USER = "CREATE_USER",
  READ_USER = "READ_USER",
  UPDATE_USER = "UPDATE_USER",
  DELETE_USER = "DELETE_USER",
  CREATE_ROLE = "CREATE_ROLE",
  READ_ROLE = "READ_ROLE",
  UPDATE_ROLE = "UPDATE_ROLE",
  DELETE_ROLE = "DELETE_ROLE",
  // Add other permissions as needed
}

/**
 * Check if a user has a specific permission
 * @param userId The Supabase user ID
 * @param permission The permission to check
 * @returns A boolean indicating if the user has the permission
 */
export async function hasPermission(
  userId: string,
  permission: Permission
): Promise<boolean> {
  try {
    const profile = await prisma.profile.findFirst({
      where: { userId },
    });

    if (!profile) return false;

    // Super admin has all permissions
    if (profile.role === RoleEnum.SUPER_ADMIN) {
      return true;
    }

    // Get permissions for this role from your database
    // Adjust this query to match your actual schema
    const permissions = await getPermissionsForRole(profile.role);
    return permissions.includes(permission);
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
}

// Helper function to get permissions for a role
async function getPermissionsForRole(role: RoleEnum): Promise<Permission[]> {
  // This is a simplified implementation
  // In a real app, you would query your database for role permissions

  switch (role) {
    case RoleEnum.ADMIN:
      return [
        Permission.CREATE_USER,
        Permission.READ_USER,
        Permission.UPDATE_USER,
        Permission.DELETE_USER,
        Permission.READ_ROLE,
      ];
    case RoleEnum.DOCTOR:
      return [Permission.READ_USER];
    case RoleEnum.RECEPTIONIST:
      return [Permission.READ_USER];
    case RoleEnum.USER:
      return [];
    default:
      return [];
  }
}

/**
 * Check if a user has all of the specified permissions
 * @param userId The Supabase user ID
 * @param permissions The permissions to check
 * @returns A boolean indicating if the user has all the permissions
 */
export async function hasAllPermissions(
  userId: string,
  permissions: Permission[]
): Promise<boolean> {
  try {
    const profile = await prisma.profile.findFirst({
      where: { userId },
    });

    if (!profile) return false;

    // Super admin has all permissions
    if (profile.role === RoleEnum.SUPER_ADMIN) {
      return true;
    }

    // Get permissions for this role
    const userPermissions = await getPermissionsForRole(profile.role);

    // Check if user has all required permissions
    return permissions.every((permission) =>
      userPermissions.includes(permission)
    );
  } catch (error) {
    console.error("Error checking permissions:", error);
    return false;
  }
}

/**
 * Check if a user has any of the specified permissions
 * @param userId The Supabase user ID
 * @param permissions The permissions to check
 * @returns A boolean indicating if the user has any of the permissions
 */
export async function hasAnyPermission(
  userId: string,
  permissions: Permission[]
): Promise<boolean> {
  try {
    const profile = await prisma.profile.findFirst({
      where: { userId },
    });

    if (!profile) return false;

    // Super admin has all permissions
    if (profile.role === RoleEnum.SUPER_ADMIN) {
      return true;
    }

    // Get permissions for this role
    const userPermissions = await getPermissionsForRole(profile.role);

    // Check if user has any required permission
    return permissions.some((permission) =>
      userPermissions.includes(permission)
    );
  } catch (error) {
    console.error("Error checking permissions:", error);
    return false;
  }
}

/**
 * Get all permissions for a user
 * @param userId The Supabase user ID
 * @returns An array of permissions the user has
 */
export async function getUserPermissions(
  userId: string
): Promise<Permission[]> {
  try {
    const profile = await prisma.profile.findFirst({
      where: { userId },
    });

    if (!profile) return [];

    // Super admin has all permissions
    if (profile.role === RoleEnum.SUPER_ADMIN) {
      return Object.values(Permission);
    }

    // Get permissions for this role
    return await getPermissionsForRole(profile.role);
  } catch (error) {
    console.error("Error getting user permissions:", error);
    return [];
  }
}
