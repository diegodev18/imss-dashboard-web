import { Response } from "express";

import type { SessionRequest } from "@/types";

import { prisma } from "@/lib/prisma";

export const createAuthToken = async (req: SessionRequest, res: Response) => {
  if (!req.session?.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const sessionCreated = await prisma.bot_sessions.create({
    data: {
      created_by: req.session.user.id,
    },
  });

  return res.status(201).json({ authToken: sessionCreated.auth_token });
};

export const getSessions = async (req: SessionRequest, res: Response) => {
  if (!req.session?.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const sessions = await prisma.bot_sessions.findMany({
    orderBy: {
      created_at: "desc",
    },
    where: {
      created_by: req.session.user.id,
    },
  });

  const sanitizedSessions = sessions.map((session) => ({
    authToken: session.auth_token,
    chatId: session.chat_id,
    chatMetadata: session.chat_metadata,
    createdAt: session.created_at,
    id: session.id,
    used: session.used,
  }));

  return res.status(200).json({ sessions: sanitizedSessions });
};
