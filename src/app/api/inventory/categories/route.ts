import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// GET - Fetch all unique categories
export async function GET(req: NextRequest) {
  try {
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get distinct categories from inventory items
    const categories = await prisma.inventoryItem.findMany({
      where: {
        isCategory: false, // Only get real categories
      },
      select: {
        category: true,
      },
      distinct: ['category'],
      orderBy: {
        category: 'asc',
      },
    });

    // Extract category names (don't add "All Categories" here)
    const categoryList = categories.map(c => c.category);

    return NextResponse.json(categoryList);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST - Create a new category
export async function POST(req: NextRequest) {
  try {
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { category } = await req.json();

    // Validate category
    if (!category || typeof category !== "string") {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    // Check if category already exists
    const existingCategory = await prisma.inventoryItem.findFirst({
      where: { category },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400 }
      );
    }

    // Create a dummy item to establish the category
    // (You might want to create a separate categories table instead)
    await prisma.inventoryItem.create({
      data: {
        name: `${category} Category`,
        category,
        description: `Category placeholder for ${category}`,
        stockQuantity: 0,
        unit: "pcs",
        minStock: 0,
        price: 0,
        isCategory: true, // You'll need to add this field to your schema
      },
    });

    return NextResponse.json({ message: "Category created successfully" });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
} 