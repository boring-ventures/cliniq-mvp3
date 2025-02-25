import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    if (!id) {
      return new Response(JSON.stringify({ error: "Profile ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId:id },
    });

    if (!profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ profile }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: "Internal server error", details: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    await prisma.$disconnect().catch(console.error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const json = await request.json();
    const { firstName, lastName, avatarUrl, isActive } = json;

    if (!id) {
      return new Response(JSON.stringify({ error: "Profile ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }); 
    }

    // Check if profile exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: id },
    });

    if (!existingProfile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Update profile
    const updatedProfile = await prisma.profile.update({
      where: { id },
      data: {
        firstName:
          firstName !== undefined ? firstName : existingProfile.firstName,
        lastName: lastName !== undefined ? lastName : existingProfile.lastName,
        avatarUrl:
          avatarUrl !== undefined ? avatarUrl : existingProfile.avatarUrl,
        isActive: isActive !== undefined ? isActive : existingProfile.isActive,
      },
    });

    return new Response(JSON.stringify({ profile: updatedProfile }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: "Internal server error", details: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    await prisma.$disconnect().catch(console.error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return new Response(JSON.stringify({ error: "Profile ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if profile exists
    const existingProfile = await prisma.profile.findUnique({
      where: { id },
    });

    if (!existingProfile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Instead of deleting, deactivate the profile
    const deactivatedProfile = await prisma.profile.update({
      where: { id },
      data: {
        isActive: false,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Profile deactivated successfully",
        profile: deactivatedProfile,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: "Internal server error", details: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    await prisma.$disconnect().catch(console.error);
  }
}
