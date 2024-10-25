const fs = require('fs');
const path = require('path');

// Define the log file path
const logFilePath = path.join(__dirname, '../../logs/user-activity.log');

// Function to log user activities
const logActivity = (userId, activity) => {
  const logEntry = `${new Date().toISOString()} - User: ${userId} - Activity: ${activity}\n`;
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error('Error logging activity:', err);
    }
  });
};

// Function to log user-related requests
const logRequest = (request) => {
  const logEntry = `${new Date().toISOString()} - Request: ${request.method} ${request.url} - User: ${request.user ? request.user.userId : 'Unknown'}\n`;
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error('Error logging request:', err);
    }
  });
};

// Function to log user-related responses
const logResponse = (request, response) => {
  const logEntry = `${new Date().toISOString()} - Response: ${response.statusCode} - User: ${request.user ? request.user.userId : 'Unknown'}\n`;
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error('Error logging response:', err);
    }
  });
};

module.exports = {
  logActivity,
  logRequest,
  logResponse,
};
