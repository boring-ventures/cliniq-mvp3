import { createClient } from "@supabase/supabase-js";
import { corsHeaders } from "../_shared/cors.js";

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

    // Get all permissions from the user's roles
    const userPermissions = new Set<string>();

    // If the user is a super admin, get all permissions from the database
    if (profile.role === "SUPERADMIN") {
      const { data: allPermissions } = await supabaseClient
        .from("role_permissions")
        .select("permission")
        .order("permission");

      if (allPermissions) {
        allPermissions.forEach((p: any) => {
          userPermissions.add(p.permission);
        });
      }
    } else {
      // Otherwise, get permissions from the user's roles
      profile.roles.forEach((roleAssignment: any) => {
        roleAssignment.role.permissions.forEach((p: any) => {
          userPermissions.add(p.permission);
        });
      });
    }

    return new Response(
      JSON.stringify({ permissions: Array.from(userPermissions) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
