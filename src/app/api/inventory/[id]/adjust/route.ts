import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// POST - Adjust inventory stock (increase or decrease)
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const data = await req.json();

    // Validate required fields
    if (data.quantity === undefined) {
      return NextResponse.json(
        { error: "Quantity is required" },
        { status: 400 }
      );
    }

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

    // Calculate new quantity
    const newQuantity = existingItem.stockQuantity + data.quantity;

    // Ensure quantity doesn't go below zero
    if (newQuantity < 0) {
      return NextResponse.json(
        { error: "Stock quantity cannot be negative" },
        { status: 400 }
      );
    }

    // Update the item's stock quantity
    const updatedItem = await prisma.inventoryItem.update({
      where: { id },
      data: {
        stockQuantity: newQuantity,
        ...(data.quantity > 0 ? { lastRestocked: new Date() } : {}),
      },
    });

    // Create usage log
    await prisma.usageLog.create({
      data: {
        itemId: id,
        usedBy: session.user.id,
        quantity: Math.abs(data.quantity),
        notes: data.notes || (data.quantity > 0 ? "Stock added" : "Stock used"),
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error adjusting inventory stock:", error);
    return NextResponse.json(
      { error: "Failed to adjust inventory stock" },
      { status: 500 }
    );
  }
}
