const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

// User registration
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { username, password, token } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send({ error: 'Invalid username or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ error: 'Invalid username or password' });
    }
    const isTokenValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token
    });
    if (!isTokenValid) {
      return res.status(401).send({ error: 'Invalid 2FA token' });
    }
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).send({ token: jwtToken });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Enable 2FA
exports.enable2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    const secret = speakeasy.generateSecret();
    user.twoFactorSecret = secret.base32;
    await user.save();
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
    res.status(200).send({ qrCodeUrl });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Verify 2FA
exports.verify2FA = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    const isTokenValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token
    });
    if (!isTokenValid) {
      return res.status(401).send({ error: 'Invalid 2FA token' });
    }
    res.status(200).send({ message: '2FA verified successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.status(200).send({ user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    if (username) {
      user.username = username;
    }
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();
    res.status(200).send({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.status(200).send({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Update user preferences
exports.updatePreferences = async (req, res) => {
  try {
    const { preferences } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    user.preferences = preferences;
    await user.save();
    res.status(200).send({ message: 'Preferences updated successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get user preferences
exports.getPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.status(200).send({ preferences: user.preferences });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Update user notification settings
exports.updateNotificationSettings = async (req, res) => {
  try {
    const { notificationSettings } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    user.notificationSettings = notificationSettings;
    await user.save();
    res.status(200).send({ message: 'Notification settings updated successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get user notification settings
exports.getNotificationSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.status(200).send({ notificationSettings: user.notificationSettings });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
