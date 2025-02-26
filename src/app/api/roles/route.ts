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

// Schema for role creation
const roleCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  permissions: z.array(z.string()),
});

// Add this interface at the top of the file
interface RoleWithPermissions {
  id: string;
  name: string;
  description: string;
  permissions: { permission: string }[];
  userCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(request: NextRequest) {
  // Check if user has permission to read roles
  const permissionError = await requirePermission(
    request,
    Permission.MANAGE_SETTINGS
  );
  if (permissionError) return permissionError;

  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: {
      OR?: Array<{
        name?: { contains: string; mode: "insensitive" };
        description?: { contains: string; mode: "insensitive" };
      }>;
    } = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get roles with pagination
    const roles = (await prisma.$queryRaw`
      SELECT r.*, 
        (SELECT json_agg(json_build_object('permission', rp.permission)) 
         FROM "RolePermission" rp 
         WHERE rp."roleId" = r.id) as permissions,
        (SELECT count(*) 
         FROM "User" u 
         WHERE u."roleId" = r.id) as "userCount"
      FROM "Role" r
      ${search ? `WHERE r.name ILIKE '%${search}%' OR r.description ILIKE '%${search}%'` : ""}
      ORDER BY r.name ASC
      LIMIT ${limit} OFFSET ${skip}
    `) as unknown as RoleWithPermissions[];

    // Transform the data to include permissions as an array
    const formattedRoles = roles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions.map((p) => p.permission),
      userCount: role.userCount,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    }));

    // Get total count for pagination
    const totalResult = (await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM "Role" r
      ${search ? `WHERE r.name ILIKE '%${search}%' OR r.description ILIKE '%${search}%'` : ""}
    `) as { count: number }[];
    const total = Number.parseInt(totalResult[0].count.toString(), 10);

    return NextResponse.json({
      roles: formattedRoles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "Failed to fetch roles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Check if user has permission to create roles
  const permissionError = await requirePermission(
    request,
    Permission.MANAGE_SETTINGS
  );
  if (permissionError) return permissionError;

  try {
    const body = await request.json();

    // Validate request body
    const validatedData = roleCreateSchema.parse(body);

    // Check if role with name already exists
    const existingRoleResult = (await prisma.$queryRaw`
      SELECT id FROM "Role" WHERE name = ${validatedData.name}
    `) as { id: string }[];
    const existingRole = existingRoleResult.length > 0;

    if (existingRole) {
      return NextResponse.json(
        { error: "Role with this name already exists" },
        { status: 409 }
      );
    }

    // Create the role with raw SQL
    const newRoleResult = (await prisma.$queryRaw`
      INSERT INTO "Role" (name, description, "createdAt", "updatedAt")
      VALUES (${validatedData.name}, ${validatedData.description || ""}, NOW(), NOW())
      RETURNING id, name, description, "createdAt", "updatedAt"
    `) as {
      id: string;
      name: string;
      description: string;
      createdAt: Date;
      updatedAt: Date;
    }[];

    const newRole = newRoleResult[0];

    // Add permissions
    for (const permission of validatedData.permissions) {
      await prisma.$executeRaw`
        INSERT INTO "RolePermission" ("roleId", permission)
        VALUES (${newRole.id}, ${permission})
      `;
    }

    // Get the created role with permissions
    const roleWithPermissionsResult = (await prisma.$queryRaw`
      SELECT r.*, 
        (SELECT json_agg(json_build_object('permission', rp.permission)) 
         FROM "RolePermission" rp 
         WHERE rp."roleId" = r.id) as permissions
      FROM "Role" r
      WHERE r.id = ${newRole.id}
    `) as unknown as RoleWithPermissions[];
    const role = roleWithPermissionsResult[0];

    // Format the response
    const formattedRole = {
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions.map((p) => p.permission),
      userCount: role.userCount,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };

    return NextResponse.json(formattedRole, { status: 201 });
  } catch (error) {
    console.error("Error creating role:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create role" },
      { status: 500 }
    );
  }
}
