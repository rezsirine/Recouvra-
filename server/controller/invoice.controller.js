// Importer les modèles
const Invoice = require('../model/invoice');
const Client = require('../model/client');
const RecoveryAction = require('../model/recoveryAction');

const invoiceController = {
    // GET /getAll
    getAll: async (req, res) => {
        try {
            let query = {};
            if (req.query.status) {
                query.status = req.query.status;
            }

            const invoices = await Invoice.find(query)
                .populate('client')
                .sort('-createdAt');
            res.json(invoices);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // GET /get/:id
    getOne: async (req, res) => {
        try {
            const invoice = await Invoice.findById(req.params.id)
                .populate('client');
            
            if (!invoice) {
                return res.status(404).json({ message: 'Facture non trouvée' });
            }
            
            res.json(invoice);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // POST /create
    create: async (req, res) => {
        try {
            const { number, amount, dueDate, clientId, description } = req.body;

            const client = await Client.findById(clientId);
            if (!client) {
                return res.status(404).json({ message: 'Client non trouvé' });
            }

            const existingInvoice = await Invoice.findOne({ number });
            if (existingInvoice) {
                return res.status(400).json({ message: 'Ce numéro de facture existe déjà' });
            }

            const invoice = new Invoice({
                number,
                amount,
                dueDate,
                client: clientId,
                description
            });

            await invoice.save();
            res.status(201).json({ message: 'Facture créée', invoice });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // PUT /update/:id
    update: async (req, res) => {
        try {
            const { number, amount, dueDate, description } = req.body;
            const invoice = await Invoice.findByIdAndUpdate(
                req.params.id,
                { number, amount, dueDate, description },
                { new: true, runValidators: true }
            );

            if (!invoice) {
                return res.status(404).json({ message: 'Facture non trouvée' });
            }

            res.json({ message: 'Facture modifiée', invoice });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // DELETE /delete/:id
    delete: async (req, res) => {
        try {
            const actionsCount = await RecoveryAction.countDocuments({ invoice: req.params.id });
            if (actionsCount > 0) {
                return res.status(400).json({ 
                    message: 'Impossible de supprimer : des actions de recouvrement sont associées' 
                });
            }

            const invoice = await Invoice.findByIdAndDelete(req.params.id);
            
            if (!invoice) {
                return res.status(404).json({ message: 'Facture non trouvée' });
            }

            res.json({ message: 'Facture supprimée' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

 
// POST /payment/:id - Version très simple
registerPayment: function(req, res) {
    console.log("Paiement reçu pour facture:", req.params.id);
    console.log("Montant:", req.body.amount);
    
    const { amount } = req.body;
    
    if (!amount) {
        return res.status(400).json({ message: "Montant requis" });
    }
    
    Invoice.findById(req.params.id)
        .then(invoice => {
            if (!invoice) {
                return res.status(404).json({ message: "Facture non trouvée" });
            }
            
            invoice.paidAmount = (invoice.paidAmount || 0) + amount;
            
            return invoice.save();
        })
        .then(invoice => {
            res.json({
                success: true,
                message: "Paiement enregistré",
                invoice: invoice
            });
        })
        .catch(error => {
            console.error("Erreur:", error);
            res.status(500).json({ 
                message: "Erreur serveur",
                error: error.message 
            });
        });
},
    // GET /overdue
    getOverdueInvoices: async (req, res) => {
        try {
            const overdueInvoices = await Invoice.find({ 
                status: 'overdue' 
            }).populate('client', 'name company phone');
            
            res.json(overdueInvoices);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // GET /stats
    getInvoiceStats: async (req, res) => {
        try {
            const total = await Invoice.countDocuments();
            const paid = await Invoice.countDocuments({ status: 'paid' });
            const unpaid = await Invoice.countDocuments({ status: 'unpaid' });
            const overdue = await Invoice.countDocuments({ status: 'overdue' });
            const pending = await Invoice.countDocuments({ status: 'pending' });

            const allInvoices = await Invoice.find();
            const totalAmount = allInvoices.reduce((sum, inv) => sum + inv.amount, 0);
            const totalPaid = allInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
            const totalDue = totalAmount - totalPaid;

            res.json({
                total,
                paid,
                unpaid,
                overdue,
                pending,
                totalAmount,
                totalPaid,
                totalDue
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = {
    getAll: invoiceController.getAll,
    getOne: invoiceController.getOne,
    create: invoiceController.create,
    update: invoiceController.update,
    delete: invoiceController.delete,
    registerPayment: invoiceController.registerPayment,
    getOverdueInvoices: invoiceController.getOverdueInvoices,
    getInvoiceStats: invoiceController.getInvoiceStats
};
