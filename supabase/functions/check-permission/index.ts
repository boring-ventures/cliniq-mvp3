import { corsHeaders } from "../_shared/cors.js";
import { createClient } from "@supabase/supabase-js";

interface RequestBody {
  permission: string;
}

// Declare serve function type
declare const serve: (handler: (req: Request) => Promise<Response>) => void;

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the authorization header from the request
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

    // Parse the request body
    const { permission } = (await req.json()) as RequestBody;

    if (!permission) {
      return new Response(JSON.stringify({ error: "Permission is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get the user's profile with roles and permissions
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select(
        `
        id,
        role,
        roles:role_assignments(
          role:roles(
            id,
            name,
            permissions:role_permissions(
              permission
            )
          )
        )
      `
      )
      .eq("userId", user.id)
      .single();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Super admin has all permissions
    if (profile.role === "SUPERADMIN") {
      return new Response(JSON.stringify({ hasPermission: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if any of the user's roles have the required permission
    const hasPermission = profile.roles.some((roleAssignment: any) =>
      roleAssignment.role.permissions.some(
        (p: any) => p.permission === permission
      )
    );

    return new Response(JSON.stringify({ hasPermission }), {
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
