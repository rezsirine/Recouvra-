const validate = (schema) => (req, res, next) => {
  // Validation du corps de la requête avec le schéma Joi
  const { error } = schema.validate(req.body, { 
    abortEarly: false }); // collecte TOUTES les erreurs
    // si erreurs  existent
  if (error) {
    const errors = error.details.map(d => d.message);
    return res.status(400).json({ message: 'Données invalides', errors });
  }
  //passage au middleware suivant
  next();
};

module.exports = validate;