import { createClient } from "@supabase/supabase-js";
import { corsHeaders } from "../_shared/cors.js";

declare const serve: (handler: (req: Request) => Promise<Response>) => void;

interface CreateUserRequest {
  email: string;
  password: string;
  fullName: string;
  username: string;
  role: string;
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
      "https://your-project.supabase.co",
      "your-anon-key",
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
      (assignment: any) => assignment.role === "SUPERADMIN"
    );
    const hasCreateUserPermission = profile.permissions?.some(
      (p: any) => p.permission === "CREATE_USER"
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
      "https://your-project.supabase.co",
      "your-service-role-key",
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
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
