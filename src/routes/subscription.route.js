const express = require('express');
const router = express.Router();
const Subscription = require('../models/subscription');
const User = require('../models/user');
const { sendEmailNotification } = require('../logic/emailNotifications');

// Route to get all subscription plans
router.get('/plans', async (req, res) => {
  try {
    const plans = await Subscription.find();
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to upgrade subscription plan
router.post('/upgrade', async (req, res) => {
  try {
    const { userId, planId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const plan = await Subscription.findById(planId);
    if (!plan) {
      return res.status(404).json({ error: 'Subscription plan not found' });
    }

    user.subscription = planId;
    user.apiRequests = 0; // Reset API requests count
    await user.save();

    sendEmailNotification(user.email, 'Subscription Upgraded', `Your subscription has been upgraded to the ${plan.name} plan.`);

    res.status(200).json({ message: 'Subscription upgraded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to downgrade subscription plan
router.post('/downgrade', async (req, res) => {
  try {
    const { userId, planId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const plan = await Subscription.findById(planId);
    if (!plan) {
      return res.status(404).json({ error: 'Subscription plan not found' });
    }

    user.subscription = planId;
    user.apiRequests = 0; // Reset API requests count
    await user.save();

    sendEmailNotification(user.email, 'Subscription Downgraded', `Your subscription has been downgraded to the ${plan.name} plan.`);

    res.status(200).json({ message: 'Subscription downgraded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
