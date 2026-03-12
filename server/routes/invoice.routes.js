const express = require("express");
const router = express.Router();
const ctrl = require("../controller/invoice.controller");

/**
 * @swagger
 * /invoice/getAll:
 *   get:
 *     summary: Liste toutes les factures
 *     tags: [Factures]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [unpaid, paid, overdue, pending]
 *     responses:
 *       200:
 *         description: Liste des factures
 * /invoice/stats:
 *   get:
 *     summary: Statistiques des factures
 *     tags: [Factures]
 *     responses:
 *       200:
 *         description: Statistiques
 */
router.get("/getAll", ctrl.getAll);
router.get("/get/:id", ctrl.getOne);
router.get("/overdue", ctrl.getOverdueInvoices);
router.get("/stats", ctrl.getInvoiceStats);
router.post("/create", ctrl.create);
router.post("/payment/:id", ctrl.registerPayment);
router.put("/update/:id", ctrl.update);
router.delete("/delete/:id", ctrl.delete);

module.exports = router;