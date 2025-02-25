"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User, Session } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import type { Profile } from "@/types/profile";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Fetch profile function
  const fetchProfile = async (userId: string) => {
    try {
      console.log(`Attempting to fetch profile for user ${userId}`);
      const response = await fetch(`/api/profile/${userId}`);

      console.log(`Profile fetch response status: ${response.status}`);

      // Check if the response is JSON
      const contentType = response.headers.get("content-type");
      console.log(`Response content type: ${contentType}`);

      if (!contentType || !contentType.includes("application/json")) {
        console.error("Non-JSON response received:", await response.text());
        throw new Error("Invalid response format from profile API");
      }

      // Handle 404 errors gracefully - this is expected for new users
      if (response.status === 404) {
        console.log(
          `No profile found for user ${userId}, this is expected for new users`
        );
        setProfile(null);
        return null;
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          `Profile fetch failed with status ${response.status}:`,
          errorData
        );
        throw new Error(errorData.error || "Failed to fetch profile");
      }

      const data = await response.json();
      console.log(
        `Profile fetched successfully for user ${userId}:`,
        data.profile
      );
      setProfile(data.profile);
      return data.profile;
    } catch (error) {
      console.error(`Error fetching profile for user ${userId}:`, error);
      // Don't throw for 404 errors, just return null
      if (error.message && error.message.includes("Profile not found")) {
        return null;
      }
      setProfile(null);
      throw error;
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth state...");
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          console.log("Session found, fetching profile...");
          try {
            await fetchProfile(session.user.id);
          } catch (error) {
            console.error(
              "Error fetching profile during initialization:",
              error
            );
            // Don't throw here, just log the error
          }
        } else {
          console.log("No session found");
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Auth state changed: ${event}`, session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        try {
          await fetchProfile(session.user.id);
        } catch (error) {
          console.error(
            "Error fetching profile during auth state change:",
            error
          );
        }
      } else {
        setProfile(null);
      }

      setIsLoading(false);

      if (event === "SIGNED_OUT") {
        router.push("/sign-in");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log(`Attempting to sign in user: ${email}`);
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        throw error;
      }

      console.log("Sign in successful:", data.user?.id);

      if (data.user) {
        try {
          console.log("Fetching profile after sign in...");
          const userProfile = await fetchProfile(data.user.id);

          if (!userProfile) {
            console.log(
              "No profile found, redirecting to complete profile setup"
            );
            router.push("/complete-profile");
            return;
          }

          console.log("Profile fetched successfully, redirecting to dashboard");
          router.push("/dashboard");
        } catch (error) {
          console.error("Error fetching profile after sign in:", error);

          // For other errors, we'll still try to proceed to dashboard
          console.log("Proceeding to dashboard despite profile fetch error");
          router.push("/dashboard");
        }
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Sign in process failed:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log(`Attempting to sign up user with email: ${email}`);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error("Supabase sign up error:", error);
        throw error;
      }

      console.log("Sign up response received:", data ? "success" : "no data");

      if (data?.user) {
        console.log(`User created with ID: ${data.user.id}`);
        setUser(data.user);

        if (data.session) {
          console.log("Session received during signup, setting session");
          setSession(data.session);
          try {
            await supabase.auth.setSession({
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token,
            });
            console.log("Session set successfully");
          } catch (sessionError) {
            console.error("Error setting session:", sessionError);
            // Continue despite session error
          }
        } else {
          console.log("No session received during signup");
        }

        // Note: Don't try to fetch profile here as it won't exist yet
        // The profile will be created by the SignUpForm component

        return {
          user: data.user,
          session: data.session,
        };
      } else {
        console.log("No user data returned from sign up");
        return {
          user: null,
          session: null,
        };
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log("Attempting to sign out user");
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error during sign out:", error);
        throw error;
      }

      console.log("User signed out successfully");
      setProfile(null);
      setUser(null);
      setSession(null);
      router.push("/sign-in");
    } catch (error) {
      console.error("Sign out process failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, session, profile, isLoading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
