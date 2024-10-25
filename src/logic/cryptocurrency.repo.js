const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// Promisify fs functions for better readability and maintainability
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const configFilePath = path.join(__dirname, '../config/supportedCryptocurrencies.json');

// Function to get the list of supported cryptocurrencies
const getSupportedCryptocurrencies = async () => {
  try {
    const configData = await readFileAsync(configFilePath, 'utf-8');
    const config = JSON.parse(configData);
    return config.supportedCryptocurrencies;
  } catch (error) {
    console.error('Error reading supported cryptocurrencies:', error);
    throw new Error('Failed to read supported cryptocurrencies');
  }
};

// Function to add a new supported cryptocurrency
const addSupportedCryptocurrency = async (symbol) => {
  try {
    const configData = await readFileAsync(configFilePath, 'utf-8');
    const config = JSON.parse(configData);
    if (!config.supportedCryptocurrencies.includes(symbol)) {
      config.supportedCryptocurrencies.push(symbol);
      await writeFileAsync(configFilePath, JSON.stringify(config, null, 2));
    }
  } catch (error) {
    console.error('Error adding supported cryptocurrency:', error);
    throw new Error('Failed to add supported cryptocurrency');
  }
};

// Function to remove a supported cryptocurrency
const removeSupportedCryptocurrency = async (symbol) => {
  try {
    const configData = await readFileAsync(configFilePath, 'utf-8');
    const config = JSON.parse(configData);
    const index = config.supportedCryptocurrencies.indexOf(symbol);
    if (index !== -1) {
      config.supportedCryptocurrencies.splice(index, 1);
      await writeFileAsync(configFilePath, JSON.stringify(config, null, 2));
    }
  } catch (error) {
    console.error('Error removing supported cryptocurrency:', error);
    throw new Error('Failed to remove supported cryptocurrency');
  }
};

module.exports = {
  getSupportedCryptocurrencies,
  addSupportedCryptocurrency,
  removeSupportedCryptocurrency,
};
