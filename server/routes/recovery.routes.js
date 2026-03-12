const express = require("express");
const router = express.Router();
const ctrl = require("../controller/recovery.controller");

/**
 * @swagger
 * /recovery/getAll:
 *   get:
 *     summary: Liste toutes les actions de recouvrement
 *     tags: [Recouvrement]
 *     responses:
 *       200:
 *         description: Liste des actions
 * /recovery/create:
 *   post:
 *     summary: Créer une action de recouvrement
 *     tags: [Recouvrement]
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
router.get("/getAll", ctrl.getAllActions);
router.get("/my-actions", ctrl.getMyActions);
router.get("/upcoming", ctrl.getUpcomingActions);
router.get("/stats", ctrl.getActionStats);
router.get("/get/:id", ctrl.getActionById);
router.post("/create", ctrl.createAction);
router.put("/update/:id", ctrl.updateAction);
router.delete("/delete/:id", ctrl.deleteAction);

module.exports = router;