const fs = require('fs');
const path = require('path');

const configFilePath = path.join(__dirname, '../config/supportedCryptocurrencies.json');

const getSupportedCryptocurrencies = async () => {
  const configData = await fs.promises.readFile(configFilePath, 'utf-8');
  const config = JSON.parse(configData);
  return config.supportedCryptocurrencies;
};

const addSupportedCryptocurrency = async (symbol) => {
  const configData = await fs.promises.readFile(configFilePath, 'utf-8');
  const config = JSON.parse(configData);
  if (!config.supportedCryptocurrencies.includes(symbol)) {
    config.supportedCryptocurrencies.push(symbol);
    await fs.promises.writeFile(configFilePath, JSON.stringify(config, null, 2));
  }
};

const removeSupportedCryptocurrency = async (symbol) => {
  const configData = await fs.promises.readFile(configFilePath, 'utf-8');
  const config = JSON.parse(configData);
  const index = config.supportedCryptocurrencies.indexOf(symbol);
  if (index !== -1) {
    config.supportedCryptocurrencies.splice(index, 1);
    await fs.promises.writeFile(configFilePath, JSON.stringify(config, null, 2));
  }
};

module.exports = {
  getSupportedCryptocurrencies,
  addSupportedCryptocurrency,
  removeSupportedCryptocurrency,
};
