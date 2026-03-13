const express = require("express");
const router = express.Router();
const ctrl = require("../controller/recovery.controller");
const { protect } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { createActionSchema, updateActionSchema } = require("../validation/recovery.validation");

router.use(protect);

router.get("/getAll",        ctrl.getAllActions);
router.get("/my-actions",    ctrl.getMyActions);
router.get("/upcoming",      ctrl.getUpcomingActions);
router.get("/stats",         ctrl.getActionStats);
router.get("/get/:id",       ctrl.getActionById);
router.post("/create",       validate(createActionSchema), ctrl.createAction);
router.put("/update/:id",    validate(updateActionSchema), ctrl.updateAction);
router.delete("/delete/:id", ctrl.deleteAction);

module.exports = router;