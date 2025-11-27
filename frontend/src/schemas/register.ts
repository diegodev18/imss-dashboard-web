import { z } from "zod";

export const RegisterBodySchema = z.object({
  legal_name: z.string().min(1, "El nombre legal es obligatorio"),
  name: z.string().min(1, "El nombre es obligatorio"),
  password: z.string().min(1, "La contraseña es obligatoria"),
  rfc: z
    .string()
    .regex(
      /^[a-zñA-ZÑ&]{3,4}\d{6}[a-zA-Z0-9]{3}$/i,
      "El formato del RFC es inválido"
    )
    .transform((val) => val.toUpperCase()),
  user_name: z.string().min(1, "El nombre de usuario es obligatorio"),
});

export type RegisterFormData = z.infer<typeof RegisterBodySchema>;
