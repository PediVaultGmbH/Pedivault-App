import api from './client';

export const createSubscription = ({ plan, paymentMethodId }) =>
  api.post('/payments/create-subscription', { plan, paymentMethodId });

export const getSubscription = () =>
  api.get('/payments/subscription');

export const cancelSubscription = () =>
  api.post('/payments/cancel-subscription');
