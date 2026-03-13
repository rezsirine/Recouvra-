const express = require('express');
const { signUp, loginByEmail, loginByPhoneNumber, handleToken, forgotPassword, resetPassword } = require('../controller/user.controller');
const router = express.Router();
const validate = require('../middleware/validate.middleware');
const { signUpSchema, loginEmailSchema, loginPhoneSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validation/user.validation');

router.post('/signup',             validate(signUpSchema),          signUp);
router.post('/loginByEmail',       validate(loginEmailSchema),      loginByEmail);
router.post('/loginByPhoneNumber', validate(loginPhoneSchema),      loginByPhoneNumber);
router.post('/token',              handleToken);
router.post('/forgot-password',    validate(forgotPasswordSchema),  forgotPassword);
router.post('/reset-password',     validate(resetPasswordSchema),   resetPassword);

module.exports = router;