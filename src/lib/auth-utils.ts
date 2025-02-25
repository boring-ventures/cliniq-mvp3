import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

// Define authOptions directly in this file as a temporary solution
export const authOptions = {
  providers: [],
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
};

// Define the Permission enum manually if it's not exported
enum PermissionEnum {
  CREATE_USER = "CREATE_USER",
  READ_USER = "READ_USER",
  UPDATE_USER = "UPDATE_USER",
  DELETE_USER = "DELETE_USER",
  // Add all your permissions here
}

/**
 * Get the current authenticated user from the session
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  try {
    // Define a proper type for the user object
    interface UserWithRole {
      id: string;
      email: string;
      name?: string;
      role: {
        id: string;
        name: string;
        permissions: {
          permission: string;
        }[];
      };
    }

    interface PrismaUserModel {
      findUnique: (args: {
        where: { email: string };
        include: {
          role: {
            include: {
              permissions: {
                select: {
                  permission: boolean;
                };
              };
            };
          };
        };
      }) => Promise<UserWithRole | null>;
    }

    interface ExtendedPrismaClient extends PrismaClient {
      User: PrismaUserModel;
    }

    const prismaWithUser = prisma as unknown as ExtendedPrismaClient;
    const user = await prismaWithUser.User.findUnique({
      where: { email: session.user.email },
      include: {
        role: {
          include: {
            permissions: {
              select: {
                permission: true,
              },
            },
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

/**
 * Check if the current user has the required permission
 */
export async function hasPermission(permission: string) {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  // Super Admin has all permissions
  if (user.role.name === "Super Admin") {
    return true;
  }

  // Check if user has the specific permission
  return user.role.permissions.some(
    (p: { permission: string }) => p.permission === permission
  );
}

/**
 * Middleware to check if the user has the required permission
 */
export async function requirePermission(
  request: NextRequest,
  permission: string
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const hasRequiredPermission = await hasPermission(permission);

  if (!hasRequiredPermission) {
    return NextResponse.json(
      { error: "Insufficient permissions" },
      { status: 403 }
    );
  }

  return null; // No error, continue with the request
}

/**
 * Get all permissions for the current user
 */
export async function getUserPermissions() {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  // Super Admin has all permissions
  if (user.role.name === "Super Admin") {
    return Object.values(PermissionEnum);
  }

  // Return user's permissions
  return user.role.permissions.map((p: { permission: string }) => p.permission);
}

/**
 * Check if the current user has any of the required permissions
 */
export async function hasAnyPermission(permissions: string[]) {
  const userPermissions = await getUserPermissions();

  return permissions.some((permission) => userPermissions.includes(permission));
}

/**
 * Check if the current user has all of the required permissions
 */
export async function hasAllPermissions(permissions: string[]) {
  const userPermissions = await getUserPermissions();

  return permissions.every((permission) =>
    userPermissions.includes(permission)
  );
}
