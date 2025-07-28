import { Request } from "express";
import z from "zod";

// User registraiton schema
export const RegistrationSchema = z.object({
  username: z.string().trim().min(1, "Username is required."),
  email: z.email().trim().min(1, "Email is required."),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

export type RegistrationData = z.infer<typeof RegistrationSchema>;

// User login schema
export const LoginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type LoginData = z.infer<typeof LoginSchema>;
