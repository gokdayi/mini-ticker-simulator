const userController = require('../controllers/user.controller');

module.exports = app => {
  // User authentication and authorization routes
  app.post('/user/register', userController.register);
  app.post('/user/login', userController.login);
  app.get('/user/profile', userController.getProfile);
  app.put('/user/profile', userController.updateProfile);
  app.delete('/user/profile', userController.deleteAccount);
};
