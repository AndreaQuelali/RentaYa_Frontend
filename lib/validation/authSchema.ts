import {z} from 'zod';

export const registerSchema = z.object({
    fullName: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
    phone: z
    .string()
    .min(1, 'El teléfono es requerido')
    .regex(/^\d{8}$/, 'El teléfono debe tener 8 dígitos'),
    email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Formato de correo inválido'),
    password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial'
    ),
});

export const loginSchema = z.object({
    email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Formato de correo inválido'),
    password: z
    .string()
    .min(1, 'La contraseña es requerida')
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
