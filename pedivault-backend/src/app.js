const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const rateLimit    = require('express-rate-limit');
const path         = require('path');
const errorHandler = require('./middleware/errorHandler');

// ── Routes ────────────────────────────────────────────────────────────────────
const authRoutes         = require('./routes/auth.routes');
const childrenRoutes     = require('./routes/children.routes');
const vaccinesRoutes     = require('./routes/vaccines.routes');
const growthRoutes       = require('./routes/growth.routes');
const recordsRoutes      = require('./routes/records.routes');
const appointmentsRoutes = require('./routes/appointments.routes');
const medicationsRoutes  = require('./routes/medications.routes');
const aiRoutes           = require('./routes/ai.routes');
const paymentsRoutes     = require('./routes/payments.routes');
const blockchainRoutes   = require('./services/blockchain.routes');

const app = express();

app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    /\.netlify\.app$/,
  ],
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

// ── Raw body for Stripe webhook ───────────────────────────────────────────────
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payments/webhook') {
    express.raw({ type: 'application/json' })(req, res, next);
  } else {
    express.json({ limit: '10mb' })(req, res, next);
  }
});

app.use(express.urlencoded({ extended: true, limit: '10mb' }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// ── Global rate limiter ───────────────────────────────────────────────────────
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please try again in 15 minutes.' },
}));

// ── Static uploads ────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, service: 'PediVault API', version: '1.0.0', timestamp: new Date().toISOString() });
});

// ── Auth ──────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ── Children (CRUD) ───────────────────────────────────────────────────────────
app.use('/api/children', childrenRoutes);

// ── Per-child sub-resources (nested under /:childId) ─────────────────────────
app.use('/api/children/:childId/vaccines',     vaccinesRoutes);
app.use('/api/children/:childId/growth',       growthRoutes);
app.use('/api/children/:childId/records',      recordsRoutes);
app.use('/api/children/:childId/appointments', appointmentsRoutes);
app.use('/api/children/:childId/medications',  medicationsRoutes);

// ── AI ────────────────────────────────────────────────────────────────────────
app.use('/api/ai', aiRoutes);

// ── Payments ──────────────────────────────────────────────────────────────────
app.use('/api/payments', paymentsRoutes);

// ── Notifications ─────────────────────────────────────────────────────────────
const notificationsRoutes = require('./routes/notifications.routes');
app.use('/api/notifications', notificationsRoutes);

// ── Blockchain ────────────────────────────────────────────────────────────────
app.use('/api/blockchain', blockchainRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found` });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
