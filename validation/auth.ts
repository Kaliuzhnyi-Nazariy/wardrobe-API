import { z } from "zod";

export const signinValidation = z.object({
  email: z.email({ error: "Enter valid email value" }),
  password: z
    .string()
    .regex(
      /^(?=(?:.*[A-Z]){2})(?=(?:.*[a-z]){2})(?=(?:.*\d){2})(?=(?:.*[!@#$%^&*()_+\-=\[\]{};':",.<>?\\\/|`~]){2}).{8,}$/,
      {
        error:
          "Password must be at least 8 characters long and include at least: 2 uppercase letters, 2 lowercase letters, 2 digits, and 2 special characters.",
      },
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
        {
          error:
            "Password must be at least 8 characters long and include at least: 2 uppercase letters, 2 lowercase letters, 2 digits, and 2 special characters.",
        },
      ),
    confirmPassword: z
      .string()
      .regex(
        /^(?=(?:.*[A-Z]){2})(?=(?:.*[a-z]){2})(?=(?:.*\d){2})(?=(?:.*[!@#$%^&*()_+\-=\[\]{};':",.<>?\\\/|`~]){2}).{8,}$/,
        {
          error:
            "Password must be at least 8 characters long and include at least: 2 uppercase letters, 2 lowercase letters, 2 digits, and 2 special characters.",
        },
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
