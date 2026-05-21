const Stripe = require('stripe');
const prisma = require('../config/database');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const PRICES = {
  monthly: process.env.STRIPE_PRICE_MONTHLY,
  annual:  process.env.STRIPE_PRICE_ANNUAL,
};

// ── POST /api/payments/create-subscription ────────────────────────────────────
async function createSubscription(req, res, next) {
  try {
    const { plan, paymentMethodId } = req.body;
    const user = req.user;

    if (!PRICES[plan])
      return res.status(400).json({ success: false, error: 'Invalid plan' });

    // Get or create Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name:  `${user.firstName} ${user.lastName}`,
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
      });
      customerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data:  { stripeCustomerId: customerId },
      });
    } else {
      await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
      await stripe.customers.update(customerId, {
        invoice_settings: { default_payment_method: paymentMethodId },
      });
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items:    [{ price: PRICES[plan] }],
      expand:   ['latest_invoice.payment_intent'],
    });

    // Save to DB
    await prisma.user.update({
      where: { id: user.id },
      data: {
        stripeSubscriptionId: subscription.id,
        plan: 'PREMIUM',
        planExpiresAt: new Date(subscription.current_period_end * 1000),
      },
    });

    res.json({
      success: true,
      subscriptionId: subscription.id,
      status: subscription.status,
      clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
    });
  } catch (err) { next(err); }
}

// ── GET /api/payments/subscription ───────────────────────────────────────────
async function getSubscription(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user.stripeSubscriptionId)
      return res.json({ success: true, data: { plan: 'FREE', status: 'none' } });

    const sub = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
    res.json({
      success: true,
      data: {
        plan:      user.plan || 'FREE',
        status:    sub.status,
        currentPeriodEnd: new Date(sub.current_period_end * 1000),
        cancelAtPeriodEnd: sub.cancel_at_period_end,
      },
    });
  } catch (err) { next(err); }
}

// ── POST /api/payments/cancel-subscription ────────────────────────────────────
async function cancelSubscription(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user.stripeSubscriptionId)
      return res.status(400).json({ success: false, error: 'No active subscription' });

    await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    res.json({ success: true, message: 'Subscription will cancel at end of billing period' });
  } catch (err) { next(err); }
}

// ── POST /api/payments/webhook ────────────────────────────────────────────────
async function webhook(req, res) {
  const sig     = req.headers['stripe-signature'];
  const secret  = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, secret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object;
    await prisma.user.updateMany({
      where: { stripeSubscriptionId: sub.id },
      data:  { plan: 'FREE', stripeSubscriptionId: null, planExpiresAt: null },
    });
  }

  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object;
    await prisma.user.updateMany({
      where: { stripeCustomerId: invoice.customer },
      data:  { plan: 'PREMIUM', planExpiresAt: new Date(invoice.period_end * 1000) },
    });
  }

  res.json({ received: true });
}

module.exports = { createSubscription, getSubscription, cancelSubscription, webhook };
