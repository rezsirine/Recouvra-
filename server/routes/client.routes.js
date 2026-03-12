const express = require("express");
const router = express.Router();
const ctrl = require("../controller/client.controller");

/**
 * @swagger
 * /client/getAll:
 *   get:
 *     summary: Liste tous les clients
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: Liste des clients
 * /client/create:
 *   post:
 *     summary: Créer un client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       201:
 *         description: Client créé
 */
router.get("/getAll", ctrl.getAll);
router.get("/get/:id", ctrl.getOne);
router.post("/create", ctrl.create);
router.put("/update/:id", ctrl.update);
router.delete("/delete/:id", ctrl.delete);

module.exports = router;