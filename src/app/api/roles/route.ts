import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Permission } from "@prisma/client";
import { z } from "zod";
import { requirePermission } from "@/lib/auth-utils";

const prisma = new PrismaClient();

// Schema for role creation
const roleCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  permissions: z.array(z.nativeEnum(Permission)),
});

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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
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
    const roles = await prisma.role.findMany({
      where,
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
      skip,
      take: limit,
      orderBy: {
        name: "asc",
      },
    });

    // Transform the data to include permissions as an array
    const formattedRoles = roles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions.map((p) => p.permission),
      userCount: role.users.length,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    }));

    // Get total count for pagination
    const total = await prisma.role.count({ where });

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
    const existingRole = await prisma.role.findUnique({
      where: { name: validatedData.name },
    });

    if (existingRole) {
      return NextResponse.json(
        { error: "Role with this name already exists" },
        { status: 409 }
      );
    }

    // Create the role with permissions
    const role = await prisma.role.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || "",
        permissions: {
          create: validatedData.permissions.map((permission) => ({
            permission,
          })),
        },
      },
      include: {
        permissions: {
          select: {
            permission: true,
          },
        },
      },
    });

    // Format the response
    const formattedRole = {
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions.map((p) => p.permission),
      userCount: 0,
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
