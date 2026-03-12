const RecoveryAction = require("../model/recoveryAction");
const Invoice = require("../model/invoice");

const getAllActions = async (req, res) => {
  try {
    const actions = await RecoveryAction.find()
      .populate("invoice", "number amount status")
      .populate("agent", "name email")
      .sort("-date");
    res.json({ success: true, count: actions.length, data: actions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getActionById = async (req, res) => {
  try {
    const action = await RecoveryAction.findById(req.params.id).populate("invoice").populate("agent", "name email");
    if (!action) return res.status(404).json({ message: "Action non trouvée" });
    res.json({ success: true, data: action });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAction = async (req, res) => {
  try {
    const { invoiceId, type, description, date, nextAction } = req.body;
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ message: "Facture non trouvée" });
    const action = await RecoveryAction.create({ invoice: invoiceId, agent: req.user?._id, type, description, date: date || new Date(), nextAction });
    res.status(201).json({ message: "Action créée", action });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAction = async (req, res) => {
  try {
    const action = await RecoveryAction.findById(req.params.id);
    if (!action) return res.status(404).json({ message: "Action non trouvée" });
    const { type, description, date, outcome, nextAction } = req.body;
    Object.assign(action, {
      type: type || action.type,
      description: description || action.description,
      date: date || action.date,
      outcome: outcome || action.outcome,
      nextAction: nextAction || action.nextAction,
    });
    await action.save();
    res.json({ message: "Action modifiée", action });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAction = async (req, res) => {
  try {
    const action = await RecoveryAction.findByIdAndDelete(req.params.id);
    if (!action) return res.status(404).json({ message: "Action non trouvée" });
    res.json({ message: "Action supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyActions = async (req, res) => {
  try {
    const actions = await RecoveryAction.find({ agent: req.user?._id })
      .populate("invoice", "number amount")
      .populate("agent", "name")
      .sort("-date");
    res.json({ success: true, data: actions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUpcomingActions = async (req, res) => {
  try {
    const actions = await RecoveryAction.find({ nextAction: { $ne: null, $gte: new Date() } })
      .populate("invoice", "number amount dueDate")
      .populate("agent", "name")
      .sort("nextAction")
      .limit(10);
    res.json({ success: true, data: actions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getActionStats = async (req, res) => {
  try {
    const [total, pending, successful, failed, rescheduled] = await Promise.all([
      RecoveryAction.countDocuments(),
      RecoveryAction.countDocuments({ outcome: "pending" }),
      RecoveryAction.countDocuments({ outcome: "successful" }),
      RecoveryAction.countDocuments({ outcome: "failed" }),
      RecoveryAction.countDocuments({ outcome: "rescheduled" }),
    ]);
    res.json({ total, byOutcome: { pending, successful, failed, rescheduled } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllActions, getActionById, createAction, updateAction, deleteAction, getMyActions, getUpcomingActions, getActionStats };