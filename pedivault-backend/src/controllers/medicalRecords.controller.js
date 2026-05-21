// src/controllers/medicalRecords.controller.js
const prisma     = require('../config/database');
const storageSvc = require('../services/storage.service');

const getRecords = async (req, res, next) => {
  try {
    const records = await prisma.medicalRecord.findMany({
      where: { childId: req.params.childId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: records });
  } catch (err) { next(err); }
};

const uploadRecord = async (req, res, next) => {
  try {
    const { name, type, source, notes } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'Record name is required' });

    let fileUrl = null, fileKey = null;
    if (req.file) {
      const result = await storageSvc.saveFile(req.file, req.params.childId);
      fileUrl = result.url;
      fileKey = result.key;
    }

    const record = await prisma.medicalRecord.create({
      data: { childId: req.params.childId, name, type: type || 'OTHER', source: source || null, notes: notes || null, fileUrl, fileKey },
    });
    res.status(201).json({ success: true, data: record });
  } catch (err) { next(err); }
};

const deleteRecord = async (req, res, next) => {
  try {
    // Verify ownership before deleting
    const record = await prisma.medicalRecord.findFirst({
      where: { id: req.params.id, childId: req.params.childId },
    });
    if (!record) return res.status(404).json({ success: false, error: 'Record not found' });

    if (record.fileKey) {
      try { await storageSvc.deleteFile(record.fileKey); } catch (_) { /* non-fatal */ }
    }
    await prisma.medicalRecord.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Record deleted' });
  } catch (err) { next(err); }
};

module.exports = { getRecords, uploadRecord, deleteRecord };
