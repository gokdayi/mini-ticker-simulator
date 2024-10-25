const controller = require('../controllers/instruments.controller');
const userController = require('../controllers/user.controller');

module.exports = app => {
  // Route to get the latest 10 ticker items for a given symbol
  app.get('/instruments/:symbol', controller.getinstruments);

  // Route to delete all ticker records from the database
  app.delete('/instruments/deleteall', controller.deleteall);

  // User authentication and authorization routes
  app.post('/user/register', userController.register);
  app.post('/user/login', userController.login);

  // Additional cryptocurrency support routes
  app.get('/cryptocurrencies', controller.getSupportedCryptocurrencies);
  app.post('/cryptocurrencies', controller.addSupportedCryptocurrency);
  app.delete('/cryptocurrencies/:symbol', controller.removeSupportedCryptocurrency);

  // Serve the index.html file
  app.get('/', async (req, res) => {
    res.sendFile('index.html');
  });
};
