import { createClient } from "@supabase/supabase-js";
import { corsHeaders } from "../_shared/cors.js";

declare const serve: (handler: (req: Request) => Promise<Response>) => void;

interface GetUserRequest {
  userId: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Check for auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create a Supabase client with the auth header
    const supabaseClient = createClient(
      "https://your-project.supabase.co", // Replace with your Supabase URL
      "your-anon-key", // Replace with your anon key
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get the user's profile with role assignments and permissions
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select(
        `
        *,
        role_assignments(
          role
        ),
        permissions(
          permission
        )
      `
      )
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: "Failed to get user profile" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if the user has the SUPERADMIN role or READ_USER permission
    const isSuperAdmin = profile.role_assignments?.some(
      (assignment: any) => assignment.role === "SUPERADMIN"
    );
    const hasReadUserPermission = profile.permissions?.some(
      (p: any) => p.permission === "READ_USER"
    );

    if (!isSuperAdmin && !hasReadUserPermission) {
      return new Response(
        JSON.stringify({ error: "Insufficient permissions" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse the request body to get the userId
    const { userId } = (await req.json()) as GetUserRequest;

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create a service role client to get the user
    const supabaseAdmin = createClient(
      "https://your-project.supabase.co", // Replace with your Supabase URL
      "your-service-role-key", // Replace with your service role key
      { auth: { persistSession: false } }
    );

    // Get the user profile with role assignments
    const { data: userProfile, error: userProfileError } = await supabaseAdmin
      .from("profiles")
      .select(
        `
        id,
        email,
        full_name,
        username,
        created_at,
        role_assignments(
          role
        )
      `
      )
      .eq("id", userId)
      .single();

    if (userProfileError) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(userProfile), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
