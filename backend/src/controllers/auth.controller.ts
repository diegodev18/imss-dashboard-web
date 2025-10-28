import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { COOKIE_OPTIONS, JWT_SECRET } from "@/config";
import { LoginReq } from "@/types";

export const login = (req: Request<0, 0, LoginReq>, res: Response) => {
  if (!req.body.username || !req.body.password) {
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

export const getSession = (req: Request, res: Response) => {};

export const logout = (req: Request, res: Response) => {};
