const Arweave = require('arweave');

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

const uploadToArweave = async (data) => {
  const transaction = await arweave.createTransaction({ data });
  await arweave.transactions.sign(transaction);
  await arweave.transactions.post(transaction);
  return transaction.id;
};

const retrieveFromArweave = async (id) => {
  const transaction = await arweave.transactions.get(id);
  return transaction.get('data', { decode: true, string: true });
};

// Function to get the status of a transaction
const getTransactionStatus = async (id) => {
  const status = await arweave.transactions.getStatus(id);
  return status;
};

// Function to get the price of uploading data to Arweave
const getPrice = async (data) => {
  const price = await arweave.transactions.getPrice(data.length);
  return price;
};

module.exports = {
  uploadToArweave,
  retrieveFromArweave,
  getTransactionStatus,
  getPrice,
};
