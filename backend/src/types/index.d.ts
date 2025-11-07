import { Request } from "express";

export interface LoginReq {
  id?: number;
  password?: string;
  username?: string;
}

export interface RegisterReq {
  legalName?: string;
  name?: string;
  password?: string;
  rfc?: string;
  username?: string;
}

export interface SessionRequest extends Request {
  session?: { user: null | { id: number; name: string } };
}
