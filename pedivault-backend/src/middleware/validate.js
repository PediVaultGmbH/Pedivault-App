// src/middleware/validate.js
const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(
    { ...req.body, ...req.params, ...req.query },
    { abortEarly: false, stripUnknown: true }
  );
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(d => d.message),
    });
  }
  req.validated = value;
  next();
};

module.exports = { validate };

// ── src/middleware/childOwnership.js ──────────────────────────────────────────
// Ensures the child belongs to the authenticated user
