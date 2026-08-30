import { Router } from "express";
import { validate } from "../../middleware";
import { signinValidation, signupValidation } from "../../validation/auth";
import ctrl from "../../controller/auth";

const router = Router();

router.post("/auth/signin", validate(signinValidation), ctrl.signin);
router.post("/auth/signup", ctrl.signup);
// router.post("/auth/signup", validate(signupValidation), ctrl.signup);
router.post("/auth/logout", ctrl.logout);
// router.post("/password/forget");
// router.post("/password/reset");

export default router;
