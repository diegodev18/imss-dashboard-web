import { Request } from "express";

export interface SessionRequest extends Request {
  session?: { user: null | { id: number; name: string } };
}
