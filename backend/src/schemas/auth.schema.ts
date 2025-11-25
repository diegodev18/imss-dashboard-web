import { z } from "zod";

export const LoginBodySchema = z.object({
  password: z.string().min(1, "Password is required"),
  user_name: z.string().min(1, "Username is required"),
});

export const RegisterBodySchema = z.object({
  legal_name: z.string().min(1, "Legal name is required"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(1, "Password is required"),
  rfc: z
    .string()
    .regex(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/, "RFC format is invalid"),
  user_name: z.string().min(1, "Username is required"),
});
