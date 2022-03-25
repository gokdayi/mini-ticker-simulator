# General Algo
- Get instruments data from the REST API
- Using the instruments data, Get the IDs of ETH, BTC, & XRP 
  - Using those IDs, make a request to get the tickers via a WebSocket
  - After getting the tickers data, write them all to the console
  - And write them to the DB as well
- Additionally, when the route of '/instruments/ETH' is requested, return only the last 10 elements  

# Specific 
- Create a MongoDB instance
- Use an .env file for mongo credentials
- Define models using Mongoose

- Create a function to do the starting work
  - Connect to MongoDB
  - Start listening to the port
  - Call the updateInstruments function (OPT)
  - Write to console that the API is ready

- Define routes in a folder
  - Instruments route
    - Define the updateInstruments endpoint to get all the tickers data & write to the db:
      - Get the instruments data 
      - Filter ETH, BTC & XRP
      - Extract ids
      - Get all the ids of ETH & BTC & XRP
      - Create the websocket connection to get the data

         


- Create a fastify API 

# Optional
- Log all the data using a basic schema
- Use E2E testing
- Define unit tests
- Encrypt incoming data with E2E encryption
- Use Swagger to document all the endpoints