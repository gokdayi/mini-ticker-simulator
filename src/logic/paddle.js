const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const PADDLE_VENDOR_ID = process.env.PADDLE_VENDOR_ID;
const PADDLE_API_KEY = process.env.PADDLE_API_KEY;
const PADDLE_API_URL = 'https://vendors.paddle.com/api/2.0';

const createSubscription = async (planId, userEmail) => {
  try {
    const response = await axios.post(`${PADDLE_API_URL}/subscription/users/create`, {
      vendor_id: PADDLE_VENDOR_ID,
      vendor_auth_code: PADDLE_API_KEY,
      plan_id: planId,
      user_email: userEmail,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw new Error('Failed to create subscription');
  }
};

const cancelSubscription = async (subscriptionId) => {
  try {
    const response = await axios.post(`${PADDLE_API_URL}/subscription/users_cancel`, {
      vendor_id: PADDLE_VENDOR_ID,
      vendor_auth_code: PADDLE_API_KEY,
      subscription_id: subscriptionId,
    });

    return response.data;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new Error('Failed to cancel subscription');
  }
};

const updateSubscription = async (subscriptionId, planId) => {
  try {
    const response = await axios.post(`${PADDLE_API_URL}/subscription/users/update`, {
      vendor_id: PADDLE_VENDOR_ID,
      vendor_auth_code: PADDLE_API_KEY,
      subscription_id: subscriptionId,
      plan_id: planId,
    });

    return response.data;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw new Error('Failed to update subscription');
  }
};

module.exports = {
  createSubscription,
  cancelSubscription,
  updateSubscription,
};
