const express = require("express");
const router = express.Router();
const ctrl = require("../controller/user.controller");
const { protect } = require("../middleware/auth.middleware");

// ── Routes publiques (pas de token requis) ──
router.post("/signup",             ctrl.signUp);
router.post("/loginByEmail",       ctrl.loginByEmail);
router.post("/loginByPhoneNumber", ctrl.loginByPhoneNumber);
router.post("/token",              ctrl.handleToken);
router.post("/forgot-password",    ctrl.forgotPassword);
router.post("/reset-password",     ctrl.resetPassword);

// ── Routes protégées (token requis) ──
router.get("/me",     protect, ctrl.getMe);
router.get("/getAll", protect, ctrl.getAllUsers);

module.exports = router;