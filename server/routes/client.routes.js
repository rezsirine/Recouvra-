const express = require("express");
const router = express.Router();
const ctrl = require("../controller/client.controller");
const { protect } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { createClientSchema, updateClientSchema } = require("../validation/client.validation");

router.use(protect);

router.get("/getAll",        ctrl.getAll);
router.get("/get/:id",       ctrl.getOne);
router.post("/create",       validate(createClientSchema), ctrl.create);
router.put("/update/:id",    validate(updateClientSchema), ctrl.update);
router.delete("/delete/:id", ctrl.delete);

module.exports = router;