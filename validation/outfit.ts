import z from "zod";

export const outfitValidation = z.object({
  name: z.string(),
  clothes: z.preprocess(
    (val) =>
      Array.isArray(val) ? val : typeof val === "string" && val ? [val] : [],
    z.array(z.string()),
  ),

  season: z.preprocess(
    (val) =>
      Array.isArray(val) ? val : typeof val === "string" && val ? [val] : [],
    z.array(z.string()),
  ),

  isOwned: z.preprocess(
    (val) => val === "true" || val === true,
    z.boolean().default(true),
  ),
});

export const updateOutfitValidation = z.object({
  name: z.string(),
  clothes: z.preprocess(
    (val) =>
      Array.isArray(val) ? val : typeof val === "string" && val ? [val] : [],
    z.array(z.string()),
  ),

  season: z.preprocess(
    (val) =>
      Array.isArray(val) ? val : typeof val === "string" && val ? [val] : [],
    z.array(z.string()),
  ),

  isOwned: z.preprocess(
    (val) => val === "true" || val === true,
    z.boolean().default(true),
  ),
});
