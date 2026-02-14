import z from 'zod';

export const loginSchema = z.object({
  phone: z.string().min(1, 'Email or phone number is required'),
  password: z.string().min(1, 'Password is required'),
  callbackUrl: z.string().optional(),
})