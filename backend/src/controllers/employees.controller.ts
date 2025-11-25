import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { Request, Response } from "express";

import type { SessionRequest } from "@/types";

import { prisma } from "@/lib/prisma";
import { rfcValidator } from "@/utils/validator";

export const addEmployee = async (req: SessionRequest, res: Response) => {
  if (!req.session?.user) {
    return res.status(404).json({ message: "No session found" });
  }

  const body = req.body;

  if (!body) {
    return res.status(400).json({ message: "Request body is required." });
  } else if (
    !body.fullName ||
    !body.curp ||
    !body.position ||
    !body.rfc ||
    !body.salary ||
    !body.social_security_number
  ) {
    return res.status(400).json({
      message:
        "Full name, CURP, position, RFC, salary, and social security number are required.",
    });
  }

  const { curp, fullName, position, rfc, salary, social_security_number } =
    body;

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
        social_security_number,
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

export const updateEmployee = async (req: Request, res: Response) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "Employee ID is required." });
  }

  const { id } = req.params;
  const body = req.body;

  if (!body) {
    return res.status(400).json({ message: "Request body is required." });
  }

  try {
    const updatedEmployee = await prisma.employees.update({
      data: { ...body },
      where: { id: Number(id) },
    });

    return res.status(200).json({
      data: updatedEmployee,
      message: "Employee updated successfully.",
    });
  } catch (error) {
    console.error("Error updating employee:", error);

    return res.status(400).json({ message: "Error to update employee." });
  }
};
