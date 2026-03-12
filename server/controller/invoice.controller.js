const Invoice = require("../model/invoice");
const Client = require("../model/client");
const RecoveryAction = require("../model/recoveryAction");

const getAll = async (req, res) => {
  try {
    let query = {};
    if (req.query.status) query.status = req.query.status;
    const invoices = await Invoice.find(query).populate("client").sort("-createdAt");
    res.json({ success: true, count: invoices.length, data: invoices });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOne = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("client");
    if (!invoice) return res.status(404).json({ message: "Facture non trouvée" });
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { number, amount, dueDate, clientId, description } = req.body;
    const client = await Client.findById(clientId);
    if (!client) return res.status(404).json({ message: "Client non trouvé" });
    const existingInvoice = await Invoice.findOne({ number });
    if (existingInvoice) return res.status(400).json({ message: "Ce numéro de facture existe déjà" });
    const invoice = await Invoice.create({ number, amount, dueDate, client: clientId, description });
    res.status(201).json({ message: "Facture créée", invoice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { number, amount, dueDate, description, clientId } = req.body;  // ← ajouter clientId
    const updateData = { number, amount, dueDate, description };
    if (clientId) updateData.client = clientId;  // ← ajouter cette ligne
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );
    if (!invoice) return res.status(404).json({ message: "Facture non trouvée" });
    res.json({ message: "Facture modifiée", invoice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const actionsCount = await RecoveryAction.countDocuments({ invoice: req.params.id });
    if (actionsCount > 0) return res.status(400).json({ message: "Impossible de supprimer : des actions de recouvrement sont associées" });
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Facture non trouvée" });
    res.json({ message: "Facture supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const registerPayment = async (req, res) => {
  try {
    const { amount } = req.body;
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Facture non trouvée" });
    
    const newPaidAmount = (invoice.paidAmount || 0) + Number(amount);
    
    
    if (newPaidAmount > invoice.amount) {
      return res.status(400).json({ 
        message: `Montant trop élevé. Reste à payer : ${invoice.amount - invoice.paidAmount} €` 
      });
    }
    
    invoice.paidAmount = newPaidAmount;
    await invoice.save();
    res.json({ success: true, message: "Paiement enregistré", invoice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOverdueInvoices = async (req, res) => {
  try {
    const overdueInvoices = await Invoice.find({ status: "overdue" }).populate("client", "name company phone");
    res.json({ success: true, count: overdueInvoices.length, data: overdueInvoices });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInvoiceStats = async (req, res) => {
  try {
    const [total, paid, unpaid, overdue, pending] = await Promise.all([
      Invoice.countDocuments(),
      Invoice.countDocuments({ status: "paid" }),
      Invoice.countDocuments({ status: "unpaid" }),
      Invoice.countDocuments({ status: "overdue" }),
      Invoice.countDocuments({ status: "pending" }),
    ]);
    const allInvoices = await Invoice.find({}, "amount paidAmount");
    const totalAmount = allInvoices.reduce((s, i) => s + i.amount, 0);
    const totalPaid = allInvoices.reduce((s, i) => s + i.paidAmount, 0);
    res.json({ total, paid, unpaid, overdue, pending, totalAmount, totalPaid, totalDue: totalAmount - totalPaid });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAll, getOne, create, update, delete: deleteInvoice, registerPayment, getOverdueInvoices, getInvoiceStats };