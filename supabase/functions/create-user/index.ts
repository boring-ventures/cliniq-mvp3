import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";
import { UserRole } from "../_shared/types.ts";

interface CreateUserRequest {
  email: string;
  password: string;
  fullName: string;
  username: string;
  role: UserRole;
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

    // Check if the user has the SUPERADMIN role or CREATE_USER permission
    const isSuperAdmin = profile.role_assignments?.some(
      (assignment) => assignment.role === "SUPERADMIN"
    );
    const hasCreateUserPermission = profile.permissions?.some(
      (p) => p.permission === "CREATE_USER"
    );

    if (!isSuperAdmin && !hasCreateUserPermission) {
      return new Response(
        JSON.stringify({ error: "Insufficient permissions" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse the request body
    const { email, password, fullName, username, role } =
      (await req.json()) as CreateUserRequest;

    if (!email || !password || !fullName || !username || !role) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create a service role client to create the user
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Create the user in Supabase Auth
    const { data: newUser, error: createUserError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm the email
        user_metadata: {
          full_name: fullName,
          username,
        },
      });

    if (createUserError || !newUser.user) {
      return new Response(
        JSON.stringify({
          error: createUserError?.message || "Failed to create user",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update the user's profile with the full name and username
    const { error: updateProfileError } = await supabaseAdmin
      .from("profiles")
      .update({
        full_name: fullName,
        username,
      })
      .eq("id", newUser.user.id);

    if (updateProfileError) {
      console.error("Error updating profile:", updateProfileError);
      // Continue anyway, as the user was created
    }

    // Assign the role to the user
    const { error: roleAssignmentError } = await supabaseAdmin
      .from("role_assignments")
      .insert({
        user_id: newUser.user.id,
        role,
      });

    if (roleAssignmentError) {
      console.error("Error assigning role:", roleAssignmentError);
      // Continue anyway, as the user was created
    }

    return new Response(
      JSON.stringify({
        message: "User created successfully",
        user: {
          id: newUser.user.id,
          email: newUser.user.email,
          fullName,
          username,
          role,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in create-user function:", error);

    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
