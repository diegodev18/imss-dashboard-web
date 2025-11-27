import { z } from "zod";

export const LoginBodySchema = z.object({
  password: z.string().min(1, "Password is required"),
  user_name: z
    .string()
    .min(1, "Username is required")
    .transform((val) => val.trim().toLowerCase()),
});

export const RegisterBodySchema = z.object({
  legal_name: z
    .string()
    .min(1, "Legal name is required")
    .transform((val) => val.trim().toLowerCase()),
  name: z
    .string()
    .min(1, "Name is required")
    .transform((val) => val.trim().toLowerCase()),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(64, { message: "Password cannot exceed 64 characters." })
    .refine((val) => /[a-z]/.test(val), {
      message: "Must contain at least one lowercase letter.",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Must contain at least one uppercase letter.",
    })
    .refine((val) => /\d/.test(val), {
      message: "Must contain at least one number.",
    })
    .refine((val) => /[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]/.test(val), {
      message: "Must contain at least one special character.",
    }),
  rfc: z
    .string()
    .regex(/^[a-zñA-ZÑ&]{3,4}\d{6}[a-zA-Z0-9]{3}$/i, "RFC format is invalid")
    .transform((val) => val.toLowerCase()),
  user_name: z
    .string()
    .min(1, "Username is required")
    .transform((val) => val.trim().toLowerCase()),
});
