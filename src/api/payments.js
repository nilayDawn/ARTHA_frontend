import API from './client';
import { ENDPOINTS } from './endpoints';

export const createCheckoutSession = async ({ planId = 'pro_monthly', successUrl, cancelUrl }) => {
  const payload = {
    plan_id: planId,
    success_url: successUrl || `${window.location.origin}/dashboard?payment=success`,
    cancel_url: cancelUrl || `${window.location.origin}/dashboard?payment=cancelled`,
  };
  const res = await API.post(ENDPOINTS.PAYMENTS.CHECKOUT, payload);
  return res.data;
};

export const getUserSubscription = async () => {
  const res = await API.get(ENDPOINTS.PAYMENTS.SUBSCRIPTION);
  return res.data;
};
