const mongoose = require('mongoose');

const cryptocurrencySchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  websocketChannel: { type: String, required: true },
});

const Cryptocurrency = mongoose.model('Cryptocurrency', cryptocurrencySchema);

module.exports = Cryptocurrency;
