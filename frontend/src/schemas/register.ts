import { z } from "zod";

export const RegisterBodySchema = z.object({
  legal_name: z
    .string()
    .min(1, "Nombre legal es obligatorio")
    .transform((val) => val.trim().toLowerCase()),
  name: z
    .string()
    .min(1, "Nombre es obligatorio")
    .transform((val) => val.trim().toLowerCase()),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
    .max(64, { message: "La contraseña no puede exceder 64 caracteres." })
    .refine((val) => /[a-z]/.test(val), {
      message: "Debe contener al menos una letra minúscula.",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Debe contener al menos una letra mayúscula.",
    })
    .refine((val) => /\d/.test(val), {
      message: "Debe contener al menos un número.",
    })
    .refine((val) => /[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]/.test(val), {
      message: "Debe contener al menos un carácter especial.",
    }),
  rfc: z
    .string()
    .regex(
      /^[a-zñA-ZÑ&]{3,4}\d{6}[a-zA-Z0-9]{3}$/i,
      "El formato del RFC es inválido"
    )
    .transform((val) => val.toLowerCase()),
  user_name: z
    .string()
    .min(1, "Nombre de usuario es obligatorio")
    .transform((val) => val.trim().toLowerCase()),
});

export type RegisterFormData = z.infer<typeof RegisterBodySchema>;
