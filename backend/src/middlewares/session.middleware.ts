import type { NextFunction, Response } from "express";

import jwt from "jsonwebtoken";

import { JWT_SECRET } from "@/config";
import { prisma } from "@/lib/prisma";
import { SessionAuthTokenSchema } from "@/schemas/middlewares.schema";
import { SessionRequest } from "@/types";

export const getSessionMiddleware = async (
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

    req.session.user = await prisma.companies.findUnique({
      where: { id: parseResult.data.id },
    });
  } catch (err) {
    console.error("Error validating session in middleware:", err);

    next();
    return;
  }

  next();
};
