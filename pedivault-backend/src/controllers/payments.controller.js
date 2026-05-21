const Stripe = require('stripe');
const prisma = require('../config/database');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const PRICES = {
  monthly: process.env.STRIPE_PRICE_MONTHLY,
  annual:  process.env.STRIPE_PRICE_ANNUAL,
};

async function createSubscription(req, res, next) {
  try {
    const { plan, paymentMethodId } = req.body;
    const user = req.user;
    if (!PRICES[plan]) return res.status(400).json({ success: false, error: 'Invalid plan' });
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
      });
      customerId = customer.id;
      await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
    } else {
      await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
      await stripe.customers.update(customerId, { invoice_settings: { default_payment_method: paymentMethodId } });
    }
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: PRICES[plan] }],
      expand: ['latest_invoice.payment_intent'],
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeSubscriptionId: subscription.id, plan: 'PREMIUM', planExpiresAt: new Date(subscription.current_period_end * 1000) },
    });
    res.json({ success: true, subscription
