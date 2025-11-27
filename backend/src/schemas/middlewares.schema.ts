import { z } from "zod";

export const SessionAuthTokenSchema = z.object({
  id: z.number().min(1, "ID is required"),
  user_name: z.string().min(1, "User name is required"),
});

export type SessionAuthToken = z.infer<typeof SessionAuthTokenSchema>;
