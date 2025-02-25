import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Permission } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

/**
 * Get the current authenticated user from the session
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
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
}

/**
 * Check if the current user has the required permission
 */
export async function hasPermission(permission: Permission) {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  // Super Admin has all permissions
  if (user.role.name === "Super Admin") {
    return true;
  }

  // Check if user has the specific permission
  return user.role.permissions.some((p) => p.permission === permission);
}

/**
 * Middleware to check if the user has the required permission
 */
export async function requirePermission(
  request: NextRequest,
  permission: Permission
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
    return Object.values(Permission);
  }

  // Return user's permissions
  return user.role.permissions.map((p) => p.permission);
}

/**
 * Check if the current user has any of the required permissions
 */
export async function hasAnyPermission(permissions: Permission[]) {
  const userPermissions = await getUserPermissions();

  return permissions.some((permission) => userPermissions.includes(permission));
}

/**
 * Check if the current user has all of the required permissions
 */
export async function hasAllPermissions(permissions: Permission[]) {
  const userPermissions = await getUserPermissions();

  return permissions.every((permission) =>
    userPermissions.includes(permission)
  );
}
