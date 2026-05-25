// src/routes/cron.routes.js
const router = require('express').Router();
const prisma = require('../config/database');
const sms    = require('../services/sms.service');

// Simple secret key check to protect the cron endpoint
function cronAuth(req, res, next) {
  const secret = req.headers['x-cron-secret'];
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// ── POST /api/cron/reminders ──────────────────────────────────────────────────
router.post('/reminders', cronAuth, async (req, res) => {
  const results = { appointments: 0, medications: 0, errors: [] };

  try {
    // ── Appointment reminders — appointments tomorrow ──────────────────────────
    const now       = new Date();
    const tomorrow  = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tStart = new Date(tomorrow); tStart.setHours(0, 0, 0, 0);
    const tEnd   = new Date(tomorrow); tEnd.setHours(23, 59, 59, 999);

    const appointments = await prisma.appointment.findMany({
      where: { date: { gte: tStart, lte: tEnd }, status: 'UPCOMING' },
      include: { child: { include: { user: true } } },
    });

    for (const appt of appointments) {
      try {
        const user  = appt.child?.user;
        const prefs = user?.notificationPrefs || {};
        if (!user?.phone || prefs.apptReminder === false) continue;
        const phone = `${user.countryCode || '+49'}${user.phone}`;
        await sms.sendAppointmentReminder(
          phone,
          appt.child.name,
          appt.type || 'appointment',
          appt.time || 'TBC',
          appt.clinic || appt.doctor || null
        );
        results.appointments++;
      } catch (err) {
        results.errors.push(`Appt ${appt.id}: ${err.message}`);
      }
    }

    // ── Medication reminders — active medications ─────────────────────────────
    const medications = await prisma.medication.findMany({
      where: { status: 'ACTIVE' },
      include: { child: { include: { user: true } } },
    });

    for (const med of medications) {
      try {
        const user  = med.child?.user;
        const prefs = user?.notificationPrefs || {};
        if (!user?.phone || prefs.medReminder === false) continue;
        const phone = `${user.countryCode || '+49'}${user.phone}`;
        await sms.sendMedicationReminder(
          phone,
          med.child.name,
          med.name,
          med.dosage,
          med.frequency
        );
        results.medications++;
      } catch (err) {
        results.errors.push(`Med ${med.id}: ${err.message}`);
      }
    }

    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/cron/weekly-summary ─────────────────────────────────────────────
router.post('/weekly-summary', cronAuth, async (req, res) => {
  const results = { sent: 0, errors: [] };

  try {
    const users = await prisma.user.findMany({
      include: { children: { include: { vaccines: true, appointments: true, medications: true } } },
    });

    for (const user of users) {
      try {
        const prefs = user.notificationPrefs || {};
        if (!user.phone || prefs.weeklySummary === false) continue;
        const phone = `${user.countryCode || '+49'}${user.phone}`;

        for (const child of user.children) {
          const activeVaccines   = child.vaccines?.length || 0;
          const upcomingAppts    = child.appointments?.filter(a => a.status === 'UPCOMING').length || 0;
          const activeMeds       = child.medications?.filter(m => m.status === 'ACTIVE').length || 0;

          const summary = [
            `💉 ${activeVaccines} vaccine records`,
            `📅 ${upcomingAppts} upcoming appointments`,
            `💊 ${activeMeds} active medications`,
          ].join('\n');

          await sms.sendWeeklySummary(phone, child.name, summary);
          results.sent++;
        }
      } catch (err) {
        results.errors.push(`User ${user.id}: ${err.message}`);
      }
    }

    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
