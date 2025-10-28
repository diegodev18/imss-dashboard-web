import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "@/config";
import { SessionRequest } from "@/types";
import { LoginReq } from "@/types";

export const getSessionMiddleware = (
  req: SessionRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.access_token as string | undefined;

  req.session = { user: null };

  if (!accessToken) {
    next();
    return;
  }

  try {
    const verified = jwt.verify(accessToken, JWT_SECRET);

    const data: LoginReq =
      typeof verified === "string"
        ? (JSON.parse(verified) as LoginReq)
        : (verified as unknown as LoginReq);

    if (!data.username) {
      next();
      return;
    }

    req.session.user = { name: data.username };
  } catch (err) {
    console.error("Error validating session in middleware:", err);

    next();
    return;
  }

  next();
};
