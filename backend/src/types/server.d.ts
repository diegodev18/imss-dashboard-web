import { Request } from "express";

import type { SessionAuthToken } from "@/schemas/middlewares.schema";

export interface SessionRequest extends Request {
  session?: { user: null | SessionAuthToken };
}
