import z from "zod";
import { Gender } from "../../../../../prisma/generated/enums";

export const userValidationSchema = z.object({
  firstName: z
    .string("First name must be a string")
    .min(1, "First name is required")
    .min(3, "First name must be at least 3 characters long")
    .max(50, "First name must be at most 50 characters long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(3, "Last name must be at least 3 characters long")
    .max(50, "Last name must be at most 50 characters long")
    .optional(),
  email: z
    .string("Email must be a string")
    .min(1, "Email is required")
    .min(3, "Email must be at least 3 characters long")
    .max(50, "Email must be at most 50 characters long")
    .email("Invalid email"),
  phone: z
    .string("Phone number must be a string")
    .min(1, "Phone number is required")
    .min(8, "Phone number must be at least 8 characters long"),
  password: z
    .string("Password must be a string")
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long")
    .regex(
      /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
  gender: z.enum(Object.values(Gender), "Invalid gender"),
  dateOfBirth: z.coerce.date("Invalid date of birth"),
});
