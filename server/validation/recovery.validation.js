const Joi = require('joi');

const createActionSchema = Joi.object({
  invoiceId:   Joi.string().hex().length(24).required().messages({
    'string.hex':    'ID facture invalide',
    'string.length': 'ID facture invalide',
    'any.required':  'La facture est requise'
  }),
  type:        Joi.string().valid('call', 'email', 'meeting').required().messages({
    'any.only':    'Le type doit être call, email ou meeting',
    'any.required':'Le type est requis'
  }),
  description: Joi.string().min(5).max(500).required().messages({
    'string.empty': 'La description est requise',
    'string.min':   'La description doit contenir au moins 5 caractères'
  }),
  date:        Joi.date().optional(),
  nextAction:  Joi.date().optional().allow(null)
});

const updateActionSchema = Joi.object({
  type:        Joi.string().valid('call', 'email', 'meeting'),
  description: Joi.string().min(5).max(500),
  date:        Joi.date(),
  outcome:     Joi.string().valid('pending', 'successful', 'failed', 'rescheduled').messages({
    'any.only': 'Le résultat doit être pending, successful, failed ou rescheduled'
  }),
  nextAction:  Joi.date().allow(null)
}).min(1);

module.exports = { createActionSchema, updateActionSchema };