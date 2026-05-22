// src/controllers/auth.controller.js
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const prisma   = require('../config/database');
const otpSvc   = require('../services/otp.service');
const emailSvc = require('../services/email.service');

// ── Token helpers ─────────────────────────────────────────────────────────────
const issueAccess  = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });

const issueRefresh = (userId, expiresIn = '30d') =>
  jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn });

const safeUser = (user) => {
  const { passwordHash, ...rest } = user;
  return rest;
};

// ── POST /api/auth/register ───────────────────────────────────────────────────
async function register(req, res, next) {
  try {
    const { firstName, lastName, email, phone, countryCode, password } = req.body;
    if (!firstName || !lastName || !email || !phone || !password)
      return res.status(400).json({ success: false, error: 'firstName, lastName, email, phone, and password are required' });

    if (password.length < 8)
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters' });

    const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { phone }] } });
    if (existing) {
      const field = existing.email === email ? 'Email' : 'Phone number';
      return res.status(409).json({ success: false, error: `${field} is already registered` });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { firstName, lastName, email: email.toLowerCase(), phone, countryCode: countryCode || '+49', passwordHash },
    });

    await otpSvc.sendOTP(user.id, `${user.countryCode}${user.phone}`, 'REGISTRATION');
    res.status(201).json({ success: true, message: 'Account created. A 4-digit code has been sent to your phone.', userId: user.id });
  } catch (err) { next(err); }
}

// ── POST /api/auth/otp/send ───────────────────────────────────────────────────
async function sendOTP(req, res, next) {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, error: 'Phone number is required' });

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) return res.status(404).json({ success: false, error: 'No account found with that phone number' });

    await otpSvc.sendOTP(user.id, `${user.countryCode}${user.phone}`, 'REGISTRATION');
    res.json({ success: true, message: 'Verification code sent', expiresIn: 300 });
  } catch (err) { next(err); }
}

// ── POST /api/auth/otp/verify ─────────────────────────────────────────────────
async function verifyOTP(req, res, next) {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ success: false, error: 'phone and code are required' });

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) return res.status(404).json({ success: false, error: 'No account found with that phone number' });

    const valid = await otpSvc.verifyOTP(user.id, code);
    if (!valid) return res.status(400).json({ success: false, error: 'Invalid or expired code. Please request a new one.' });

    await prisma.user.update({ where: { id: user.id }, data: { isVerified: true } });

    const accessToken  = issueAccess(user.id);
    const refreshToken = issueRefresh(user.id, '30d');
    await prisma.session.create({
      data: { userId: user.id, refreshToken, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    });

    res.json({ success: true, token: accessToken, refreshToken, user: { ...safeUser(user), isVerified: true } });
  } catch (err) { next(err); }
}

// ── POST /api/auth/otp/resend ─────────────────────────────────────────────────
async function resendOTP(req, res, next) {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, error: 'Phone number is required' });

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) return res.status(404).json({ success: false, error: 'No account found with that phone number' });

    await otpSvc.sendOTP(user.id, `${user.countryCode}${user.phone}`, 'REGISTRATION');
    res.json({ success: true, message: 'New code sent', expiresIn: 300 });
  } catch (err) { next(err); }
}

// ── POST /api/auth/signin ─────────────────────────────────────────────────────
async function signIn(req, res, next) {
  try {
    const { email, password, rememberMe = false } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, error: 'Email and password are required' });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    const match = user ? await bcrypt.compare(password, user.passwordHash) : false;

    if (!user || !match)
      return res.status(401).json({ success: false, error: 'Incorrect email or password' });

    if (!user.isVerified)
      return res.status(403).json({ success: false, error: 'Please verify your phone number before signing in' });

    const accessToken     = issueAccess(user.id);
    const refreshExpiry   = rememberMe ? '30d' : '1d';
    const refreshMs       = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const refreshToken    = issueRefresh(user.id, refreshExpiry);

    await prisma.session.create({
      data: { userId: user.id, refreshToken, expiresAt: new Date(Date.now() + refreshMs) },
    });

    res.json({ success: true, token: accessToken, refreshToken, user: safeUser(user) });
  } catch (err) { next(err); }
}

