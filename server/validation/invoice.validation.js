const Joi = require('joi');

const createInvoiceSchema = Joi.object({
  number:      Joi.string().required().messages({
    'string.empty': 'Le numéro de facture est requis'
  }),
  amount:      Joi.number().positive().required().messages({
    'number.base':     'Le montant doit être un nombre',
    'number.positive': 'Le montant doit être positif',
    'any.required':    'Le montant est requis'
  }),
  dueDate:     Joi.date().greater('now').required().messages({
    'date.greater':  'La date d\'échéance doit être dans le futur',
    'any.required':  'La date d\'échéance est requise'
  }),
  clientId:    Joi.string().hex().length(24).required().messages({
    'string.hex':    'ID client invalide',
    'string.length': 'ID client invalide',
    'any.required':  'Le client est requis'
  }),
  description: Joi.string().max(500).optional().allow('')
});

const updateInvoiceSchema = Joi.object({
  number:      Joi.string(),
  amount:      Joi.number().positive().messages({
    'number.positive': 'Le montant doit être positif'
  }),
  dueDate:     Joi.date(),
  clientId:    Joi.string().hex().length(24).messages({
    'string.hex':    'ID client invalide',
    'string.length': 'ID client invalide'
  }),
  description: Joi.string().max(500).allow('')
}).min(1);

const paymentSchema = Joi.object({
  amount: Joi.number().positive().required().messages({
    'number.positive': 'Le montant du paiement doit être positif',
    'any.required':    'Le montant est requis'
  })
});

module.exports = { createInvoiceSchema, updateInvoiceSchema, paymentSchema };