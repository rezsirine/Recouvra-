const express = require('express')
const clientController = require('../controller/client.controller')
const router = express.Router()

// Utilisation des noms EXACTS de votre contrôleur
router.get("/getAll", clientController.getAll)
router.get("/get/:id", clientController.getOne)
router.post("/create", clientController.create)
router.put("/update/:id", clientController.update)
router.delete("/delete/:id", clientController.delete)

// Note: getClientInvoices n'existe pas dans votre contrôleur
// Si vous voulez cette fonction, il faudra l'ajouter

module.exports = router