const express = require("express");
const router = express.Router();
const ctrl = require("../controller/client.controller");
const { protect } = require("../middleware/auth.middleware");

// Toutes les routes client nécessitent d'être authentifié
router.use(protect);

router.get("/getAll",     ctrl.getAll);
router.get("/get/:id",    ctrl.getOne);
router.post("/create",    ctrl.create);
router.put("/update/:id", ctrl.update);
router.delete("/delete/:id", ctrl.delete);

module.exports = router;