import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Permission } from "@prisma/client";
import { z } from "zod";
import { requirePermission } from "@/lib/auth-utils";

const prisma = new PrismaClient();

// Schema for role update
const roleUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  permissions: z.array(z.nativeEnum(Permission)).optional(),
});

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
    const roleId = resolvedParams.roleId;

    if (isNaN(roleId)) {
      return NextResponse.json({ error: "Invalid role ID" }, { status: 400 });
    }

    const role = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: {
          select: {
            permission: true,
          },
        },
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            isActive: true,
          },
        },
      },
    });

    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Format the response
    const formattedRole = {
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions.map((p) => p.permission),
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
    const roleId = resolvedParams.roleId;

    if (isNaN(roleId)) {
      return NextResponse.json({ error: "Invalid role ID" }, { status: 400 });
    }

    const body = await request.json();

    // Validate request body
    const validatedData = roleUpdateSchema.parse(body);

    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: true,
      },
    });

    if (!existingRole) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Check if name is being updated and if it's already taken
    if (validatedData.name && validatedData.name !== existingRole.name) {
      const nameExists = await prisma.role.findUnique({
        where: { name: validatedData.name },
      });

      if (nameExists) {
        return NextResponse.json(
          { error: "Role with this name already exists" },
          { status: 409 }
        );
      }
    }

    // Start a transaction to update role and permissions
    await prisma.$transaction(async (tx) => {
      // Update basic role information
      const role = await tx.role.update({
        where: { id: roleId },
        data: {
          name: validatedData.name,
          description: validatedData.description,
        },
      });

      // Update permissions if provided
      if (validatedData.permissions) {
        // Delete existing permissions
        await tx.rolePermission.deleteMany({
          where: { roleId },
        });

        // Add new permissions
        for (const permission of validatedData.permissions) {
          await tx.rolePermission.create({
            data: {
              roleId,
              permission,
            },
          });
        }
      }

      return role;
    });

    // Fetch the updated role with permissions
    const roleWithPermissions = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: {
          select: {
            permission: true,
          },
        },
        users: {
          select: {
            id: true,
          },
        },
      },
    });

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
    const roleId = resolvedParams.roleId;

    if (isNaN(roleId)) {
      return NextResponse.json({ error: "Invalid role ID" }, { status: 400 });
    }

    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        users: true,
      },
    });

    if (!existingRole) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Check if role has users assigned
    if (existingRole.users.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete role with assigned users",
          userCount: existingRole.users.length,
        },
        { status: 409 }
      );
    }

    // Delete role permissions first
    await prisma.rolePermission.deleteMany({
      where: { roleId },
    });

    // Delete the role
    await prisma.role.delete({
      where: { id: roleId },
    });

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
