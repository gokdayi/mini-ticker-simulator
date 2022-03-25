const { default: axios } = require('axios')
const { default: mongoose } = require('mongoose')
const dotenv = require('dotenv')

const WebSocket = require('ws')
const { saveTickers } = require('./src/logic/ticker.repo')

dotenv.config()

const fastify = require('fastify')({ logger: true })

const wsUrl = 'wss://ws.okex.com:8443/ws/v5/public'

require('./src/routes/instruments.route')(fastify)

const getInstruments = async () => {
  const url = 'https://www.okx.com/api/v5/public/instruments?instType=SPOT'
  const response = await axios.get(url).catch(error => {
    console.error(error)
    return { error }
    /** @todo LOG */
  })

  const { status, statusText, error, data } = response

  if (status !== 200) {
    console.error(`${error || statusText}`)
    return { error }
  }

  const { data: instrumentsData } = data

  const validTickers = ['BTC', 'ETH', 'XRP']
  const instruments = instrumentsData.filter(p => validTickers.indexOf(p.baseCcy) >= 0)

  // console.log(instruments)

  return {
    instruments: instruments
  }
}

const connectToWebsocketFeed = (instIdList) => {
  if (!instIdList || !Array.isArray(instIdList) || !instIdList.length) {
    throw new Error('InstId list cannot be empty')
  }

  const ws = new WebSocket(wsUrl)

  const options = {
    op: "subscribe",
    args: []
  }

  for (const instId of instIdList) {
    options.args.push({
      channel: "tickers",
      instId: instId
    })
  }

  ws.on('open', function open() {
    ws.send(JSON.stringify(options))
  })

  ws.on('message', async function message(data) {
    console.log(data)
    saveTickers(data)
  })
}

const startServer = async () => {
  try {
    await fastify.listen(3000)

    const instruments = await getInstruments()

    if (!instruments || instruments.error) {
      throw new Error('Instruments can not be null')
    }

    const instIdList = instruments.instruments.reduce((prev, cur) => {
      prev.push(cur.instId)
      return prev
    }, [])


    connectToWebsocketFeed(instIdList)

  } catch (error) {
    fastify.logger.error(error)
    console.error(error)
    process.exit(1)
  }
}

const connectToDb = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Db Connected. Will start server now.")
      startServer()
    })
    .catch((err) => {
      console.log(err);
      process.exit(1)
    });
}

connectToDb()

module.exports = fastify