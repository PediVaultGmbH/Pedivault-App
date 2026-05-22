```javascript
// src/controllers/vaccines.controller.js
const prisma = require('../config/database');

const getVaccineRecords = async (req, res, next) => {
  try {
    const records = await prisma.vaccineRecord.findMany({
      where: { childId: req.params.childId },
      orderBy: { date: 'desc' },
    });
    res.json({ success: true, data: records });
  } catch (err) { next(err); }
};

const logVaccine = async (req, res, next) => {
  try {
    const { vaccineId, vaccineName, dose, date, doctor, clinic, notes, batchNumber } = req.body;
    if (!vaccineName || !dose || !date)
      return res.status(400).json({ success: false, error: 'vaccineName, dose, and date are required' });

    const record = await prisma.vaccineRecord.create({
      data: { childId: req.params.childId, vaccineId: vaccineId || vaccineName, vaccineName, dose, date: new Date(date), doctor, clinic, notes, batchNumber },
    });
    res.status(201).json({ success: true, data: record });
  } catch (err) { next(err); }
};

const updateVaccineRecord = async (req, res, next) => {
  try {
    const existing = await prisma.vaccineRecord.findFirst({
      where: { id: req.params.id, childId: req.params.childId },
    });
    if (!existing) return res.status(404).json({ success: false, error: 'Vaccine record not found' });

    const { vaccineName, dose, date, doctor, clinic, notes, batchNumber } = req.body;
    const record = await prisma.vaccineRecord.update({
      where: { id: req.params.id },
      data: { vaccineName, dose, ...(date && { date: new Date(date) }), doctor, clinic, notes, batchNumber },
    });
    res.json({ success: true, data: record });
  } catch (err) { next(err); }
};

const deleteVaccineRecord = async (req, res, next) => {
  try {
    const existing = await prisma.vaccineRecord.findFirst({
      where: { id: req.params.id, childId: req.params.childId },
    });
    if (!existing) return res.status(404).json({ success: false, error: 'Vaccine record not found' });

    await prisma.vaccineRecord.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Vaccine record deleted' });
  } catch (err) { next(err); }
};

module.exports = { getVaccineRecords, logVaccine, updateVaccineRecord, deleteVaccineRecord };

```
