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
/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: Gestion des utilisateurs et authentification
 */

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Créer un compte utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Email déjà utilisé
 *       500:
 *         description: Erreur serveur
 */
router.post("/signup", ctrl.signUp);

/**
 * @swagger
 * /user/loginByEmail:
 *   post:
 *     summary: Connexion par email
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Email ou mot de passe incorrect
 */
router.post("/loginByEmail", ctrl.loginByEmail);

/**
 * @swagger
 * /user/loginByPhoneNumber:
 *   post:
 *     summary: Connexion par numéro de téléphone
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone_number
 *               - password
 *             properties:
 *               phone_number:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Numéro ou mot de passe incorrect
 */
router.post("/loginByPhoneNumber", ctrl.loginByPhoneNumber);

/**
 * @swagger
 * /user/token:
 *   post:
 *     summary: Rafraîchir un token JWT
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nouveau token généré
 *       401:
 *         description: Token invalide
 */
router.post("/token", ctrl.handleToken);

/**
 * @swagger
 * /user/forgot-password:
 *   post:
 *     summary: Demander une réinitialisation de mot de passe
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email de réinitialisation envoyé
 *       404:
 *         description: Aucun compte associé à cet email
 */
router.post("/forgot-password", ctrl.forgotPassword);

/**
 * @swagger
 * /user/reset-password:
 *   post:
 *     summary: Réinitialiser le mot de passe
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé
 *       400:
 *         description: Token invalide ou expiré
 */
router.post("/reset-password", ctrl.resetPassword);

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Obtenir les informations de l'utilisateur connecté
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 */
router.get("/me", protect, ctrl.getMe);

/**
 * @swagger
 * /user/getAll:
 *   get:
 *     summary: Liste tous les utilisateurs (admin uniquement)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès interdit (admin requis)
 */
router.get("/getAll", protect, ctrl.getAllUsers);

module.exports = router;