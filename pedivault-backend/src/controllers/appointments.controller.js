// src/controllers/appointments.controller.js
const prisma = require('../config/database');

const getAppointments = async (req, res, next) => {
  try {
    const appts = await prisma.appointment.findMany({
      where: { childId: req.params.childId },
      orderBy: { date: 'asc' },
    });
    res.json({ success: true, data: appts });
  } catch (err) { next(err); }
};

const bookAppointment = async (req, res, next) => {
  try {
    const { type, doctor, clinic, date, time, notes } = req.body;
    if (!type || !date)
      return res.status(400).json({ success: false, error: 'type and date are required' });

    const appt = await prisma.appointment.create({
      data: { childId: req.params.childId, type, doctor, clinic, date: new Date(date), time, notes },
    });
    res.status(201).json({ success: true, data: appt });
  } catch (err) { next(err); }
};

const updateAppointment = async (req, res, next) => {
  try {
    const existing = await prisma.appointment.findFirst({
      where: { id: req.params.id, childId: req.params.childId },
    });
    if (!existing) return res.status(404).json({ success: false, error: 'Appointment not found' });

    const { type, doctor, clinic, date, time, notes, status } = req.body;
    const appt = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { type, doctor, clinic, ...(date && { date: new Date(date) }), time, notes, status },
    });
    res.json({ success: true, data: appt });
  } catch (err) { next(err); }
};

const cancelAppointment = async (req, res, next) => {
  try {
    const existing = await prisma.appointment.findFirst({
      where: { id: req.params.id, childId: req.params.childId },
    });
    if (!existing) return res.status(404).json({ success: false, error: 'Appointment not found' });

    await prisma.appointment.update({ where: { id: req.params.id }, data: { status: 'CANCELLED' } });
    res.json({ success: true, message: 'Appointment cancelled' });
  } catch (err) { next(err); }
};

module.exports = { getAppointments, bookAppointment, updateAppointment, cancelAppointment };
