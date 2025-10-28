import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { COOKIE_OPTIONS, JWT_SECRET } from "@/config";
import { LoginReq, SessionRequest } from "@/types";

export const login = (req: Request<0, 0, LoginReq>, res: Response) => {
  if (req.cookies.access_token) {
    return res
      .status(400)
      .json({ message: "User is already logged in. Please log out first." });
  }

  if (!(req.body as unknown)) {
    return res.status(400).json({ message: "Body is required" });
  } else if (!req.body.username || !req.body.password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const { password, username } = req.body;

  const token = jwt.sign({ password, username }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res
    .status(200)
    .cookie("access_token", token, COOKIE_OPTIONS)
    .json({ message: "Login successful" });
};

export const getSession = (req: SessionRequest, res: Response) => {
  if (!req.cookies.access_token) {
    return res.status(404).json({ message: "No access_token found at cookie" });
  } else if (!req.session) {
    return res.status(404).json({ message: "No session found" });
  }

  const user = req.session.user;

  if (!user) {
    return res.status(404).json({ message: "No active session found" });
  }

  const sanitized = {
    username: user.username,
  };

  return res.status(200).json({ user: sanitized });
};

export const logout = (req: Request, res: Response) => {
  const accessToken = req.cookies.access_token as string | undefined;

  if (!accessToken) {
    return res.status(404).json({ message: "No access_token found at cookie" });
  }

  return res
    .status(200)
    .clearCookie("access_token")
    .json({ message: "Logout successful" });
};
