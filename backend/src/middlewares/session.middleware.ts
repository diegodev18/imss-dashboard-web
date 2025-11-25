import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "@/config";
import { SessionAuthTokenSchema } from "@/schemas/middlewares.schema";
import { SessionRequest } from "@/types";

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

    const tokenData = (
      typeof verified === "string" ? JSON.parse(verified) : verified
    ) as object;

    const parseResult = SessionAuthTokenSchema.safeParse(tokenData);
    if (!parseResult.success) {
      next();
      return;
    }

    const { data } = parseResult;

    req.session.user = {
      id: data.id,
      legal_name: data.legal_name,
      name: data.name,
      user_name: data.user_name,
    };
  } catch (err) {
    console.error("Error validating session in middleware:", err);

    next();
    return;
  }

  next();
};
