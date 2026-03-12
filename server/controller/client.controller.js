const Client = require("../model/client");
const Invoice = require("../model/invoice");

const getAll = async (req, res) => {
  try {
    const clients = await Client.find().populate("createdBy", "name email").sort("-createdAt");
    res.json({ success: true, count: clients.length, data: clients });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOne = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate("createdBy", "name email");
    if (!client) return res.status(404).json({ message: "Client non trouvé" });
    res.json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { name, email, phone, company, siret, address } = req.body;
    const existingClient = await Client.findOne({ siret });
    if (existingClient) return res.status(400).json({ message: "Ce SIRET existe déjà" });
    const client = await Client.create({ name, email, phone, company, siret, address, createdBy: req.user?._id });
    res.status(201).json({ message: "Client créé", client });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client non trouvé" });
    const { name, email, phone, company, address } = req.body;
    Object.assign(client, { name: name || client.name, email: email || client.email, phone: phone || client.phone, company: company || client.company, address: address || client.address });
    await client.save();
    res.json({ message: "Client modifié", client });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client non trouvé" });
    const invoicesCount = await Invoice.countDocuments({ client: client._id });
    if (invoicesCount > 0) return res.status(400).json({ message: "Impossible de supprimer : ce client a des factures" });
    await client.deleteOne();
    res.json({ message: "Client supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAll, getOne, create, update, delete: deleteClient };