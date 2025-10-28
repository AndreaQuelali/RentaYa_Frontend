import { z } from "zod";

export const propertySchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(100, "El título no puede exceder los 100 caracteres"),

  address: z
    .string()
    .min(1, "La dirección es requerida")
    .max(50, "La dirección no puede exceder los 50 caracteres"),

  city: z
    .string()
    .min(1, "La ciudad es requerida")
    .max(100, "La ciudad no puede exceder los 100 caracteres"),

  propertyType: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || ["casa", "departamento", "oficina", "terreno"].includes(val),
      {
        message: "Tipo de propiedad inválido",
      }
    ),

  bedrooms: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: "Debe ser un número válido mayor o igual a 0",
    }),

  bathrooms: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: "Debe ser un número válido mayor o igual a 0",
    }),

  areaM2: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
      message: "Debe ser un número válido mayor a 0",
    }),

  price: z
    .string()
    .min(1, "El precio es requerido")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "El precio debe ser un número mayor a 0",
    }),

  dealMode: z
    .string()
    .min(1, "La modalidad es requerida")
    .refine((val) => ["alquiler", "anticretico", "venta"].includes(val), {
      message: 'La modalidad debe ser "alquiler", "anticretico" o "venta"',
    }),

  description: z.string().optional(),

  images: z
    .array(z.string())
    .min(1, "Debe agregar al menos una foto")
    .max(10, "No puede agregar más de 10 fotos"),
});

export type PropertyFormData = z.infer<typeof propertySchema>;
