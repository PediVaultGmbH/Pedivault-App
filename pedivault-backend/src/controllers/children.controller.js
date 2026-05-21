// src/controllers/children.controller.js
const prisma = require('../config/database');

const getChildren = async (req, res, next) => {
  try {
    const children = await prisma.child.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ success: true, data: children });
  } catch (err) { next(err); }
};

const getChild = async (req, res) => {
  res.json({ success: true, data: req.child });
};

const createChild = async (req, res, next) => {
  try {
    const { name, dateOfBirth, gender, bloodType, allergies, color } = req.body;
    if (!name || !dateOfBirth || !gender)
      return res.status(400).json({ success: false, error: 'name, dateOfBirth, and gender are required' });

    const child = await prisma.child.create({
      data: {
        userId: req.user.id,
        name,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        bloodType: bloodType || null,
        allergies: allergies || [],
        color: color || '#C47A92',
      },
    });
    res.status(201).json({ success: true, data: child });
  } catch (err) { next(err); }
};

const updateChild = async (req, res, next) => {
  try {
    const { name, dateOfBirth, gender, bloodType, allergies, color } = req.body;
    const child = await prisma.child.update({
      where: { id: req.params.childId },
      data: {
        ...(name        && { name }),
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
        ...(gender      && { gender }),
        ...(bloodType !== undefined && { bloodType }),
        ...(allergies   && { allergies }),
        ...(color       && { color }),
      },
    });
    res.json({ success: true, data: child });
  } catch (err) { next(err); }
};

const deleteChild = async (req, res, next) => {
  try {
    await prisma.child.delete({ where: { id: req.params.childId } });
    res.json({ success: true, message: 'Child removed from account' });
  } catch (err) { next(err); }
};

module.exports = { getChildren, getChild, createChild, updateChild, deleteChild };
