import { Request } from "express";

export interface AddEmployeeReq {
  curp?: string;
  fullName?: string;
  position?: string;
  rfc?: string;
  salary?: number;
  social_security_number?: string;
}

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
