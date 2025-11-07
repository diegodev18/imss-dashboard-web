import { Request, Response } from "express";

import type { SessionRequest } from "@/types";

import { prisma } from "@/lib/prisma";

export const addEmployee = (req: Request, res: Response) => {
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
