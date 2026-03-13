const Joi = require('joi');

const createClientSchema = Joi.object({
  name:    Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Le nom est requis',
    'string.min':   'Le nom doit contenir au moins 2 caractères'
  }),
  company: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Le nom de l\'entreprise est requis'
  }),
  email:   Joi.string().email().required().messages({
    'string.email': 'Email invalide',
    'string.empty': 'L\'email est requis'
  }),
  phone:   Joi.string().pattern(/^[0-9+\s\-]{8,20}$/).required().messages({
    'string.pattern.base': 'Numéro de téléphone invalide',
    'string.empty':        'Le téléphone est requis'
  }),
  siret:   Joi.string().pattern(/^[0-9]{14}$/).required().messages({
    'string.pattern.base': 'Le SIRET doit contenir exactement 14 chiffres',
    'string.empty':        'Le SIRET est requis'
  }),
  address: Joi.string().min(5).max(200).required().messages({
    'string.empty': 'L\'adresse est requise'
  })
});

const updateClientSchema = Joi.object({
  name:    Joi.string().min(2).max(100),
  company: Joi.string().min(2).max(100),
  email:   Joi.string().email().messages({ 'string.email': 'Email invalide' }),
  phone:   Joi.string().pattern(/^[0-9+\s\-]{8,20}$/).messages({
    'string.pattern.base': 'Numéro de téléphone invalide'
  }),
  address: Joi.string().min(5).max(200)
}).min(1).messages({
  'object.min': 'Au moins un champ est requis pour la mise à jour'
});

module.exports = { createClientSchema, updateClientSchema };