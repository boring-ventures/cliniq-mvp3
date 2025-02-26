import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// GET - Fetch usage logs for a specific inventory item
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    
    // Check if item exists
    const existingItem = await prisma.inventoryItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Inventory item not found" },
        { status: 404 }
      );
    }

    // Get usage logs with user information
    const usageLogs = await prisma.usageLog.findMany({
      where: { itemId: id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { usedAt: "desc" },
    });

    return NextResponse.json(usageLogs);
  } catch (error) {
    console.error("Error fetching usage logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage logs" },
      { status: 500 }
    );
  }
} 