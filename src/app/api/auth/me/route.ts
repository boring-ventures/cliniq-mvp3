import { NextResponse } from "next/server";
import { getCurrentUser, getUserPermissions } from "@/lib/auth-utils";

// Add these interfaces at the top of the file
interface UserProfile {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role: {
    id: string;
    name: string;
    description?: string;
  };
  isActive?: boolean;
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get user permissions
    const permissions = await getUserPermissions();

    // Cast user to UserProfile type instead of using 'any'
    const userProfile = user as unknown as UserProfile;

    // Format the response with proper typing
    const userData = {
      id: user.id,
      email: user.email,
      firstName: userProfile.firstName || user.name?.split(" ")[0] || "",
      lastName:
        userProfile.lastName || user.name?.split(" ").slice(1).join(" ") || "",
      role: {
        id: user.role.id,
        name: user.role.name,
        description: userProfile.role.description || "",
      },
      permissions,
      isActive: userProfile.isActive ?? true,
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user information" },
      { status: 500 }
    );
  }
}
