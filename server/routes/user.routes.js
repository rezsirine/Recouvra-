const express = require("express");
const router = express.Router();
const ctrl = require("../controller/user.controller");
const { protect } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { signUpSchema, loginEmailSchema, loginPhoneSchema, forgotPasswordSchema, resetPasswordSchema } = require("../validation/user.validation");

router.post("/signup",             validate(signUpSchema),          ctrl.signUp);
router.post("/loginByEmail",       validate(loginEmailSchema),      ctrl.loginByEmail);
router.post("/loginByPhoneNumber", validate(loginPhoneSchema),      ctrl.loginByPhoneNumber);
router.post("/token",              ctrl.handleToken);
router.post("/forgot-password",    validate(forgotPasswordSchema),  ctrl.forgotPassword);
router.post("/reset-password",     validate(resetPasswordSchema),   ctrl.resetPassword);

router.get("/me",     protect, ctrl.getMe);
router.get("/getAll", protect, ctrl.getAllUsers);

module.exports = router;