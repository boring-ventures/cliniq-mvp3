import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// GET - Fetch all inventory items
export async function GET(req: NextRequest) {
  try {
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters for filtering
    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const search = url.searchParams.get("search");
    const lowStock = url.searchParams.get("lowStock") === "true";

    // Build filter conditions
    let whereClause: any = {};
    
    if (category && category !== "All Categories") {
      whereClause.category = category;
    }
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { supplier: { contains: search, mode: "insensitive" } },
      ];
    }
    
    if (lowStock) {
      whereClause.stockQuantity = {
        lte: prisma.inventoryItem.fields.minStock,
      };
    }

    const inventoryItems = await prisma.inventoryItem.findMany({
      where: whereClause,
      orderBy: { name: "asc" },
    });

    return NextResponse.json(inventoryItems);
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory items" },
      { status: 500 }
    );
  }
}

// POST - Create a new inventory item
export async function POST(req: NextRequest) {
  try {
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    
    // Validate required fields
    if (!data.name || !data.category) {
      return NextResponse.json(
        { error: "Name and category are required" },
        { status: 400 }
      );
    }

    // Create new inventory item
    const newItem = await prisma.inventoryItem.create({
      data: {
        name: data.name,
        category: data.category,
        description: data.description,
        stockQuantity: data.quantity || 0,
        unit: data.unit || "pcs",
        minStock: data.minStock || 10,
        supplier: data.supplier,
        price: data.price || 0,
        lastRestocked: data.lastRestocked ? new Date(data.lastRestocked) : new Date(),
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating inventory item:", error);
    return NextResponse.json(
      { error: "Failed to create inventory item" },
      { status: 500 }
    );
  }
} 