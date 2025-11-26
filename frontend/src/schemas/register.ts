import { z } from "zod";

export const RegisterBodySchema = z.object({
  legal_name: z.string().min(1, "El nombre legal es requerido"),
  name: z.string().min(1, "El nombre es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
  rfc: z
    .string()
    .regex(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/, "El formato del RFC es inválido"),
  user_name: z.string().min(1, "El nombre de usuario es requerido"),
});

export type RegisterFormData = z.infer<typeof RegisterBodySchema>;
