import { createClient } from "@supabase/supabase-js";

// Log environment variables availability (without exposing values)
console.log("Supabase URL available:", !!process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log(
  "Supabase Anon Key available:",
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
  throw new Error("Missing Supabase environment variables");
}

// Create the Supabase client outside the try block
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: "app-token",
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    autoRefreshToken: true,
    debug: process.env.NODE_ENV === "development",
  },
});

// Test the connection in a try block
try {
  console.log("Supabase client initialized with URL:", supabaseUrl);

  // Test the connection when in development
  if (process.env.NODE_ENV === "development") {
    supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log("Supabase auth state changed:", event, session?.user?.id);
    });
  }

  console.log("Supabase client initialized successfully");
} catch (error) {
  console.error("Error during Supabase client initialization:", error);
  // Don't throw here, as we still want to export the client
}

export const supabase = supabaseClient;
