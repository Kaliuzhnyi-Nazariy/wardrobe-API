import { Router } from "express";
import { isAuthenticated, upload, validate } from "../../middleware";
import ctrl from "../../controller/outfit";
import {
  outfitValidation,
  updateOutfitValidation,
} from "../../validation/outfit";

const router = Router();

router.get("/outfit", isAuthenticated, ctrl.getAllOutfits);

router.get("/outfit/:outfitId", isAuthenticated, ctrl.getOutfitById);

router.post(
  "/outfit",
  isAuthenticated,
  upload.single("image"),
  validate(outfitValidation),
  ctrl.addOutfitItem,
);

router.put(
  "/outfit/:outfitId",
  isAuthenticated,
  upload.single("newImage"),
  validate(updateOutfitValidation),
  ctrl.updateOutfitItem,
);

router.delete("/outfit/all", isAuthenticated, ctrl.cleanOutfitStore);

router.delete("/outfit/:outfitId", isAuthenticated, ctrl.deleteOutfitItem);

export default router;
