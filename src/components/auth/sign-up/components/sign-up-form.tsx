"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FacebookIcon, GithubIcon, UploadCloud } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/utils/password-input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { SignUpFormData } from "@/types/auth/sign-up";
import { signUpFormSchema } from "@/types/auth/sign-up";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";
import { uploadAvatar } from "@/lib/supabase/upload-avatar";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as z from "zod";

// Add this interface definition
interface SignUpFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      role: "USER",
      password: "",
      confirmPassword: "",
    },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: SignUpFormData) {
    try {
      setIsLoading(true);

      // First create the auth user
      console.log("Attempting to sign up with email:", data.email);
      const signUpResult = await signUp(data.email, data.password);
      console.log("Sign up result:", signUpResult);

      if (!signUpResult?.user) {
        console.error("No user returned from signUp function");

        // Try to get the current session directly
        const { data: sessionData } = await supabase.auth.getSession();
        console.log("Current session after signup:", sessionData);

        if (!sessionData.session?.user) {
          throw new Error("Failed to create user account. Please try again.");
        }

        // Use the user from the session
        const userId = sessionData.session.user.id;
        console.log("Using user ID from session:", userId);

        // Continue with user creation using this user ID
        await createUserAndRedirect(userId, data);
      } else {
        // Use the user from the signUp result
        const userId = signUpResult.user.id;
        console.log("User created with ID:", userId);

        // Continue with user creation
        await createUserAndRedirect(userId, data);
      }
    } catch (error) {
      console.error("Sign up error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      // If user creation failed but auth user was created, attempt to clean up
      try {
        await supabase.auth.signOut();
      } catch (cleanupError) {
        console.error("Failed to clean up after failed signup:", cleanupError);
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Helper function to create user and redirect
  async function createUserAndRedirect(
    userId: string,
    formData: SignUpFormData
  ) {
    // Upload avatar if selected
    let avatarUrl = null;
    if (avatarFile) {
      try {
        console.log("Attempting to upload avatar...");
        avatarUrl = await uploadAvatar(avatarFile, userId);
        console.log("Avatar uploaded successfully:", avatarUrl);
      } catch (error) {
        console.error("Avatar upload failed:", error);
        // Continue with user creation even if avatar upload fails
        toast({
          title: "Warning",
          description:
            "Profile created but avatar upload failed. You can add an avatar later.",
          variant: "destructive",
        });
      }
    }

    // Create user profile
    try {
      console.log("Creating user profile with data:", {
        userId,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        avatarUrl,
      });

      console.log("Sending POST request to /api/auth/create-profile");

      const response = await fetch("/api/auth/create-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          avatarUrl,
          role: formData.role || "USER",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create user profile");
      }

      console.log("User profile created successfully");

      // Show success message
      toast({
        title: "Success",
        description: "Your account has been created successfully!",
        variant: "default",
      });

      // Navigate to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("User creation error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to create user: ${errorMessage}`);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="role">Role & Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="flex flex-col items-center gap-4">
                <div className="relative h-24 w-24">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Avatar preview"
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                      <UploadCloud className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="w-full max-w-xs"
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="role" className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="DOCTOR">Doctor</SelectItem>
                        <SelectItem value="RECEPTIONIST">
                          Receptionist
                        </SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-sm text-muted-foreground">
                <p>
                  Note: Role selection may be restricted based on administrator
                  approval.
                </p>
                <p className="mt-2">
                  Default accounts are created with the User role.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="w-full"
          type="button"
          disabled={isLoading}
        >
          <GithubIcon className="h-4 w-4 mr-2" /> GitHub
        </Button>
        <Button
          variant="outline"
          className="w-full"
          type="button"
          disabled={isLoading}
        >
          <FacebookIcon className="h-4 w-4 mr-2" /> Facebook
        </Button>
      </div>
    </div>
  );
}
