const Stripe = require('stripe');
const prisma = require('../config/database');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const PRICES = { monthly: process.env.STRIPE_PRICE_MONTHLY, annual: process.env.STRIPE_PRICE_ANNUAL };

async function createSubscription(req, res, next) {
  try {
    const { plan, paymentMethodId } = req.body;
    const user = req.user;
    if (!PRICES[plan]) return res.status(400).json({ success: false, error: 'Invalid plan' });
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email, name: user.firstName + ' ' + user.lastName, payment_method: paymentMethodId, invoice_settings: { default_payment_method: paymentMethodId } });
      customerId = customer.id;
      await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
    } else {
      await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
      await stripe.customers.update(customerId, { invoice_settings: { default_payment_method: paymentMethodId } });
    }
    const subscription = await stripe.subscriptions.create({ customer: customerId, items: [{ price: PRICES[plan] }], expand: ['latest_invoice.payment_intent'] });
    await prisma.user.update({ where: { id: user.id }, data: { stripeSubscriptionId: subscription.id, plan: 'PREMIUM', planExpiresAt: new Date(subscription.current_period_end * 1000) } });
    const clientSecret = subscription.latest_invoice && subscription.latest_invoice.payment_intent ? subscription.latest_invoice.payment_intent.client_secret : null;
    res.json({ success: true, subscriptionId: subscription.id, status: subscription.status, clientSecret: clientSecret });
  } catch (err) { next(err); }
}

async function getSubscription(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user.stripeSubscriptionId) return res.json({ success: true, data: { plan: 'FREE', status: 'none' } });
    const sub = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
    res.json({ success: true, data: { plan: user.plan || 'FREE', status: sub.status, currentPeriodEnd: new Date(sub.current_period_end * 1000), cancelAtPeriodEnd: sub.cancel_at_period_end } });
  } catch (err) { next(err); }
}

async function cancelSubscription(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user.stripeSubscriptionId) return res.status(400).json({ success: false, error: 'No active subscription' });
    await stripe.subscriptions.update(user.stripeSubscriptionId, { cancel_at_period_end: true });
    res.json({ success: true, message: 'Subscription will cancel at end of billing period' });
  } catch (err) { next(err); }
}

async function webhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send('Webhook Error: ' + err.message);
  }
  if (event.type === 'customer.subscription.deleted') {
    await prisma.user.updateMany({ where: { stripeSubscriptionId: event.data.object.id }, data: { plan: 'FREE', stripeSubscriptionId: null, planExpiresAt: null } });
  }
  if (event.type === 'invoice.payment_succeeded') {
    await prisma.user.updateMany({ where: { stripeCustomerId: event.data.object.customer }, data: { plan: 'PREMIUM', planExpiresAt: new Date(event.data.object.period_end * 1000) } });
  }
  res.json({ received: true });
}

module.exports = { createSubscription, getSubscription, cancelSubscription, webhook };
