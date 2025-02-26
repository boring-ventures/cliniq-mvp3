import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { requirePermission } from "@/lib/auth-utils";

const prisma = new PrismaClient();

// Add this enum definition
enum Permission {
  MANAGE_SETTINGS = "MANAGE_SETTINGS",
  // Add other permissions used in the file
}

// Schema for role update
const roleUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

// Add this interface at the top of the file
interface RoleWithPermissions {
  id: string;
  name: string;
  description: string;
  permissions: { permission: string }[];
  users: {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    isActive?: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roleId: string }> }
) {
  // Check if user has permission to read roles
  const permissionError = await requirePermission(
    request,
    Permission.MANAGE_SETTINGS
  );
  if (permissionError) return permissionError;

  try {
    const resolvedParams = await params;
    const roleId = Number.parseInt(resolvedParams.roleId, 10);

    if (isNaN(roleId)) {
      return NextResponse.json({ error: "Invalid role ID" }, { status: 400 });
    }

    const role = (await prisma.$queryRaw`
      SELECT r.*, 
        (SELECT json_agg(json_build_object('permission', rp.permission)) 
         FROM "RolePermission" rp 
         WHERE rp."roleId" = r.id) as permissions,
        (SELECT json_agg(json_build_object('id', u.id, 'email', u.email, 'firstName', u.firstName, 'lastName', u.lastName, 'isActive', u.isActive)) 
         FROM "User" u 
         WHERE u."roleId" = r.id) as users
      FROM "Role" r
      WHERE r.id = ${roleId}
    `) as unknown as RoleWithPermissions;

    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Format the response
    const formattedRole = {
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      users: role.users,
      userCount: role.users.length,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };

    return NextResponse.json(formattedRole);
  } catch (error) {
    console.error("Error fetching role:", error);
    return NextResponse.json(
      { error: "Failed to fetch role" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ roleId: string }> }
) {
  // Check if user has permission to update roles
  const permissionError = await requirePermission(
    request,
    Permission.MANAGE_SETTINGS
  );
  if (permissionError) return permissionError;

  try {
    const resolvedParams = await params;
    const roleId = Number.parseInt(resolvedParams.roleId, 10);

    if (isNaN(roleId)) {
      return NextResponse.json({ error: "Invalid role ID" }, { status: 400 });
    }

    const body = await request.json();

    // Validate request body
    const validatedData = roleUpdateSchema.parse(body);

    // Check if role exists
    const existingRoleResult = (await prisma.$queryRaw`
      SELECT r.*, 
        (SELECT json_agg(json_build_object('permission', rp.permission)) 
         FROM "RolePermission" rp 
         WHERE rp."roleId" = r.id) as permissions
      FROM "Role" r
      WHERE r.id = ${roleId}
    `) as unknown as RoleWithPermissions[];
    const existingRole =
      existingRoleResult[0] as unknown as RoleWithPermissions;

    // Check if name is being updated and if it's already taken
    if (validatedData.name && validatedData.name !== existingRole.name) {
      const nameExistsResult = (await prisma.$queryRaw`
        SELECT id FROM "Role" WHERE name = ${validatedData.name}
      `) as { id: string }[];
      const nameExists = nameExistsResult.length > 0;

      if (nameExists) {
        return NextResponse.json(
          { error: "Role with this name already exists" },
          { status: 409 }
        );
      }
    }

    // Update role using raw queries
    await prisma.$executeRaw`
      UPDATE "Role" 
      SET name = ${validatedData.name || existingRole.name},
          description = ${validatedData.description || existingRole.description},
          "updatedAt" = NOW()
      WHERE id = ${roleId}
    `;

    // Update permissions if provided
    if (validatedData.permissions) {
      // Delete existing permissions
      await prisma.$executeRaw`
        DELETE FROM "RolePermission" WHERE "roleId" = ${roleId}
      `;

      // Add new permissions
      for (const permission of validatedData.permissions) {
        await prisma.$executeRaw`
          INSERT INTO "RolePermission" ("roleId", permission)
          VALUES (${roleId}, ${permission})
        `;
      }
    }

    // Fetch the updated role with permissions
    const roleWithPermissions = (await prisma.$queryRaw`
      SELECT r.*, 
        (SELECT json_agg(json_build_object('permission', rp.permission)) 
         FROM "RolePermission" rp 
         WHERE rp."roleId" = r.id) as permissions,
        (SELECT json_agg(json_build_object('id', u.id, 'email', u.email, 'firstName', u.firstName, 'lastName', u.lastName, 'isActive', u.isActive)) 
         FROM "User" u 
         WHERE u."roleId" = r.id) as users
      FROM "Role" r
      WHERE r.id = ${roleId}
    `) as unknown as RoleWithPermissions;

    if (!roleWithPermissions) {
      throw new Error("Failed to fetch updated role");
    }

    // Format the response
    const formattedRole = {
      id: roleWithPermissions.id,
      name: roleWithPermissions.name,
      description: roleWithPermissions.description,
      permissions: roleWithPermissions.permissions.map((p) => p.permission),
      userCount: roleWithPermissions.users.length,
      createdAt: roleWithPermissions.createdAt,
      updatedAt: roleWithPermissions.updatedAt,
    };

    return NextResponse.json(formattedRole);
  } catch (error) {
    console.error("Error updating role:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ roleId: string }> }
) {
  // Check if user has permission to delete roles
  const permissionError = await requirePermission(
    request,
    Permission.MANAGE_SETTINGS
  );
  if (permissionError) return permissionError;

  try {
    const resolvedParams = await params;
    const roleId = Number.parseInt(resolvedParams.roleId, 10);

    if (isNaN(roleId)) {
      return NextResponse.json({ error: "Invalid role ID" }, { status: 400 });
    }

    // Check if role exists
    const existingRoleResult = (await prisma.$queryRaw`
      SELECT r.*, 
        (SELECT json_agg(json_build_object('id', u.id)) 
         FROM "User" u 
         WHERE u."roleId" = r.id) as users
      FROM "Role" r
      WHERE r.id = ${roleId}
    `) as unknown as RoleWithPermissions[];
    const existingRole = existingRoleResult[0];

    if (!existingRole) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Check if role has users assigned
    if (existingRole.users && existingRole.users.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete role with assigned users",
          userCount: existingRole.users.length,
        },
        { status: 409 }
      );
    }

    // Delete role permissions first
    await prisma.$executeRaw`
      DELETE FROM "RolePermission" WHERE "roleId" = ${roleId}
    `;

    // Delete the role
    await prisma.$executeRaw`
      DELETE FROM "Role" WHERE id = ${roleId}
    `;

    return NextResponse.json({
      message: "Role deleted successfully",
      id: roleId,
    });
  } catch (error) {
    console.error("Error deleting role:", error);
    return NextResponse.json(
      { error: "Failed to delete role" },
      { status: 500 }
    );
  }
}
