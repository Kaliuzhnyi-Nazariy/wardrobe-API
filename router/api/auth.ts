import { Router } from "express";

const router = Router();

router.post("/signin");
router.post("/signup");
router.post("/logout");
router.post("/password/forget");
router.post("/password/reset");

export default router;
