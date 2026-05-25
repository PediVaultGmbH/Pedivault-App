// src/services/email.service.js
const jwt = require('jsonwebtoken');

async function sendPasswordReset(user) {
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const url   = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/?token=${token}`;

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
      <h2 style="color:#9B3A56;margin-bottom:8px;">Reset your PediVault password</h2>
      <p>Hi ${user.firstName},</p>
      <p>Click the button below to reset your password. This link expires in <strong>15 minutes</strong>.</p>
      <a href="${url}" style="display:inline-block;margin:24px 0;padding:13px 28px;background:#9B3A56;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
        Reset Password
      </a>
      <p>Or copy this link:<br><a href="${url}" style="color:#9B3A56;word-break:break-all;">${url}</a></p>
      <hr style="margin:24px 0;border:none;border-top:1px solid #eee;">
      <p style="color:#999;font-size:12px;">If you didn't request a password reset, you can safely ignore this email.</p>
    </div>`;

  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = require('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from:    process.env.EMAIL_FROM || 'PediVault <onboarding@resend.dev>',
        to:      user.email,
        subject: 'Reset your PediVault password',
        html,
      });
      console.log('[EMAIL] Password reset sent to', user.email);
    } catch (err) {
      console.error('[EMAIL] Failed to send reset email:', err.message);
    }
  } else {
    console.log(`\n📧 [DEV EMAIL] Password reset for ${user.email}\n   Link: ${url}\n`);
  }
}

module.exports = { sendPasswordReset };
