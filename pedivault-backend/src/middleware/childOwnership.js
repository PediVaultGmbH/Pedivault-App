// src/middleware/childOwnership.js
const prisma = require('../config/database');

async function childOwnership(req, res, next) {
  try {
    const childId = req.params.childId;
    if (!childId) return next();

    const child = await prisma.child.findUnique({ where: { id: childId } });
    if (!child)
      return res.status(404).json({ success: false, error: 'Child profile not found' });

    if (child.userId !== req.user.id)
      return res.status(403).json({ success: false, error: 'Access denied — this child does not belong to your account' });

    req.child = child;
    next();
  } catch (err) { next(err); }
}

module.exports = { childOwnership };
