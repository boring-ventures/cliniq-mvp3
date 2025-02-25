import { supabase } from "./client";

/**
 * Test the Supabase connection
 * This function can be used to verify that your Supabase connection is working correctly
 */
export async function testSupabaseConnection() {
  try {
    // A simple query to test the connection
    const { error } = await supabase
      .from("_test_connection")
      .select("*")
      .limit(1);

    if (error) {
      console.error("Supabase connection error:", error.message);
      return { success: false, message: error.message };
    }

    console.log("Supabase connection successful!");
    return { success: true, message: "Connection successful" };
  } catch (error) {
    console.error("Unexpected error testing Supabase connection:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Example usage:
 *
 * import { testSupabaseConnection } from "@/lib/supabase/test-connection";
 *
 * // In an async function:
 * const result = await testSupabaseConnection();
 * if (result.success) {
 *   console.log("Connected to Supabase!");
 * } else {
 *   console.error("Failed to connect:", result.message);
 * }
 */
