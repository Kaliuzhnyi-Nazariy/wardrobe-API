import z from "zod";

export const outfitValidation = z.object({
  name: z.string().min(1, "Name is required"),
  clothes: z.preprocess(
    (val) =>
      Array.isArray(val) ? val : typeof val === "string" && val ? [val] : [],
    z.array(z.string()).min(1, "Clothes item is not added"),
  ),

  season: z.preprocess(
    (val) =>
      Array.isArray(val) ? val : typeof val === "string" && val ? [val] : [],
    z.array(z.string()).min(1, "At least 1 season should be added"),
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
