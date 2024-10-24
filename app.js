const { default: axios } = require('axios');
const { default: mongoose } = require('mongoose');
const dotenv = require('dotenv');
const WebSocket = require('ws');
const { saveTickers } = require('./src/logic/ticker.repo');
const jwt = require('jsonwebtoken');
const fs = require('fs');

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

connectToDb();

module.exports = fastify;
