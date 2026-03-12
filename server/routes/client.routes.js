const express = require("express");
const router = express.Router();
const ctrl = require("../controller/client.controller");
const { protect } = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Gestion des clients
 */

// Toutes les routes client nécessitent d'être authentifié
router.use(protect);

/**
 * @swagger
 * /client/getAll:
 *   get:
 *     summary: Liste tous les clients
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des clients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Client'
 */
router.get("/getAll", ctrl.getAll);

/**
 * @swagger
 * /client/get/{id}:
 *   get:
 *     summary: Récupérer un client par son ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du client
 *     responses:
 *       200:
 *         description: Client trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Client'
 *       404:
 *         description: Client non trouvé
 */
router.get("/get/:id", ctrl.getOne);

/**
 * @swagger
 * /client/create:
 *   post:
 *     summary: Créer un nouveau client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       201:
 *         description: Client créé avec succès
 *       400:
 *         description: SIRET déjà existant
 */
router.post("/create", ctrl.create);

/**
 * @swagger
 * /client/update/{id}:
 *   put:
 *     summary: Modifier un client
 *     tags: [Clients]
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               company:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Client modifié
 *       404:
 *         description: Client non trouvé
 */
router.put("/update/:id", ctrl.update);

/**
 * @swagger
 * /client/delete/{id}:
 *   delete:
 *     summary: Supprimer un client
 *     tags: [Clients]
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
 *         description: Client supprimé
 *       400:
 *         description: Impossible de supprimer - des factures existent
 *       404:
 *         description: Client non trouvé
 */
router.delete("/delete/:id", ctrl.delete);

module.exports = router;