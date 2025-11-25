import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { Request, Response } from "express";

import type { SessionRequest } from "@/types";

import { prisma } from "@/lib/prisma";
import {
  AddEmployeeBodySchema,
  UpdateEmployeeBodySchema,
} from "@/schemas/employees.schema";

export const addEmployee = async (req: SessionRequest, res: Response) => {
  if (!req.session?.user) {
    return res.status(404).json({ message: "No session found" });
  }

  const parseResult = AddEmployeeBodySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      message: parseResult.error.issues
        .map((issue) => issue.message)
        .join(", "),
    });
  }

  const body = parseResult.data;

  try {
    await prisma.employees.create({
      data: {
        created_by: req.session.user.id,
        curp: body.curp,
        full_name: body.full_name,
        position: body.position,
        rfc: body.rfc,
        salary: body.salary,
        social_security_number: body.social_security_number,
      },
    });

    res.status(200).json({ message: "Employee added successfully." });
  } catch (error) {
    const prismaError = error as PrismaClientKnownRequestError;

    switch (prismaError.code) {
      case "P2002":
        return res
          .status(400)
          .json({ message: "Employee with this CURP or RFC already exists." });
      case "P2025":
        return res.status(404).json({ message: "Related record not found." });
      default:
        break;
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
  if (isNaN(Number(id))) {
    return res.status(400).json({ message: "Employee ID must be a number." });
  }

  const parseResult = UpdateEmployeeBodySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      message: parseResult.error.issues
        .map((issue) => issue.message)
        .join(", "),
    });
  }

  const body = parseResult.data;

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
