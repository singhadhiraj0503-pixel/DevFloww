import * as z from "zod";

const nameRegex = /^[A-Za-z\s]+$/;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is Required" })
    .email({ message: "Please provide a valid email address" }),
  description: z.string().optional(),

  password: z
    .string()
    .min(5, { message: "password must be of atleast 5 characters" })
    .max(100, { message: "password cannot exceed 100 characters" }),
});

export const SignUpSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters" })
      .max(50, { message: "Name cannot exceed 50 characters" })
      .regex(nameRegex, {
        message: "Name can only contain letters and spaces",
      }),

    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Please provide a valid email address" }),

    password: z.string().regex(passwordRegex, {
      message:
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
    }),

    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
