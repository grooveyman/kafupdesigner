import { z } from "zod";

// Shared zod schemas for every auth form. Keeping them together makes the
// validation rules easy to eyeball and reuse across the split-screen screens.

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  brand_name: z.string().min(1, "Brand name is required"),
  contact_name: z.string().min(1, "Contact person name is required"),
  brand_description: z
    .string()
    .min(10, "Tell us a little more about your brand (min 10 characters)"),
  contact_email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phone_number: z
    .string()
    .min(7, "Enter a valid phone number"),
  business_location: z.string().min(1, "Business location is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const sendResetSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

export const changePasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z.object({
  code: z.string().min(1, "Verification code is required"),
});

// Flatten a ZodError into a { field: firstMessage } map. Written against
// error.issues so it works regardless of zod minor-version helper churn.
export function getFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}
