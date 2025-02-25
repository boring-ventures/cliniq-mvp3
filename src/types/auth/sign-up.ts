import { z } from "zod";

// Define the form schema based on the User model
export const signUpFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "DOCTOR", "RECEPTIONIST", "USER"]).default("USER"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SignUpFormData = z.infer<typeof signUpFormSchema>;

export interface SignUpFormProps extends React.HTMLAttributes<HTMLDivElement> {}
