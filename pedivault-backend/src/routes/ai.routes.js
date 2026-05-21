// src/routes/ai.routes.js
const router = require('express').Router();
const ctrl   = require('../controllers/ai.controller');
const { authenticate } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'AI request limit reached. Please wait a moment.' },
});

router.post('/chat', authenticate, aiLimiter, ctrl.chat);

module.exports = router;
