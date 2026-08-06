import { Router } from "express";
import { isAuthenticated, validate } from "../../middleware";
import ctrl from "../../controller/user";
import {
  updateUserDataValidation,
  updateUserPasswordValidation,
} from "../../validation/user";

const router = Router();

router.get("/user", isAuthenticated, ctrl.getUserData);

router.put(
  "/user",
  isAuthenticated,
  validate(updateUserDataValidation),
  ctrl.updateUserData,
);

router.patch(
  "/user/password",
  isAuthenticated,
  validate(updateUserPasswordValidation),
  ctrl.updateUserPassword,
);

router.delete("/user", isAuthenticated, ctrl.deleteAccount);

export default router;
