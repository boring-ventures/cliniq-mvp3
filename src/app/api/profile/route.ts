import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    console.log("Profile creation request received");

    // Parse the JSON body
    const json = await req.json();
    console.log("Request body:", json);

    const { userId, email, firstName, lastName, avatarUrl } = json;

    if (!userId) {
      console.error("No userId provided");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if a profile already exists for this user
    console.log(`Checking if profile exists for user ${userId}`);
    const existingProfile = await prisma.profile.findUnique({
      where: { id: userId },
    });

    if (existingProfile) {
      console.error(`Profile already exists for user ${userId}`);
      return NextResponse.json(
        {
          error: "Profile already exists for this user",
          profile: existingProfile,
        },
        { status: 200 }
      );
    }

    // Check if email is already taken
    if (email) {
      console.log(`Checking if email ${email} is available`);
      const emailExists = await prisma.profile.findUnique({
        where: { email },
      });

      if (emailExists) {
        console.error(`Email ${email} is already taken`);
        return NextResponse.json(
          { error: "Email is already taken" },
          { status: 409 }
        );
      }
    }

    console.log(`Creating profile for user ${userId}`);
    try {
      const profile = await prisma.profile.create({
        data: {
          userId,
          email: email || "",
          hashedPassword: "", // This should be properly handled
          firstName,
          lastName,
          avatarUrl,
          role: "USER",
        },
      });

      console.log(`Profile created successfully for user ${userId}`);
      return NextResponse.json({ profile });
    } catch (dbError) {
      console.error(
        `Database error creating profile for user ${userId}:`,
        dbError
      );
      throw dbError;
    }
  } catch (error) {
    console.error("Profile creation error:", error);

    return NextResponse.json(
      { error: "Failed to create profile. Please try again." },
      { status: 500 }
    );
  }
}
