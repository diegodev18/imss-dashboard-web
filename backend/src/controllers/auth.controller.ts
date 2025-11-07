import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { COOKIE_OPTIONS, JWT_SECRET } from "@/config";
import { prisma } from "@/lib/prisma";
import { LoginReq, RegisterReq, SessionRequest } from "@/types";
import { usernameValidator } from "@/utils/validator";

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

  try {
    const { password, username } = req.body;

    const token = jwt.sign({ password, username }, JWT_SECRET, {
      expiresIn: "7d",
    });

    console.info(`User ${username} logged in.`);

    return res
      .status(200)
      .cookie("access_token", token, COOKIE_OPTIONS)
      .json({ message: "Login successful" });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const register = async (
  req: Request<0, 0, RegisterReq>,
  res: Response
) => {
  if (req.cookies.access_token) {
    return res
      .status(400)
      .json({ message: "User is already logged in. Please log out first." });
  } else if (
    !req.body.legalName ||
    !req.body.name ||
    !req.body.rfc ||
    !req.body.username
  ) {
    return res.status(400).json({
      message: "'legalName', 'name', 'rfc' and 'username' are required",
    });
  }

  const { legalName, name, rfc, username } = req.body;

  const validatedUsername = usernameValidator(username);
  if (!validatedUsername.valid) {
    return res.status(400).json({
      message: validatedUsername.message,
    });
  }

  try {
    const registered = await prisma.companies.create({
      data: {
        legal_name: legalName,
        name,
        rfc,
        user_name: username,
      },
    });
    if (!registered.id) {
      return res.status(500).json({ message: "Failed to register company" });
    }
  } catch (err) {
    const prismaError = err as PrismaClientKnownRequestError;

    if (prismaError.code === "P2002") {
      return res.status(400).json({
        message: "Company already registered with given RFC or username",
      });
    }
    return res
      .status(500)
      .json({ code: prismaError.code, message: "Internal server error" });
  }

  try {
    const token = jwt.sign({ username }, JWT_SECRET, {
      expiresIn: "7d",
    });

    console.info(`Company ${name} registered.`);

    return res.status(201).cookie("access_token", token, COOKIE_OPTIONS).json({
      message: "Company registered successfully. Wait for verification.",
    });
  } catch (err) {
    console.error("Error during post-registration login:", err);
    return res.status(400).json({
      message: "Registration successful, but login failed",
    });
  }
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
    name: user.name,
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
