const express = require("express");
const router = express.Router();
const ctrl = require("../controller/recovery.controller");
const { protect } = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Recouvrement
 *   description: Gestion des actions de recouvrement
 */

router.use(protect);

/**
 * @swagger
 * /recovery/getAll:
 *   get:
 *     summary: Liste toutes les actions de recouvrement
 *     tags: [Recouvrement]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des actions
 */
router.get("/getAll", ctrl.getAllActions);

/**
 * @swagger
 * /recovery/my-actions:
 *   get:
 *     summary: Liste les actions de l'agent connecté
 *     tags: [Recouvrement]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des actions de l'agent
 */
router.get("/my-actions", ctrl.getMyActions);

/**
 * @swagger
 * /recovery/upcoming:
 *   get:
 *     summary: Liste les actions à venir
 *     tags: [Recouvrement]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des prochaines actions
 */
router.get("/upcoming", ctrl.getUpcomingActions);

/**
 * @swagger
 * /recovery/stats:
 *   get:
 *     summary: Statistiques des actions de recouvrement
 *     tags: [Recouvrement]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques
 */
router.get("/stats", ctrl.getActionStats);

/**
 * @swagger
 * /recovery/get/{id}:
 *   get:
 *     summary: Récupérer une action par son ID
 *     tags: [Recouvrement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Action trouvée
 *       404:
 *         description: Action non trouvée
 */
router.get("/get/:id", ctrl.getActionById);

/**
 * @swagger
 * /recovery/create:
 *   post:
 *     summary: Créer une action de recouvrement
 *     tags: [Recouvrement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecoveryAction'
 *     responses:
 *       201:
 *         description: Action créée
 */
router.post("/create", ctrl.createAction);

/**
 * @swagger
 * /recovery/update/{id}:
 *   put:
 *     summary: Modifier une action de recouvrement
 *     tags: [Recouvrement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [call, email, meeting]
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               outcome:
 *                 type: string
 *                 enum: [pending, successful, failed, rescheduled]
 *               nextAction:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Action modifiée
 *       404:
 *         description: Action non trouvée
 */
router.put("/update/:id", ctrl.updateAction);

/**
 * @swagger
 * /recovery/delete/{id}:
 *   delete:
 *     summary: Supprimer une action de recouvrement
 *     tags: [Recouvrement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Action supprimée
 *       404:
 *         description: Action non trouvée
 */
router.delete("/delete/:id", ctrl.deleteAction);

module.exports = router;