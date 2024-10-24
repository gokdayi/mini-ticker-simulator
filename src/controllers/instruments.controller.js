const { Ticker } = require('../models');
const { getSupportedCryptocurrencies, addSupportedCryptocurrency, removeSupportedCryptocurrency } = require('../logic/cryptocurrency.repo');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.getinstruments = async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await Ticker.find({ symbol: symbol })
      .sort({ createdOn: -1 })
      .limit(10);

    return res.status(200).send({
      data,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
    });
  }
};

exports.deleteall = async (req, res) => {
  try {
    const foundOnes = await Ticker.find();
    if (!foundOnes) {
      return res.status(400).send({ message: 'Did not find anything!' });
    }

    const deleted = await Ticker.deleteMany();
    if (!deleted) {
      return res.status(500).send({ message: 'Unexpected error!' });
    }

    res.status(200).send({
      message: `Deleted successfully! Total count => ${deleted.deletedCount}`,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
    });
  }
};

// User authentication and authorization logic
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

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send({ error: 'Invalid username or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ error: 'Invalid username or password' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).send({ token });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Additional cryptocurrency support logic
exports.getSupportedCryptocurrencies = async (req, res) => {
  try {
    const supportedCryptocurrencies = await getSupportedCryptocurrencies();
    res.status(200).send({ supportedCryptocurrencies });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.addSupportedCryptocurrency = async (req, res) => {
  try {
    const { symbol } = req.body;
    await addSupportedCryptocurrency(symbol);
    res.status(201).send({ message: 'Cryptocurrency added successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.removeSupportedCryptocurrency = async (req, res) => {
  try {
    const { symbol } = req.params;
    await removeSupportedCryptocurrency(symbol);
    res.status(200).send({ message: 'Cryptocurrency removed successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
