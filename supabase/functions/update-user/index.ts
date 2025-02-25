import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";
import { UserRole } from "../_shared/types.ts";

interface UpdateUserRequest {
  userId: string;
  email?: string;
  fullName?: string;
  username?: string;
  role?: UserRole;
}

serve(async (req) => {
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

    // Check if the user has the SUPERADMIN role or UPDATE_USER permission
    const isSuperAdmin = profile.role_assignments?.some(
      (assignment) => assignment.role === "SUPERADMIN"
    );
    const hasUpdateUserPermission = profile.permissions?.some(
      (p) => p.permission === "UPDATE_USER"
    );

    if (!isSuperAdmin && !hasUpdateUserPermission) {
      return new Response(
        JSON.stringify({ error: "Insufficient permissions" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse the request body
    const { userId, email, fullName, username, role } =
      (await req.json()) as UpdateUserRequest;

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create a service role client to update the user
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Update the user's email if provided
    if (email) {
      const { error: updateEmailError } =
        await supabaseAdmin.auth.admin.updateUserById(userId, { email });

      if (updateEmailError) {
        return new Response(
          JSON.stringify({ error: updateEmailError.message }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Update the user's profile if fullName or username is provided
    if (fullName || username) {
      const updates: Record<string, any> = {};
      if (fullName) updates.full_name = fullName;
      if (username) updates.username = username;

      const { error: updateProfileError } = await supabaseAdmin
        .from("profiles")
        .update(updates)
        .eq("id", userId);

      if (updateProfileError) {
        return new Response(
          JSON.stringify({ error: updateProfileError.message }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Update the user's role if provided
    if (role) {
      // First, get the current role assignment
      const { data: currentRoleAssignment, error: roleQueryError } =
        await supabaseAdmin
          .from("role_assignments")
          .select("*")
          .eq("user_id", userId)
          .single();

      if (roleQueryError && roleQueryError.code !== "PGRST116") {
        // PGRST116 is "no rows returned"
        return new Response(JSON.stringify({ error: roleQueryError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (currentRoleAssignment) {
        // Update the existing role assignment
        const { error: updateRoleError } = await supabaseAdmin
          .from("role_assignments")
          .update({ role })
          .eq("id", currentRoleAssignment.id);

        if (updateRoleError) {
          return new Response(
            JSON.stringify({ error: updateRoleError.message }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      } else {
        // Create a new role assignment
        const { error: insertRoleError } = await supabaseAdmin
          .from("role_assignments")
          .insert({
            user_id: userId,
            role,
          });

        if (insertRoleError) {
          return new Response(
            JSON.stringify({ error: insertRoleError.message }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }
    }

    return new Response(
      JSON.stringify({ message: "User updated successfully" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in update-user function:", error);

    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
