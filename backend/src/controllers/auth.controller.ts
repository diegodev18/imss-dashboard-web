import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { compare, hash } from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import type { SessionRequest } from "@/types";

import { COOKIE_OPTIONS, JWT_SECRET, SALT_ROUNDS_NUM } from "@/config";
import { prisma } from "@/lib/prisma";
import { LoginBodySchema, RegisterBodySchema } from "@/schemas/auth.schema";
import {
  passwordValidator,
  rfcValidator,
  usernameValidator,
} from "@/utils/validator";

export const login = async (req: SessionRequest, res: Response) => {
  if (req.session?.user) {
    return res
      .status(400)
      .json({ message: "User is already logged in. Please log out first." });
  }

  const parseResult = LoginBodySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      message: parseResult.error.issues
        .map((issue) => issue.message)
        .join(", "),
    });
  }

  const body = parseResult.data;

  const companyFound = await prisma.companies.findUnique({
    where: { user_name: body.username },
  });
  if (!companyFound) {
    return res.status(404).json({ message: "Company not found" });
  }

  switch (companyFound.status) {
    case "inactive":
      return res
        .status(403)
        .json({ message: "Company is inactive. Contact support." });
    case "pending":
      return res
        .status(403)
        .json({ message: "Company registration is still pending." });
    default:
      break;
  }

  const passwordMatches = await compare(body.password, companyFound.password);
  if (!passwordMatches) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  try {
    const token = jwt.sign(
      { id: companyFound.id, username: body.username },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    console.info(`User ${body.username} logged in.`);

    return res
      .status(200)
      .cookie("access_token", token, COOKIE_OPTIONS)
      .json({ message: "Login successful" });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const register = async (req: SessionRequest, res: Response) => {
  if (req.session?.user) {
    return res
      .status(400)
      .json({ message: "User is already logged in. Please log out first." });
  }

  const parseResult = RegisterBodySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      message: parseResult.error.issues
        .map((issue) => issue.message)
        .join(", "),
    });
  }

  const body = parseResult.data;

  if (!usernameValidator(body.username)) {
    return res.status(400).json({
      message:
        "Username must be between 7 and 14 characters and can only contain letters, numbers, and underscores",
    });
  } else if (!passwordValidator(body.password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    });
  } else if (!rfcValidator(body.rfc)) {
    return res.status(400).json({ message: "RFC format is invalid" });
  }

  const passwordHashed = await hash(body.password, SALT_ROUNDS_NUM);
  let registeredId: number;
  try {
    const registered = await prisma.companies.create({
      data: {
        legal_name: body.legalName,
        name: body.name,
        password: passwordHashed,
        rfc: body.rfc,
        user_name: body.username,
      },
    });
    if (!registered.id) {
      return res.status(500).json({ message: "Failed to register company" });
    }
    registeredId = registered.id;
  } catch (err) {
    const prismaError = err as PrismaClientKnownRequestError;

    if (prismaError.code === "P2002") {
      return res.status(400).json({
        message: "Company already registered with given RFC or username",
      });
    }

    console.error("Error during company registration:", err);
    return res.status(500).json({ message: "Internal server error" });
  }

  try {
    const token = jwt.sign(
      { id: registeredId, username: body.username },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    console.info(`Company ${body.name} registered.`);

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
    .clearCookie("access_token", COOKIE_OPTIONS)
    .json({ message: "Logout successful" });
};
