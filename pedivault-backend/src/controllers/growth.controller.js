// src/controllers/growth.controller.js
const prisma = require('../config/database');

const getGrowthEntries = async (req, res, next) => {
  try {
    const entries = await prisma.growthEntry.findMany({
      where: { childId: req.params.childId },
      orderBy: { date: 'desc' },
    });
    res.json({ success: true, data: entries });
  } catch (err) { next(err); }
};

const addGrowthEntry = async (req, res, next) => {
  try {
    const { date, weightKg, heightCm, headCm, measuredBy, notes } = req.body;
    if (!date || weightKg === undefined)
      return res.status(400).json({ success: false, error: 'date and weightKg are required' });

    const entry = await prisma.growthEntry.create({
      data: { childId: req.params.childId, date: new Date(date), weightKg: parseFloat(weightKg), heightCm: heightCm ? parseFloat(heightCm) : null, headCm: headCm ? parseFloat(headCm) : null, measuredBy, notes },
    });
    res.status(201).json({ success: true, data: entry });
  } catch (err) { next(err); }
};

const deleteGrowthEntry = async (req, res, next) => {
  try {
    const existing = await prisma.growthEntry.findFirst({
      where: { id: req.params.id, childId: req.params.childId },
    });
    if (!existing) return res.status(404).json({ success: false, error: 'Growth entry not found' });

    await prisma.growthEntry.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Growth entry deleted' });
  } catch (err) { next(err); }
};

module.exports = { getGrowthEntries, addGrowthEntry, deleteGrowthEntry };
