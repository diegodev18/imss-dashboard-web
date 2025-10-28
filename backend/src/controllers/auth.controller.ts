import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { COOKIE_OPTIONS, JWT_SECRET } from "@/config";
import { LoginReq } from "@/types";

export const login = (req: Request<0, 0, LoginReq>, res: Response) => {
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

export const getSession = (req: Request, res: Response) => {
  const accessToken = req.cookies.access_token as string | undefined;

  if (!accessToken) {
    return res.status(404).json({ message: "No access_token found at cookie" });
  }

  try {
    const verified = jwt.verify(accessToken, JWT_SECRET);

    const data: LoginReq =
      typeof verified === "string"
        ? (JSON.parse(verified) as LoginReq)
        : (verified as unknown as LoginReq);

    const sanitizedToken = {
      password: data.password,
      username: data.username,
    };

    return res.status(200).json({ session: sanitizedToken });
  } catch (err) {
    console.error("Error getting session by 2 user:", err);

    return res.status(400).json({
      message: "Didnt validate the access_token",
    });
  }
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
