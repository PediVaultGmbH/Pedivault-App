// src/controllers/medications.controller.js
const prisma = require('../config/database');

const getMedications = async (req, res, next) => {
  try {
    const meds = await prisma.medication.findMany({
      where: { childId: req.params.childId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: meds });
  } catch (err) { next(err); }
};

const addMedication = async (req, res, next) => {
  try {
    const { name, dosage, frequency, startDate, endDate, prescribedBy, type, notes } = req.body;
    if (!name || !dosage || !frequency || !startDate)
      return res.status(400).json({ success: false, error: 'name, dosage, frequency, and startDate are required' });

    const med = await prisma.medication.create({
      data: { childId: req.params.childId, name, dosage, frequency, startDate: new Date(startDate), endDate: endDate ? new Date(endDate) : null, prescribedBy, type: type || 'OTHER', notes },
    });
    res.status(201).json({ success: true, data: med });
  } catch (err) { next(err); }
};

const updateMedication = async (req, res, next) => {
  try {
    const existing = await prisma.medication.findFirst({
      where: { id: req.params.id, childId: req.params.childId },
    });
    if (!existing) return res.status(404).json({ success: false, error: 'Medication not found' });

    const { name, dosage, frequency, startDate, endDate, prescribedBy, type, status, notes } = req.body;
    const med = await prisma.medication.update({
      where: { id: req.params.id },
      data: { name, dosage, frequency, ...(startDate && { startDate: new Date(startDate) }), ...(endDate && { endDate: new Date(endDate) }), prescribedBy, type, status, notes },
    });
    res.json({ success: true, data: med });
  } catch (err) { next(err); }
};

const deleteMedication = async (req, res, next) => {
  try {
    const existing = await prisma.medication.findFirst({
      where: { id: req.params.id, childId: req.params.childId },
    });
    if (!existing) return res.status(404).json({ success: false, error: 'Medication not found' });

    await prisma.medication.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Medication deleted' });
  } catch (err) { next(err); }
};

module.exports = { getMedications, addMedication, updateMedication, deleteMedication };
