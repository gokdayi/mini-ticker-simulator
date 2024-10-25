const { default: axios } = require('axios');
const { default: mongoose } = require('mongoose');
const dotenv = require('dotenv');
const WebSocket = require('ws');
const { saveTickers } = require('./src/logic/ticker.repo');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const Web3 = require('web3');
const IPFS = require('ipfs-http-client');
const Arweave = require('arweave');
const crypto = require('crypto'); // P0208
const logger = require('./src/logic/logger'); // P2200

dotenv.config();

const fastify = require('fastify')({ logger: true });

const wsUrl = 'wss://ws.okex.com:8443/ws/v5/public';

require('./src/routes/instruments.route')(fastify);
require('./src/routes/user.route')(fastify);

// Middleware to authenticate JWT
fastify.addHook('onRequest', async (request, reply) => {
  if (request.url.startsWith('/user')) {
    return;
  }

  const authHeader = request.headers['authorization'];
  if (!authHeader) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.user = decoded;
  } catch (error) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }
});

// Middleware to log all user-related requests and responses
fastify.addHook('onRequest', async (request, reply) => {
  if (request.url.startsWith('/user')) {
    logger.logRequest(request);
  }
});

fastify.addHook('onResponse', async (request, reply) => {
  if (request.url.startsWith('/user')) {
    logger.logResponse(request, reply);
  }
});

// Serve static files from the 'public' directory
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
});

// WebSocket endpoint for real-time updates
fastify.register(require('fastify-websocket'), {
  handle: (conn) => {
    conn.pipe(conn); // echo the messages back
  },
  options: {
    maxPayload: 1048576,
  },
});

// Function to get instruments data from OKX API
const getInstruments = async () => {
  const url = 'https://www.okx.com/api/v5/public/instruments?instType=SPOT';
  const response = await axios.get(url).catch((error) => {
    console.error(error);
    return { error };
  });

  const { status, statusText, error, data } = response;

  if (status !== 200) {
    console.error(`${error || statusText}`);
    return { error };
  }

  const { data: instrumentsData } = data;

  const validTickers = await getSupportedCryptocurrencies();
  const instruments = instrumentsData.filter(
    (p) => validTickers.indexOf(p.baseCcy) >= 0
  );

  return {
    instruments: instruments,
  };
};

// Function to get supported cryptocurrencies from configuration file
const getSupportedCryptocurrencies = async () => {
  const configFilePath = './src/config/supportedCryptocurrencies.json';
  const configData = await fs.promises.readFile(configFilePath, 'utf-8');
  const config = JSON.parse(configData);
  return config.supportedCryptocurrencies;
};

// Function to connect to OKX WebSocket feed
const connectToWebsocketFeed = (instIdList) => {
  if (!instIdList || !Array.isArray(instIdList) || !instIdList.length) {
    throw new Error('InstId list cannot be empty');
  }

  const ws = new WebSocket(wsUrl);

  const options = {
    op: 'subscribe',
    args: [],
  };

  for (const instId of instIdList) {
    options.args.push({
      channel: 'tickers',
      instId: instId,
    });
  }

  ws.on('open', function open() {
    ws.send(JSON.stringify(options));
  });

  ws.on('message', async function message(data) {
    console.log(data);
    saveTickers(data);
    // P897d
    const parsedData = JSON.parse(data);
    const significantChange = parsedData.some(item => Math.abs(item.change24h) > 5);
    if (significantChange) {
      fastify.websocketServer.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'SIGNIFICANT_CHANGE', data: parsedData }));
        }
      });
    }
  });
};

// Function to start the Fastify server
const startServer = async () => {
  try {
    await fastify.listen(3000);

    const instruments = await getInstruments();

    if (!instruments || instruments.error) {
      throw new Error('Instruments can not be null');
    }

    const instIdList = instruments.instruments.reduce((prev, cur) => {
      prev.push(cur.instId);
      return prev;
    }, []);

    connectToWebsocketFeed(instIdList);
  } catch (error) {
    fastify.logger.error(error);
    console.error(error);
    process.exit(1);
  }
};

// Function to connect to MongoDB
const connectToDb = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('Db Connected. Will start server now.');
      startServer();
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};

// Function to handle wallet authentication and transactions
const handleWalletAuthentication = async (request, reply) => {
  const { walletAddress, signature } = request.body;

  // Verify the signature using the wallet address
  const web3 = new Web3();
  const message = 'Authenticate with your wallet';
  const recoveredAddress = web3.eth.accounts.recover(message, signature);

  if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
    return reply.status(401).send({ error: 'Invalid signature' });
  }

  // Generate a JWT token for the authenticated wallet
  const token = jwt.sign({ walletAddress }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return reply.status(200).send({ token });
};

// Function to interact with the smart contract
const interactWithSmartContract = async (request, reply) => {
  const { contractAddress, abi, method, params } = request.body;

  const web3 = new Web3(process.env.BLOCKCHAIN_PROVIDER_URL);
  const contract = new web3.eth.Contract(abi, contractAddress);

  try {
    const result = await contract.methods[method](...params).call();
    return reply.status(200).send({ result });
  } catch (error) {
    console.error('Error interacting with smart contract:', error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
};

// Function to upload data to IPFS
const uploadToIPFS = async (data) => {
  const ipfs = IPFS.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
  const { path } = await ipfs.add(data);
  return path;
};

// Function to retrieve data from IPFS
const retrieveFromIPFS = async (hash) => {
  const ipfs = IPFS.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
  const data = [];
  for await (const chunk of ipfs.cat(hash)) {
    data.push(chunk);
  }
  return Buffer.concat(data).toString();
};

// Function to upload data to Arweave
const uploadToArweave = async (data) => {
  const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
  });

  const transaction = await arweave.createTransaction({ data });
  await arweave.transactions.sign(transaction);
  await arweave.transactions.post(transaction);

  return transaction.id;
};

// Function to retrieve data from Arweave
const retrieveFromArweave = async (id) => {
  const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
  });

  const transaction = await arweave.transactions.get(id);
  return transaction.get('data', { decode: true, string: true });
};

// P0208
const encryptData = (data) => {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: iv.toString('hex'), encryptedData: encrypted };
};

const decryptData = (encryptedData, iv) => {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32);
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

connectToDb();

module.exports = fastify;
