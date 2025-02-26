"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

// Replace this import
// import { Permission, UserRole } from "@prisma/client";

// With these local enum definitions
enum Permission {
  CREATE_USER = "CREATE_USER",
}

enum UserRole {
  USER = "USER",
  DOCTOR = "DOCTOR",
  RECEPTIONIST = "RECEPTIONIST",
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN",
}

// Form validation schema
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
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

export default function NewUserPage() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      username: "",
      role: UserRole.USER,
    },
  });

  // Handle form submission
  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true);

      // Create user in Supabase Auth
      const { error: authError } = await supabase.functions.invoke(
        "create-user",
        {
          body: {
            email: values.email,
            password: values.password,
            role: values.role,
            fullName: values.fullName,
            username: values.username,
          },
        }
      );

      if (authError) {
        throw new Error(authError.message);
      }

      toast({
        title: "User created successfully",
        description: `${values.fullName} has been added as a ${values.role.toLowerCase()}.`,
      });

      // Redirect to users list
      router.push("/users");
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error creating user",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PermissionGuard permissions={Permission.CREATE_USER} redirectTo="/users">
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
          <h1 className="mb-6 text-3xl font-bold">Add New User</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      The user will receive a confirmation email at this
                      address.
                    </FormDescription>
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
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Must be at least 8 characters with uppercase, lowercase,
                      and numbers.
                    </FormDescription>
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
                      <Input placeholder="John Doe" {...field} />
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
                      <Input placeholder="johndoe" {...field} />
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
                        <SelectItem value={UserRole.DOCTOR}>Doctor</SelectItem>
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

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating User...
                  </>
                ) : (
                  "Create User"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </PermissionGuard>
  );
}
