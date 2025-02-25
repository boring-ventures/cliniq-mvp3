import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";
import { corsHeaders } from "../_shared/cors.ts";

interface RequestBody {
  permissions: string[];
}

serve(async (req) => {
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
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
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
    const { permissions } = (await req.json()) as RequestBody;

    if (
      !permissions ||
      !Array.isArray(permissions) ||
      permissions.length === 0
    ) {
      return new Response(
        JSON.stringify({ error: "Permissions array is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
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
      return new Response(JSON.stringify({ hasAllPermissions: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get all permissions from the user's roles
    const userPermissions = new Set<string>();
    profile.roles.forEach((roleAssignment: any) => {
      roleAssignment.role.permissions.forEach((p: any) => {
        userPermissions.add(p.permission);
      });
    });

    // Check if the user has all the required permissions
    const hasAllPermissions = permissions.every((permission) =>
      userPermissions.has(permission)
    );

    return new Response(JSON.stringify({ hasAllPermissions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
