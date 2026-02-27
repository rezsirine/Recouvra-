const express = require('express')
const invoiceController = require('../controller/invoice.controller')
const router = express.Router()

// Routes GET
router.get("/getAll", invoiceController.getAll)
router.get("/get/:id", invoiceController.getOne)
router.get("/overdue", invoiceController.getOverdueInvoices)
router.get("/stats", invoiceController.getInvoiceStats)

// Routes POST
router.post("/create", invoiceController.create)
router.post("/payment/:id", invoiceController.registerPayment)  
// Routes PUT
router.put("/update/:id", invoiceController.update)

// Routes DELETE
router.delete("/delete/:id", invoiceController.delete)

module.exports = router