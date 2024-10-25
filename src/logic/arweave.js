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

module.exports = {
  uploadToArweave,
  retrieveFromArweave,
};
