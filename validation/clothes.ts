import z from "zod";

export const clothesItemValidation = z.object({
  name: z.string().min(1),
  color: z.preprocess(
    (val) => (Array.isArray(val) ? val : val ? [val] : []),
    z.array(z.string()),
  ),
  season: z.preprocess(
    (val) => (Array.isArray(val) ? val : val ? [val] : []),
    z.array(
      z.enum(["winter", "spring", "summer", "fall"], {
        message: "only 4 seasons available: summer, fall, winter, spring",
      }),
    ),
  ),
  brand: z.string().optional(),
  size: z.enum(["s", "m", "l", "xl", "2xl", "3xl"], {
    message: "Available sizes are: s, m, l, xl, 2xl, 3xl",
  }),
  isOwned: z.preprocess(
    (val) => val === "true" || val === true,
    z.boolean().default(true),
  ),
});
