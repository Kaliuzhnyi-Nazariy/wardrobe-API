import { z } from "zod";

export const signinValidation = z.object({
  email: z.email({ error: "Enter valid email value" }),
  password: z
    .string()
    .regex(
      /^(?=(?:.*[A-Z]){2})(?=(?:.*[a-z]){2})(?=(?:.*\d){2})(?=(?:.*[!@#$%^&*()_+\-=\[\]{};':",.<>?\\\/|`~]){2}).{8,}$/,
    ),
});

export const signupValidation = z
  .object({
    name: z.string(),
    email: z.email({ error: "Enter valid email value" }),
    password: z
      .string()
      .regex(
        /^(?=(?:.*[A-Z]){2})(?=(?:.*[a-z]){2})(?=(?:.*\d){2})(?=(?:.*[!@#$%^&*()_+\-=\[\]{};':",.<>?\\\/|`~]){2}).{8,}$/,
      ),
    confirmPassword: z
      .string()
      .regex(
        /^(?=(?:.*[A-Z]){2})(?=(?:.*[a-z]){2})(?=(?:.*\d){2})(?=(?:.*[!@#$%^&*()_+\-=\[\]{};':",.<>?\\\/|`~]){2}).{8,}$/,
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
