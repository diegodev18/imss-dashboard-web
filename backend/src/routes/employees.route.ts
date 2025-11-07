import { Router } from "express";

import {
  addEmployee,
  getEmployees,
  updateEmployee,
} from "@/controllers/employees.controller";

const router = Router();

router.get("/employees/get", getEmployees);
router.post("/employees/add", addEmployee);
router.put("/employees/update/:id", updateEmployee);

export default router;
