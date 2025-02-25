import { NextResponse } from "next/server";
import { testSupabaseConnection } from "@/lib/supabase/test-connection";

export async function GET() {
  try {
    const result = await testSupabaseConnection();
    
    if (result.success) {
      return NextResponse.json({ 
        status: "success", 
        message: "Successfully connected to Supabase" 
      });
    } else {
      return NextResponse.json({ 
        status: "error", 
        message: `Failed to connect to Supabase: ${result.message}` 
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in Supabase test API:", error);
    return NextResponse.json({ 
      status: "error", 
      message: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
} 