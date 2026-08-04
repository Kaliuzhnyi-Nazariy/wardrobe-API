import { Router } from "express";

const router = Router();

router.get("/clothes/:clothesId");

router.get("/clothes");

router.post("/clothes");

router.put("/clothes/:clothesId");

router.delete("/clothes/:clothesId");

export default router;
