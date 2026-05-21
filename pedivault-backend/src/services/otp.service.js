// src/services/otp.service.js
const prisma = require('../config/database');

function generateCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

async function sendOTP(userId, phoneNumber, type) {
  const code      = generateCode();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  // Invalidate previous OTPs of same type
  await prisma.otp.updateMany({
    where: { userId, type, usedAt: null },
    data:  { usedAt: new Date() },
  });

  await prisma.otp.create({ data: { userId, code, type, expiresAt } });

  // ── Real Twilio only if a genuine SID is configured ───────────────────────
  const hasRealTwilio =
    process.env.TWILIO_ACCOUNT_SID?.startsWith('AC') &&
    process.env.TWILIO_ACCOUNT_SID.length === 34 &&
    process.env.TWILIO_AUTH_TOKEN?.length > 10;

  if (hasRealTwilio) {
    const twilio = require('twilio')(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    await twilio.messages.create({
      body: `Your PediVault code: ${code}. Valid for 5 minutes. Never share this.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to:   phoneNumber,
    });
  } else {
    console.log(`\n📱 [DEV OTP] Phone: ${phoneNumber}  Code: ${code}\n`);
  }

  return code;
}

async function verifyOTP(userId, code) {
  const otp = await prisma.otp.findFirst({
    where: {
      userId,
      code,
      usedAt:    null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!otp) return false;

  await prisma.otp.update({ where: { id: otp.id }, data: { usedAt: new Date() } });
  return true;
}

module.exports = { sendOTP, verifyOTP };
