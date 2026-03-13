const express = require("express");
const router = express.Router();
const ctrl = require("../controller/invoice.controller");
const { protect } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { createInvoiceSchema, updateInvoiceSchema, paymentSchema } = require("../validation/invoice.validation");

router.use(protect);

router.get("/getAll",        ctrl.getAll);
router.get("/get/:id",       ctrl.getOne);
router.get("/overdue",       ctrl.getOverdueInvoices);
router.get("/stats",         ctrl.getInvoiceStats);
router.post("/create",       validate(createInvoiceSchema), ctrl.create);
router.post("/payment/:id",  validate(paymentSchema),       ctrl.registerPayment);
router.put("/update/:id",    validate(updateInvoiceSchema), ctrl.update);
router.delete("/delete/:id", ctrl.delete);

module.exports = router;