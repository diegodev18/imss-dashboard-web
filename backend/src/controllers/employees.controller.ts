import { Request, Response } from "express";

import type { AddEmployeeReq, SessionRequest } from "@/types";

import { prisma } from "@/lib/prisma";

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
