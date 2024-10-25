const mongoose = require('mongoose');

// Define the schema for the Cryptocurrency model
const cryptocurrencySchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true }, // Symbol of the cryptocurrency (e.g., BTC, ETH)
  name: { type: String, required: true }, // Name of the cryptocurrency (e.g., Bitcoin, Ethereum)
  websocketChannel: { type: String, required: true }, // WebSocket channel for real-time updates
});

// Create the Cryptocurrency model using the schema
const Cryptocurrency = mongoose.model('Cryptocurrency', cryptocurrencySchema);

// Export the Cryptocurrency model for use in other parts of the application
module.exports = Cryptocurrency;
