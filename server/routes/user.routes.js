const express = require("express");
const router = express.Router();
const ctrl = require("../controller/user.controller");

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Créer un compte utilisateur
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Données invalides ou utilisateur existant
 */
router.post("/signup", ctrl.signUp);

/**
 * @swagger
 * /user/loginByEmail:
 *   post:
 *     summary: Connexion par email
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Connexion réussie avec token JWT
 */
router.post("/loginByEmail", ctrl.loginByEmail);
router.post("/loginByPhoneNumber", ctrl.loginByPhoneNumber);
router.post("/token", ctrl.handleToken);

/**
 * @swagger
 * /user/forgot-password:
 *   post:
 *     summary: Demander une réinitialisation de mot de passe
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Email de réinitialisation envoyé
 */
router.post("/forgot-password", ctrl.forgotPassword);
router.post("/reset-password", ctrl.resetPassword);
router.get("/me", ctrl.getMe);
router.get("/getAll", ctrl.getAllUsers);

module.exports = router;