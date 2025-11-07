import { Router } from "express";

import {
  addEmployee,
  getEmployees,
  updateEmployee,
} from "@/controllers/employees.controller";

const router = Router();

router.get("/get", getEmployees);
router.post("/add", addEmployee);
router.put("/update/:id", updateEmployee);

export default router;
