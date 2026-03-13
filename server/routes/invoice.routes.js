const express = require("express");
const router = express.Router();
const ctrl = require("../controller/invoice.controller");
const { protect } = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Factures
 *   description: Gestion des factures
 */

router.use(protect);

/**
 * @swagger
 * /invoice/getAll:
 *   get:
 *     summary: Liste toutes les factures
 *     tags: [Factures]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [unpaid, paid, overdue, pending]
 *         description: Filtrer par statut
 *     responses:
 *       200:
 *         description: Liste des factures
 */
router.get("/getAll", ctrl.getAll);

/**
 * @swagger
 * /invoice/get/{id}:
 *   get:
 *     summary: Récupérer une facture par son ID
 *     tags: [Factures]
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
 *         description: Facture trouvée
 *       404:
 *         description: Facture non trouvée
 */
router.get("/get/:id", ctrl.getOne);

/**
 * @swagger
 * /invoice/overdue:
 *   get:
 *     summary: Liste les factures en retard
 *     tags: [Factures]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des factures en retard
 */
router.get("/overdue", ctrl.getOverdueInvoices);

/**
 * @swagger
 * /invoice/stats:
 *   get:
 *     summary: Statistiques des factures
 *     tags: [Factures]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 paid:
 *                   type: integer
 *                 unpaid:
 *                   type: integer
 *                 overdue:
 *                   type: integer
 *                 pending:
 *                   type: integer
 *                 totalAmount:
 *                   type: number
 *                 totalPaid:
 *                   type: number
 *                 totalDue:
 *                   type: number
 */
router.get("/stats", ctrl.getInvoiceStats);

/**
 * @swagger
 * /invoice/create:
 *   post:
 *     summary: Créer une facture
 *     tags: [Factures]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *               - amount
 *               - dueDate
 *               - clientId
 *             properties:
 *               number:
 *                 type: string
 *               amount:
 *                 type: number
 *               dueDate:
 *                 type: string
 *                 format: date
 *               clientId:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Facture créée
 *       400:
 *         description: Numéro de facture déjà existant
 *       404:
 *         description: Client non trouvé
 */
router.post("/create", ctrl.create);

/**
 * @swagger
 * /invoice/payment/{id}:
 *   post:
 *     summary: Enregistrer un paiement
 *     tags: [Factures]
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
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Paiement enregistré
 *       404:
 *         description: Facture non trouvée
 */
router.post("/payment/:id", ctrl.registerPayment);

/**
 * @swagger
 * /invoice/update/{id}:
 *   put:
 *     summary: Modifier une facture
 *     tags: [Factures]
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
 *               number:
 *                 type: string
 *               amount:
 *                 type: number
 *               dueDate:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Facture modifiée
 *       404:
 *         description: Facture non trouvée
 */
router.put("/update/:id", ctrl.update);

/**
 * @swagger
 * /invoice/delete/{id}:
 *   delete:
 *     summary: Supprimer une facture
 *     tags: [Factures]
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
 *         description: Facture supprimée
 *       400:
 *         description: Impossible de supprimer - actions de recouvrement associées
 *       404:
 *         description: Facture non trouvée
 */
router.delete("/delete/:id", ctrl.delete);

module.exports = router;