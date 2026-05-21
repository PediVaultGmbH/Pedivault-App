// src/middleware/auth.js
const jwt    = require('jsonwebtoken');
const prisma = require('../config/database');

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer '))
      return res.status(401).json({ success: false, error: 'Authentication required. Please sign in.' });

    const token = header.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError')
        return res.status(401).json({ success: false, error: 'Session expired. Please sign in again.' });
      return res.status(401).json({ success: false, error: 'Invalid token. Please sign in again.' });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user)
      return res.status(401).json({ success: false, error: 'Account not found. Please sign in again.' });

    req.user = user;
    next();
  } catch (err) { next(err); }
}

module.exports = { authenticate };
