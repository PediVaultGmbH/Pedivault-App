// src/routes/notifications.routes.js
const router  = require('express').Router();
const prisma  = require('../config/database');
const sms     = require('../services/sms.service');
const { authenticate } = require('../middleware/auth');

router.post('/test', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user.phone) return res.status(400).json({ success: false, error: 'No phone number on file' });
    const phone = `${user.countryCode}${user.phone}`;
    await sms.sendSMS(phone, `🌸 PediVault: Your notifications are working! You'll receive reminders based on your preferences.`);
    res.json({ success: true, message: `Test SMS sent to ${phone}` });
  } catch (err) { next(err); }
});

router.post('/vaccine-reminder', authenticate, async (req, res, next) => {
  try {
    const { childName, vaccineName, dose } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const prefs = user.notificationPrefs || {};
    if (!prefs.vaccineReminder || !prefs.pushDelivery)
      return res.json({ success: true, message: 'Notifications disabled by user' });
    const phone = `${user.countryCode}${user.phone}`;
    await sms.sendVaccineReminder(phone, childName, vaccineName, dose);
    res.json({ success: true, message: 'Vaccine reminder sent' });
  } catch (err) { next(err); }
});

module.exports = router;
