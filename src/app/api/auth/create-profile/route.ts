import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { RoleEnum } from "@prisma/client";

// This route is specifically for creating profiles during sign-up
// It doesn't require authentication
export async function POST(req: Request) {
  try {
    console.log("Received request to create profile during sign-up");
    const json = await req.json();
    const {
      firstName,
      lastName,
      email,
      userId,
      avatarUrl,
      role = "USER",
    } = json;

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return new Response(
        JSON.stringify({ 
          error: "Profile already exists for this user",
          profile: existingProfile 
        }),
        {
          status: 200, // Return 200 instead of 409 to avoid errors during sign-up
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check if email is already taken
    if (email) {
      const emailExists = await prisma.profile.findUnique({
        where: { email },
      });

      if (emailExists) {
        return new Response(
          JSON.stringify({ error: "Email is already taken" }),
          {
            status: 409,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    console.log(`Creating profile for user ${userId} with email ${email}`);
    
    // Create profile in one step for simplicity during sign-up
    const profile = await prisma.profile.create({
      data: {
        userId,
        email: email || "",
        hashedPassword: "", // Empty password, should be set properly
        firstName: firstName || null,
        lastName: lastName || null,
        avatarUrl: avatarUrl || null,
        role: role as RoleEnum,
        isActive: true,
      },
    });

    console.log(`Profile created successfully: ${profile.id}`);
    
    return new Response(JSON.stringify({ profile }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating profile:", error);
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