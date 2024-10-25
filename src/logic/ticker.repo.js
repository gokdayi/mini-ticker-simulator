const { Ticker } = require('../models');

/**
 * Save tickers to the database
 * @param {string} rawData - Raw data from the WebSocket
 */
const saveTickers = async (rawData) => {
  try {
    const parsed = JSON.parse(rawData);

    if (!parsed.data) {
      return;
    }

    const { data: instData } = parsed;

    for (let row of instData) {
      const symbol = row.instId.split('-')[0];
      const obj = { symbol, createdOn: new Date(), ...row };

      let ticker = new Ticker(obj);

      let result = await ticker.save();
      if (result !== ticker) {
        console.error(result);
      }
    }
  } catch (error) {
    console.error('Error saving tickers:', error);
  }
};

module.exports = {
  saveTickers,
};
