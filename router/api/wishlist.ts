import { Router } from "express";
import { isAuthenticated, validate } from "../../middleware";
import ctrl from "../../controller/wishlist";
import { clothesItemValidation } from "../../validation/clothes";

const router = Router();

router.get("/wishlist", isAuthenticated, ctrl.getWishlist);

router.get("/wishlist/:itemId", isAuthenticated, ctrl.getWishlistItemById);

router.post(
  "/wishlist",
  isAuthenticated,
  validate(clothesItemValidation),
  ctrl.addToWishlist,
);

router.put(
  "/wishlist/:itemId",
  isAuthenticated,
  validate(clothesItemValidation),
  ctrl.updateWishlistItem,
);

router.patch("/wishlist/:itemId", isAuthenticated, ctrl.updateOwnership);

router.delete("/wishlist/:itemId", isAuthenticated, ctrl.removeFromWishlist);

export default router;
