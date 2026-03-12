const express = require("express");
const router = express.Router();
const ctrl = require("../controller/invoice.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);

router.get("/getAll",        ctrl.getAll);
router.get("/get/:id",       ctrl.getOne);
router.get("/overdue",       ctrl.getOverdueInvoices);
router.get("/stats",         ctrl.getInvoiceStats);
router.post("/create",       ctrl.create);
router.post("/payment/:id",  ctrl.registerPayment);
router.put("/update/:id",    ctrl.update);
router.delete("/delete/:id", ctrl.delete);

module.exports = router;