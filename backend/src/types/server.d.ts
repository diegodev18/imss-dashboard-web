import type { companies } from "@prisma/client";
import type { Request } from "express";

export interface SessionRequest extends Request {
  session?: { user: companies | null };
}
