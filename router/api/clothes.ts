import { Router } from "express";
import { isAuthenticated, upload, validate } from "../../middleware";
import ctrl from "../../controller/clothes";
import { clothesItemValidation } from "../../validation/clothes";

const router = Router();

router.get("/clothes", isAuthenticated, ctrl.getAllClothes);

router.get("/clothes/:clothesId", isAuthenticated, ctrl.getClothesById);

router.post(
  "/clothes",
  isAuthenticated,
  upload.single("image"),
  validate(clothesItemValidation),
  ctrl.addClothesItem,
);

router.put(
  "/clothes/:clothesId",
  isAuthenticated,
  upload.single("newImage"),
  validate(clothesItemValidation),
  ctrl.updateClothesItem,
);

router.delete("/clothes/all", isAuthenticated, ctrl.cleanClothesStore);

router.delete("/clothes/:clothesId", isAuthenticated, ctrl.deleteClothesItem);

export default router;
