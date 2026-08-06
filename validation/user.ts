import z from "zod";

export const updateUserDataValidation = z.object({
  name: z.string(),
  email: z.email({ error: "Enter valid email value" }),
});

export const updateUserPasswordValidation = z
  .object({
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
