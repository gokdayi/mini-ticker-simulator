const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  limits: {
    trackedCurrencies: { type: Number, required: true },
    apiRequests: { type: Number, required: true },
  },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
