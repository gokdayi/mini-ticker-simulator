const mongoose = require('mongoose');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  permissions: {
    type: [String],
    default: [],
  },
  preferences: {
    type: Object,
    default: {},
  },
  notificationSettings: {
    type: Object,
    default: {},
  },
  activityLogs: {
    type: [String],
    default: [],
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
  },
  apiRequests: {
    type: Number,
    default: 0,
  },
});

// Create the User model using the schema
const User = mongoose.model('User', userSchema);

// Export the User model for use in other parts of the application
module.exports = User;
