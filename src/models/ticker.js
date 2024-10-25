const mongoose = require('mongoose');

// Define the schema for the Ticker model
const schema = new mongoose.Schema({
  symbol: { type: String, required: true }, // Symbol of the cryptocurrency (e.g., BTC, ETH)
  createdOn: { type: Date, default: Date.now }, // Timestamp of when the ticker was created
  instType: { type: String, required: true }, // Type of instrument (e.g., SPOT)
  instId: { type: String, required: true }, // Instrument ID (e.g., BTC-USD)
  last: { type: String, required: true }, // Last traded price
  lastSz: { type: String, required: true }, // Last traded size
  askPx: { type: String, required: true }, // Ask price
  askSz: { type: String, required: true }, // Ask size
  bidPx: { type: String, required: true }, // Bid price
  bidSz: { type: String, required: true }, // Bid size
  open24h: { type: String, required: true }, // Opening price in the last 24 hours
  high24h: { type: String, required: true }, // Highest price in the last 24 hours
  low24h: { type: String, required: true }, // Lowest price in the last 24 hours
  sodUtc0: { type: String, required: true }, // Start of day price in UTC 0
  sodUtc8: { type: String, required: true }, // Start of day price in UTC 8
  volCcy24h: { type: String, required: true }, // Volume in currency in the last 24 hours
  vol24h: { type: String, required: true }, // Volume in the last 24 hours
  ts: { type: String, required: true }, // Timestamp of the ticker data
});

// Create the Ticker model using the schema
const Ticker = mongoose.model('Ticker', schema);

// Export the Ticker model for use in other parts of the application
module.exports = {
  Ticker,
};
