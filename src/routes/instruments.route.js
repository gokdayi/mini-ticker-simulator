const controller = require('../controllers/instruments.controller')

module.exports = app => {
	app.get('/instruments/:symbol', controller.getinstruments)
	app.delete('/instruments/deleteall', controller.deleteall)
	app.get('/', async (req, res) => {
		res.sendFile('index.html');
	});
}
