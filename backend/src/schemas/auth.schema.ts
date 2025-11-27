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
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      "Password must contain at least one letter and one number"
    ),
  rfc: z
    .string()
    .regex(/^[a-zñA-ZÑ&]{3,4}\d{6}[a-zA-Z0-9]{3}$/i, "RFC format is invalid")
    .transform((val) => val.toLowerCase()),
  user_name: z
    .string()
    .min(1, "Username is required")
    .transform((val) => val.trim().toLowerCase()),
});
