"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Permission, UserRole } from "@/types/permissions";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Form validation schema
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  role: z.nativeEnum(UserRole),
});

type FormValues = z.infer<typeof formSchema>;

interface User {
  id: string;
  email: string;
  full_name: string;
  username: string;
  role_assignments: { role: string }[];
}

export default function UserPage({
  params,
}: {
  params: Promise<{ id: string }> | undefined;
}) {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
      username: "",
      role: UserRole.USER,
    },
  });

  // Handle params resolution
  useEffect(() => {
    async function resolveParams() {
      try {
        if (!params) {
          router.push("/users");
          return;
        }

        const resolvedParams = await params;
        setUserId(resolvedParams.id);
      } catch (error) {
        console.error("Error resolving params:", error);
        router.push("/users");
      }
    }

    resolveParams();
  }, [params, router]);

  // Fetch user data when userId is available
  useEffect(() => {
    if (!userId) return;

    async function fetchUser() {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke("get-user", {
          body: { userId },
        });

        if (error) {
          throw new Error(error.message);
        }

        if (!data) {
          throw new Error("User not found");
        }

        setUser(data);

        // Set form default values
        form.reset({
          email: data.email,
          fullName: data.full_name,
          username: data.username,
          role: (data.role_assignments?.[0]?.role as UserRole) || UserRole.USER,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        toast({
          title: "Error fetching user",
          description:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
          variant: "destructive",
        });
        router.push("/users");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId, supabase, router, form]);

  // Handle form submission
  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true);

      // Update user in Supabase
      const { error } = await supabase.functions.invoke("update-user", {
        body: {
          userId: userId,
          email: values.email,
          fullName: values.fullName,
          username: values.username,
          role: values.role,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "User updated successfully",
        description: `${values.fullName}'s information has been updated.`,
      });

      // Redirect to users list
      router.push("/users");
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error updating user",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PermissionGuard permissions={Permission.UPDATE_USER} redirectTo="/users">
      <div className="container mx-auto py-6">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push("/users")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>

        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 text-3xl font-bold">
            {loading ? (
              <Skeleton className="h-9 w-[200px]" />
            ) : (
              `Edit User: ${user?.full_name}`
            )}
          </h1>

          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-[100px]" />
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Used for login and must be unique.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          <SelectItem value={UserRole.USER}>User</SelectItem>
                          <SelectItem value={UserRole.DOCTOR}>
                            Doctor
                          </SelectItem>
                          <SelectItem value={UserRole.RECEPTIONIST}>
                            Receptionist
                          </SelectItem>
                          <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                          <PermissionGuard
                            permissions={Permission.CREATE_USER}
                            fallback={null}
                          >
                            <SelectItem value={UserRole.SUPERADMIN}>
                              Super Admin
                            </SelectItem>
                          </PermissionGuard>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The role determines what permissions the user will have.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/users")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
    </PermissionGuard>
  );
}
