import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`GET profile request received:`, request.url);
    const id = params.id;
    console.log(`GET profile request for profile ${id}`);

    if (!id) {
      console.error("No profile ID provided in GET request");
      return NextResponse.json(
        { error: "Profile ID is required" },
        { status: 400 }
      );
    }

    console.log(`Fetching profile with ID ${id}`);
    try {
      const profile = await prisma.profile.findUnique({
        where: { id },
      });

      if (!profile) {
        console.error(`Profile not found with ID ${id}`);
        return NextResponse.json(
          { error: "Profile not found" },
          { status: 404 }
        );
      }

      console.log(`Profile found with ID ${id}`);
      return NextResponse.json({ profile });
    } catch (dbError) {
      console.error(`Database error fetching profile ${id}:`, dbError);
      throw dbError;
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile. Please try again." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`PATCH profile request received:`, request.url);
    const id = params.id;

    if (!id) {
      console.error("No profile ID provided in PATCH request");
      return NextResponse.json(
        { error: "Profile ID is required" },
        { status: 400 }
      );
    }

    // Parse the JSON body
    const json = await request.json();
    console.log("PATCH request body:", json);

    // Check if profile exists
    const existingProfile = await prisma.profile.findUnique({
      where: { id },
    });

    if (!existingProfile) {
      console.error(`Profile not found with ID ${id} during update`);
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Update only the fields that exist in the schema
    console.log(`Updating profile with ID ${id}`);
    const profile = await prisma.profile.update({
      where: { id },
      data: {
        firstName: json.firstName,
        lastName: json.lastName,
        avatarUrl: json.avatarUrl,
        // Only include fields that exist in your schema
      },
    });

    console.log(`Profile updated successfully with ID ${id}`);
    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Error updating profile:", error);

    return NextResponse.json(
      { error: "Failed to update profile. Please try again." },
      { status: 500 }
    );
  }
}
