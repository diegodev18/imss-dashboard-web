import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { compare, hash } from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import type { SessionRequest } from "@/types";

import { COOKIE_OPTIONS, JWT_SECRET, SALT_ROUNDS_NUM } from "@/config";
import { prisma } from "@/lib/prisma";
import { LoginBodySchema, RegisterBodySchema } from "@/schemas/auth.schema";

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
    where: { user_name: body.user_name },
  });
  if (!companyFound) {
    return res.status(404).json({ message: "Company not found" });
  }

  const passwordMatches = await compare(body.password, companyFound.password);
  if (!passwordMatches) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  try {
    const token = jwt.sign(
      { id: companyFound.id, user_name: body.user_name },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    console.info(`User ${body.user_name} logged in.`);

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

  const passwordHashed = await hash(body.password, SALT_ROUNDS_NUM);
  let registeredId: number;
  try {
    const registered = await prisma.companies.create({
      data: {
        legal_name: body.legal_name,
        name: body.name,
        password: passwordHashed,
        rfc: body.rfc,
        user_name: body.user_name,
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
      { id: registeredId, user_name: body.user_name },
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
  } else if (!req.session.user) {
    return res.status(404).json({ message: "No user found in session" });
  }

  const user = req.session.user;

  const sanitized = {
    name: user.name,
    status: user.status,
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
