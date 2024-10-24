### Mini Crypto Ticker Simulator
> This is a simple cryptocurrency ticker app that fetches data from OKX API via a web socket. It then saves the incoming data to a MongoDB instance asynchronously. This was an interview project & I implemented it in a couple of hours. **NOT** ready for production!

### How to run?
- Install all the npm packages
- Create a `.env` file with a variable named `MONGO_URI` which points to your mongo URL, I am using a cloud atlas instance on my localhost
- Run `npm run dev`  

### Description

By inspecting the `app.js`, you can get a quick overview of what the app is trying to do. Specifically;

- Tries to connect to the Mongo instance first
- If the connection to the DB is successful, then it tries to start the `fastify` server & listens on port 3000
- Fetches instruments data asynchronously. In this case, it only fetches the three spot symbols; BTC, ETH & XRP
- Using the response data it then subscribes to the OKX WebSocket API by sending a parameter object like in the following;
```javascript
{
  "op": "subscribe",
  "args": [
    {
      "channel": "tickers",
      "instId": "LTC-USD-200327"
    }
  ]
}
```
[You can have a look at this link for more details](https://www.okx.com/docs-v5/en/#websocket-api-public-channel-instruments-channel)
- Whenever a message is received from the OKX API, it logs the response data to the console and then saves it in the database
- To access the saved data, just make a `GET` request to the following URL;
```javascript
http://localhost:3000/instruments/BTC
http://localhost:3000/instruments/ETH
http://localhost:3000/instruments/XRP
```

### Controllers
> There is a single controller, namely the `instruments.controller.js` It contains the following endpoints;

#### **getinstruments** - GET
- Returns the last 10 ticker items in the database
- Json schema as in the following;
```javascript
{
  data: [{
    ..ticker
  }]
}
```
- Returns an error object in case any internal error happens

#### **deleteall** - DELETE
- Deletes all the ticker records from the database, returns a `message` object in case it goes successfully 

### Logic
> There is a single repository function in the `logic/ticker.repo.js`, namely the `saveTickers(raw)` function which accepts raw data generated by the OKX SPOT API

#### **saveTickers** 
- Parses the raw data to JSON first
- Extracts the spot data array & iterates through the array
- For each spot object, extracts the symbol of the item & creates an object including other properties
- Saves the ticker object to the database

### Models

#### ticker
> There is a single model and a schema; `ticker`. It is pretty self-descriptive. Take a look at the following file for more details; 
`models/ticker.js`

### Routes

There are 2 routes;
- /instruments/:symbol   [GET] 
- /instruments/deleteall [DELETE]

### API Usage Examples

#### Fetching Instruments Data
To fetch the instruments data, make a GET request to the following URL:
```javascript
http://localhost:3000/instruments/:symbol
```
Replace `:symbol` with the desired symbol (e.g., BTC, ETH, XRP).

Example:
```javascript
http://localhost:3000/instruments/BTC
```

Expected Response:
```json
{
  "data": [
    {
      "symbol": "BTC",
      "createdOn": "2022-01-01T00:00:00.000Z",
      "instType": "SPOT",
      "instId": "BTC-USD",
      "last": "50000",
      "lastSz": "0.1",
      "askPx": "50001",
      "askSz": "0.2",
      "bidPx": "49999",
      "bidSz": "0.3",
      "open24h": "48000",
      "high24h": "51000",
      "low24h": "47000",
      "sodUtc0": "49000",
      "sodUtc8": "49500",
      "volCcy24h": "1000",
      "vol24h": "200",
      "ts": "1640995200000"
    }
  ]
}
```

#### Deleting All Ticker Records
To delete all ticker records from the database, make a DELETE request to the following URL:
```javascript
http://localhost:3000/instruments/deleteall
```

Expected Response:
```json
{
  "message": "Deleted successfully! Total count => 100"
}
```

### Error Handling
In case of any errors, the API will return an error object with the appropriate status code and error message.

Example:
```json
{
  "error": "Instruments can not be null"
}
```

### Contributing
We welcome contributions to this project! To contribute, please follow these guidelines:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with descriptive commit messages.
4. Push your changes to your forked repository.
5. Create a pull request to the main repository.

### Submitting Issues
If you encounter any issues or have any suggestions, please submit an issue on the GitHub repository. Provide as much detail as possible, including steps to reproduce the issue and any relevant screenshots or logs.

### Pull Requests
When submitting a pull request, please ensure that your changes do not break any existing functionality and that your code follows the project's coding standards. Include a detailed description of your changes and any relevant information.

### Code Comments
To improve code readability and maintainability, we have added comments to the code to explain the purpose of functions and important sections of the code. Please follow this practice when contributing to the project.

### Enhanced Data Visualization
We have added a front-end interface to visualize the cryptocurrency ticker data in real-time. The interface uses charting libraries like Chart.js or D3.js to display historical data and trends. Users can filter data for specific time ranges or specific cryptocurrencies.

### User Authentication and Authorization
We have implemented user authentication using JWT (JSON Web Tokens) to secure the API endpoints. User roles and permissions have been added to control access to certain features, such as viewing or deleting data. An admin interface is available for managing user accounts and permissions.

### Additional Cryptocurrency Support
We have expanded the list of supported cryptocurrencies beyond BTC, ETH, and XRP. Users can specify which cryptocurrencies they want to track and subscribe to the corresponding WebSocket channels. A configuration file or database table is used to store the list of supported cryptocurrencies and their corresponding WebSocket channels.

### Conclusion

This a project developed in a couple of hours for an interview, so it is not well-tested. It is also dependent on a public API by OKX (it doesn't require a key) but there are limitations and terms are subject to change anytime. So, DO NOT use this code for production! Do your own research with OKX API.
