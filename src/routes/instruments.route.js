const controller = require('../controllers/instruments.controller');
const userController = require('../controllers/user.controller');

module.exports = app => {
  app.get('/instruments/:symbol', controller.getinstruments);
  app.delete('/instruments/deleteall', controller.deleteall);

  // User authentication and authorization routes
  app.post('/user/register', userController.register);
  app.post('/user/login', userController.login);

  // Additional cryptocurrency support routes
  app.get('/cryptocurrencies', controller.getSupportedCryptocurrencies);
  app.post('/cryptocurrencies', controller.addSupportedCryptocurrency);
  app.delete('/cryptocurrencies/:symbol', controller.removeSupportedCryptocurrency);
	
	app.get('/', async (req, res) => {
		res.sendFile('index.html');
	});
}
