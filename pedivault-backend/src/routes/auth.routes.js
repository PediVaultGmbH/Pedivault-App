// src/routes/auth.routes.js
const router = require('express').Router();
const ctrl   = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({ windowMs: 15*60*1000, max: 1000, message: { error: 'Too many auth attempts' } });
const otpLimiter  = rateLimit({ windowMs: 60*1000,    max: 100,  message: { error: 'Too many OTP requests' } });

router.post('/register',         authLimiter, ctrl.register);
router.post('/otp/send',         otpLimiter,  ctrl.sendOTP);
router.post('/otp/verify',       authLimiter, ctrl.verifyOTP);
router.post('/otp/resend',       otpLimiter,  ctrl.resendOTP);
router.post('/signin',           authLimiter, ctrl.signIn);
router.post('/refresh',          ctrl.refreshToken);
router.post('/signout',          ctrl.signOut);
router.post('/forgot-password',  authLimiter, ctrl.forgotPassword);
router.post('/reset-password',   authLimiter, ctrl.resetPassword);
router.get ('/me',               authenticate, ctrl.getMe);
router.put ('/me',               authenticate, ctrl.updateMe);
router.post('/change-password',  authenticate, ctrl.changePassword);
router.get ('/sessions',         authenticate, ctrl.getSessions);
router.delete('/sessions',       authenticate, ctrl.revokeAllSessions);

module.exports = router;
