// Importer les modèles
const Client = require('../model/client');
const Invoice = require('../model/invoice');

const clientController = {
    // GET /getAll
    getAll: async (req, res) => {
        try {
            const clients = await Client.find()
                .populate('createdBy', 'name email')
                .sort('-createdAt');
            res.json(clients);
        } catch (error) {
            console.error('Erreur getAll:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // GET /get/:id
    getOne: async (req, res) => {
        try {
            const client = await Client.findById(req.params.id)
                .populate('createdBy', 'name email');
            
            if (!client) {
                return res.status(404).json({ message: 'Client non trouvé' });
            }
            
            res.json(client);
        } catch (error) {
            console.error('Erreur getOne:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // POST /create
    create: async (req, res) => {
        try {
            const { name, email, phone, company, siret, address } = req.body;

            const existingClient = await Client.findOne({ siret });
            if (existingClient) {
                return res.status(400).json({ message: 'Ce SIRET existe déjà' });
            }

            const client = new Client({
                name,
                email,
                phone,
                company,
                siret,
                address
                // createdBy commenté pour l'instant
            });

            await client.save();
            res.status(201).json({ message: 'Client créé', client });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // PUT /update/:id
    update: async (req, res) => {
        try {
            const client = await Client.findById(req.params.id);
            
            if (!client) {
                return res.status(404).json({ message: 'Client non trouvé' });
            }

            // COMMENTÉ pour l'instant
            // if (req.user.role === 'agent' && client.createdBy.toString() !== req.user.id) {
            //     return res.status(403).json({ message: 'Accès non autorisé' });
            // }

            const { name, email, phone, company, address } = req.body;
            
            client.name = name || client.name;
            client.email = email || client.email;
            client.phone = phone || client.phone;
            client.company = company || client.company;
            client.address = address || client.address;

            await client.save();
            res.json({ message: 'Client modifié', client });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // DELETE /delete/:id
    delete: async (req, res) => {
        try {
            const client = await Client.findById(req.params.id);
            
            if (!client) {
                return res.status(404).json({ message: 'Client non trouvé' });
            }

            // COMMENTÉ pour l'instant
            // if (req.user.role === 'agent' && client.createdBy.toString() !== req.user.id) {
            //     return res.status(403).json({ message: 'Accès non autorisé' });
            // }

            const invoicesCount = await Invoice.countDocuments({ client: client._id });
            if (invoicesCount > 0) {
                return res.status(400).json({ 
                    message: 'Impossible de supprimer : ce client a des factures' 
                });
            }

            await client.deleteOne();
            res.json({ message: 'Client supprimé' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = clientController;