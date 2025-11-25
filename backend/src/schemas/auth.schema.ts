import { z } from "zod";

export const LoginBodySchema = z.object({
  password: z.string().min(1, "Password is required"),
  username: z.string().min(1, "Username is required"),
});
