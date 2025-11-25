import { z } from "zod";

export const SessionAuthTokenSchema = z.object({
  id: z.number().min(1, "ID is required"),
  username: z.string().min(1, "Username is required"),
});
