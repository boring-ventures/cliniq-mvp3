import { Permission } from "@prisma/client";
import { prisma } from "@/lib/prisma";

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
    // Get the user's profile
    const profile = await prisma.profile.findFirst({
      where: { userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: true,
              },
            },
          },
        },
      },
    });

    if (!profile) {
      return false;
    }

    // Super admin has all permissions
    if (profile.role === "SUPERADMIN") {
      return true;
    }

    // Check if any of the user's roles have the required permission
    return profile.roles.some((roleAssignment) =>
      roleAssignment.role.permissions.some((p) => p.permission === permission)
    );
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
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
    // Get the user's profile
    const profile = await prisma.profile.findFirst({
      where: { userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: true,
              },
            },
          },
        },
      },
    });

    if (!profile) {
      return false;
    }

    // Super admin has all permissions
    if (profile.role === "SUPERADMIN") {
      return true;
    }

    // Get all permissions from the user's roles
    const userPermissions = new Set<Permission>();
    profile.roles.forEach((roleAssignment) => {
      roleAssignment.role.permissions.forEach((p) => {
        userPermissions.add(p.permission);
      });
    });

    // Check if the user has all the required permissions
    return permissions.every((permission) => userPermissions.has(permission));
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
    // Get the user's profile
    const profile = await prisma.profile.findFirst({
      where: { userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: true,
              },
            },
          },
        },
      },
    });

    if (!profile) {
      return false;
    }

    // Super admin has all permissions
    if (profile.role === "SUPERADMIN") {
      return true;
    }

    // Get all permissions from the user's roles
    const userPermissions = new Set<Permission>();
    profile.roles.forEach((roleAssignment) => {
      roleAssignment.role.permissions.forEach((p) => {
        userPermissions.add(p.permission);
      });
    });

    // Check if the user has any of the required permissions
    return permissions.some((permission) => userPermissions.has(permission));
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
    // Get the user's profile
    const profile = await prisma.profile.findFirst({
      where: { userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: true,
              },
            },
          },
        },
      },
    });

    if (!profile) {
      return [];
    }

    // Super admin has all permissions
    if (profile.role === "SUPERADMIN") {
      return Object.values(Permission);
    }

    // Get all permissions from the user's roles
    const userPermissions = new Set<Permission>();
    profile.roles.forEach((roleAssignment) => {
      roleAssignment.role.permissions.forEach((p) => {
        userPermissions.add(p.permission);
      });
    });

    return Array.from(userPermissions);
  } catch (error) {
    console.error("Error getting user permissions:", error);
    return [];
  }
}
