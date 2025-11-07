import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { Request, Response } from "express";

import type { AddEmployeeReq, SessionRequest } from "@/types";

import { prisma } from "@/lib/prisma";
import { rfcValidator } from "@/utils/validator";

export const addEmployee = async (req: SessionRequest, res: Response) => {
  if (!req.session?.user) {
    return res.status(404).json({ message: "No session found" });
  }

  const body = req.body as Partial<AddEmployeeReq> | undefined;

  if (!body) {
    return res.status(400).json({ message: "Request body is required." });
  } else if (
    !body.fullName ||
    !body.curp ||
    !body.position ||
    !body.rfc ||
    !body.salary
  ) {
    return res.status(400).json({
      message: "Full name, CURP, position, RFC, and salary are required.",
    });
  }

  const { curp, fullName, position, rfc, salary } = body;

  if (!rfcValidator(rfc)) {
    return res.status(400).json({ message: "Invalid RFC format." });
  }

  try {
    await prisma.employees.create({
      data: {
        created_by: req.session.user.id,
        curp,
        full_name: fullName,
        position,
        rfc,
        salary,
      },
    });

    res.status(200).json({ message: "Employee added successfully." });
  } catch (error) {
    const prismaError = error as PrismaClientKnownRequestError;

    if (prismaError.code === "P2002") {
      return res
        .status(400)
        .json({ message: "Employee with this CURP or RFC already exists." });
    }

    console.error("Error adding employee:", error);

    res.status(500).json({ message: "Internal server error." });
  }
};

export const getEmployees = async (req: SessionRequest, res: Response) => {
  if (!req.session?.user) {
    return res.status(404).json({ message: "No session found" });
  }

  const employees = await prisma.employees.findMany({
    where: { created_by: req.session.user.id },
  });

  res
    .status(200)
    .json({ data: employees, message: "Employees retrieved successfully." });
};

export const updateEmployee = (req: Request, res: Response) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "Employee ID is required." });
  }

  const { id } = req.params;

  res
    .status(200)
    .json({ data: { id }, message: "Employee updated successfully." });
};
