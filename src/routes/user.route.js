const userController = require('../controllers/user.controller');

module.exports = app => {
  // User authentication and authorization routes
  app.post('/user/register', userController.register);
  app.post('/user/login', userController.login);
  app.get('/user/profile', userController.getProfile);
  app.put('/user/profile', userController.updateProfile);
  app.delete('/user/profile', userController.deleteAccount);

  // User preferences and notification settings routes
  app.put('/user/preferences', userController.updatePreferences);
  app.get('/user/preferences', userController.getPreferences);
  app.put('/user/notification-settings', userController.updateNotificationSettings);
  app.get('/user/notification-settings', userController.getNotificationSettings);
};