// ── POST /api/auth/refresh ────────────────────────────────────────────────────
async function refreshToken(req, res, next) {
  try {
    const { refreshToken: rt } = req.body;
    if (!rt) return res.status(400).json({ success: false, error: 'refreshToken is required' });

    let decoded;
    try {
      decoded = jwt.verify(rt, process.env.REFRESH_TOKEN_SECRET);
    } catch {
      return res.status(401).json({ success: false, error: 'Invalid or expired refresh token. Please sign in again.' });
    }

    const session = await prisma.session.findUnique({ where: { refreshToken: rt } });
    if (!session || session.expiresAt < new Date())
      return res.status(401).json({ success: false, error: 'Session expired. Please sign in again.' });

    const newAccess   = issueAccess(decoded.userId);
    const newRefresh  = issueRefresh(decoded.userId, '30d');
    await prisma.session.update({
      where: { id: session.id },
      data: { refreshToken: newRefresh, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    });

    res.json({ success: true, token: newAccess, refreshToken: newRefresh });
  } catch (err) { next(err); }
}

// ── POST /api/auth/signout ────────────────────────────────────────────────────
async function signOut(req, res, next) {
  try {
    const { refreshToken: rt } = req.body;
    if (rt) await prisma.session.deleteMany({ where: { refreshToken: rt } });
    res.json({ success: true, message: 'Signed out successfully' });
  } catch (err) { next(err); }
}

// ── POST /api/auth/forgot-password ───────────────────────────────────────────
async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email is required' });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (user) await emailSvc.sendPasswordReset(user);
    res.json({ success: true, message: 'If an account exists for that email, a reset link has been sent.' });
  } catch (err) { next(err); }
}

// ── POST /api/auth/reset-password ────────────────────────────────────────────
async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword)
      return res.status(400).json({ success: false, error: 'token and newPassword are required' });

    if (newPassword.length < 8)
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({ success: false, error: 'Reset link is invalid or has expired. Please request a new one.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: decoded.userId }, data: { passwordHash } });
    await prisma.session.deleteMany({ where: { userId: decoded.userId } });

    res.json({ success: true, message: 'Password updated successfully. Please sign in.' });
  } catch (err) { next(err); }
}

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
async function getMe(req, res, next) {
  try {
    res.json({ success: true, data: safeUser(req.user) });
  } catch (err) { next(err); }
}

// ── PUT /api/auth/me ──────────────────────────────────────────────────────────
async function updateMe(req, res, next) {
  try {
    const { firstName, lastName, phone } = req.body;
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName  && { lastName  }),
        ...(phone     && { phone     }),
      },
    });
    res.json({ success: true, data: safeUser(updated) });
  } catch (err) { next(err); }
}

// ── POST /api/auth/change-password ───────────────────────────────────────────
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, error: 'currentPassword and newPassword are required' });

    if (newPassword.length < 8)
      return res.status(400).json({ success: false, error: 'New password must be at least 8 characters' });

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const match = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!match)
      return res.status(400).json({ success: false, error: 'Current password is incorrect' });

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: req.user.id }, data: { passwordHash } });
    await prisma.session.deleteMany({ where: { userId: req.user.id } });

    res.json({ success: true, message: 'Password changed successfully. Please sign in again.' });
  } catch (err) { next(err); }
}

// ── GET /api/auth/sessions ────────────────────────────────────────────────────
async function getSessions(req, res, next) {
  try {
    const sessions = await prisma.session.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: sessions });
  } catch (err) { next(err); }
}

// ── DELETE /api/auth/sessions ─────────────────────────────────────────────────
async function revokeAllSessions(req, res, next) {
  try {
    const { refreshToken: rt } = req.body;
    await prisma.session.deleteMany({
      where: { userId: req.user.id, NOT: { refreshToken: rt || '' } },
    });
    res.json({ success: true, message: 'All other sessions revoked' });
  } catch (err) { next(err); }
}

module.exports = {
  register, sendOTP, verifyOTP, resendOTP, signIn, refreshToken,
  signOut, forgotPassword, resetPassword, getMe, updateMe,
  changePassword, getSessions, revokeAllSessions,
};
