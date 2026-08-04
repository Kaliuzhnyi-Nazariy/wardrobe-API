import { Router } from "express";

const router = Router();

router.get("/wishlist/:wishlistId");

router.get("/wishlist");

router.post("/wishlist");

router.put("/wishlist/:wishlistId");

router.delete("/wishlist/:wishlistId");

export default router;
