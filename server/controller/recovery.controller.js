// Importer les modèles
const RecoveryAction = require('../model/recoveryAction');
const Invoice = require('../model/invoice');

const recoveryController = {
    // GET /getAll
    getAllActions: async (req, res) => {
        try {
            const actions = await RecoveryAction.find()
                .populate('invoice', 'number amount status')
                .populate('agent', 'name email')
                .sort('-date');
            res.json(actions);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // GET /get/:id
    getActionById: async (req, res) => {
        try {
            const action = await RecoveryAction.findById(req.params.id)
                .populate('invoice')
                .populate('agent', 'name email');

            if (!action) {
                return res.status(404).json({ message: 'Action non trouvée' });
            }
            res.json(action);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // POST /create
    createAction: async (req, res) => {
        try {
            const { invoiceId, type, description, date, nextAction } = req.body;

            const invoice = await Invoice.findById(invoiceId);
            if (!invoice) {
                return res.status(404).json({ message: 'Facture non trouvée' });
            }

            const action = new RecoveryAction({
                invoice: invoiceId,
                type,
                description,
                date: date || new Date(),
                nextAction
            });

            await action.save();
            res.status(201).json({ message: 'Action créée', action });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // PUT /update/:id
    updateAction: async (req, res) => {
        try {
            const action = await RecoveryAction.findById(req.params.id);
            
            if (!action) {
                return res.status(404).json({ message: 'Action non trouvée' });
            }

            const { type, description, date, outcome, nextAction } = req.body;
            
            action.type = type || action.type;
            action.description = description || action.description;
            action.date = date || action.date;
            action.outcome = outcome || action.outcome;
            action.nextAction = nextAction || action.nextAction;

            await action.save();
            res.json({ message: 'Action modifiée', action });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // DELETE /delete/:id
    deleteAction: async (req, res) => {
        try {
            const action = await RecoveryAction.findByIdAndDelete(req.params.id);
            
            if (!action) {
                return res.status(404).json({ message: 'Action non trouvée' });
            }
            res.json({ message: 'Action supprimée' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // GET /my-actions
    getMyActions: async (req, res) => {
        try {
            const actions = await RecoveryAction.find()
                .populate('invoice', 'number amount')
                .populate('agent', 'name')
                .sort('-date');
            res.json(actions);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // GET /upcoming
    getUpcomingActions: async (req, res) => {
        try {
            const actions = await RecoveryAction.find({
                nextAction: { $ne: null, $gte: new Date() }
            })
            .populate('invoice', 'number amount dueDate')
            .populate('agent', 'name')
            .sort('nextAction')
            .limit(10);
            res.json(actions);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // GET /stats
    getActionStats: async (req, res) => {
        try {
            const total = await RecoveryAction.countDocuments();
            const pending = await RecoveryAction.countDocuments({ outcome: 'pending' });
            const successful = await RecoveryAction.countDocuments({ outcome: 'successful' });
            const failed = await RecoveryAction.countDocuments({ outcome: 'failed' });
            const rescheduled = await RecoveryAction.countDocuments({ outcome: 'rescheduled' });

            res.json({
                total,
                byOutcome: { pending, successful, failed, rescheduled }
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
};

module.exports = recoveryController;