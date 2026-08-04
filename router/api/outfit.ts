import { Router } from "express";

const router = Router();

router.get("/outfit/:outfitId");

router.get("/outfit");

router.post("/outfit");

router.put("/outfit/:outfitId");

router.delete("/outfit/:outfitId");

export default router;
