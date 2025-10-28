import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { COOKIE_OPTIONS, JWT_SECRET } from "@/config";

export const login = (req: Request, res: Response) => {
  const { password, username } = req.body as {
    password: string;
    username: string;
  };

  const token = jwt.sign({ password, username }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res
    .status(200)
    .cookie("access_token", token, COOKIE_OPTIONS)
    .json({ message: "Login successful" });
};

export const getSession = (req: Request, res: Response) => {};

export const logout = (req: Request, res: Response) => {};
