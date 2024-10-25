const IPFS = require('ipfs-http-client');

const ipfs = IPFS.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const uploadToIPFS = async (data) => {
  const { path } = await ipfs.add(data);
  return path;
};

const retrieveFromIPFS = async (hash) => {
  const data = [];
  for await (const chunk of ipfs.cat(hash)) {
    data.push(chunk);
  }
  return Buffer.concat(data).toString();
};

// Function to pin data to IPFS
const pinToIPFS = async (hash) => {
  const response = await ipfs.pin.add(hash);
  return response;
};

// Function to unpin data from IPFS
const unpinFromIPFS = async (hash) => {
  const response = await ipfs.pin.rm(hash);
  return response;
};

module.exports = {
  uploadToIPFS,
  retrieveFromIPFS,
  pinToIPFS,
  unpinFromIPFS,
};
