const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  symbol: String,
  createdOn: String,
  instType: String,
  instId: String,
  last: String,
  lastSz: String,
  askPx: String,
  askSz: String,
  bidPx: String,
  bidSz: String,
  open24h: String,
  high24h: String,
  low24h: String,
  sodUtc0: String,
  sodUtc8: String,
  volCcy24h: String,
  vol24h: String,
  ts: String,
})

const Ticker = mongoose.model('Ticker', schema)

module.exports = {
  Ticker
}