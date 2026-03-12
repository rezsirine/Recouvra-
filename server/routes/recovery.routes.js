const express = require("express");
const router = express.Router();
const ctrl = require("../controller/recovery.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);

router.get("/getAll",        ctrl.getAllActions);
router.get("/my-actions",    ctrl.getMyActions);
router.get("/upcoming",      ctrl.getUpcomingActions);
router.get("/stats",         ctrl.getActionStats);
router.get("/get/:id",       ctrl.getActionById);
router.post("/create",       ctrl.createAction);
router.put("/update/:id",    ctrl.updateAction);
router.delete("/delete/:id", ctrl.deleteAction);

module.exports = router;