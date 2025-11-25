import { z } from "zod";

export const AddEmployeeBodySchema = z.object({
  curp: z.string().min(1, "CURP is required"),
  full_name: z.string().min(1, "Full name is required"),
  position: z.string().min(1, "Position is required"),
  rfc: z
    .string()
    .regex(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/, "RFC format is invalid"),
  salary: z.number().min(0, "Salary must be a positive number"),
  social_security_number: z
    .string()
    .min(1, "Social security number is required"),
});
