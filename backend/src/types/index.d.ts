import { Request } from "express";

export interface LoginReq {
  password?: string;
  username?: string;
}

export interface SessionRequest extends Request {
  session?: { user: null | { name: string } };
}
