const Client = require('../models/Client');
const Invoice = require('../models/Invoice');

const clientController = {
    // GET all clients
    getAll: async (req, res) => {
        try {
            const clients = await Client.find()
                .populate('createdBy', 'name email')
                .sort('-createdAt');
            res.json(clients);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // GET one client
    getOne: async (req, res) => {
        try {
            const client = await Client.findById(req.params.id)
                .populate('createdBy', 'name email');
            
            if (!client) {
                return res.status(404).json({ message: 'Client non trouvé' });
            }
            
            res.json(client);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // POST create client
    create: async (req, res) => {
        try {
            const client = new Client({
                ...req.body,
                createdBy: req.user.id
            });
            await client.save();
            res.status(201).json(client);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // PUT update client
    update: async (req, res) => {
        try {
            const client = await Client.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            
            if (!client) {
                return res.status(404).json({ message: 'Client non trouvé' });
            }
            
            res.json(client);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // DELETE client
    delete: async (req, res) => {
        try {
            const client = await Client.findByIdAndDelete(req.params.id);
            
            if (!client) {
                return res.status(404).json({ message: 'Client non trouvé' });
            }
            
            res.json({ message: 'Client supprimé' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // GET client invoices
    getInvoices: async (req, res) => {
        try {
            const invoices = await Invoice.find({ client: req.params.id });
            res.json(invoices);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = clientController;