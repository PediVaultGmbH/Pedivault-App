const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { type, message, rating } = req.body;
    const user = req.user;

    if (!message?.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Send feedback email
    await resend.emails.send({
      from: 'PediVault Feedback <noreply@pedivault.de>',
      to: 'support@pedivault.de',
      subject: `[Feedback] ${type || 'General'} — Rating: ${'⭐'.repeat(rating || 0)}`,
      html: `
        <h2>New Feedback from PediVault</h2>
        <p><strong>From:</strong> ${user.email} (${user.firstName} ${user.lastName})</p>
        <p><strong>Type:</strong> ${type || 'General'}</p>
        <p><strong>Rating:</strong> ${'⭐'.repeat(rating || 0)} (${rating}/5)</p>
        <hr/>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr/>
        <p style="color:#888;font-size:12px">Sent from PediVault app · ${new Date().toISOString()}</p>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Feedback error:', err);
    // Return success anyway — don't block UX on email failures
    res.json({ success: true });
  }
});

module.exports = router;
