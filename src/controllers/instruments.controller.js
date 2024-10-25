const { Ticker } = require('../models');
const { getSupportedCryptocurrencies, addSupportedCryptocurrency, removeSupportedCryptocurrency } = require('../logic/cryptocurrency.repo');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Function to get the latest 10 ticker items for a given symbol
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
    console.error('Error fetching instruments:', error);
    return res.status(500).send({
      error: 'Internal server error',
    });
  }
};

// Function to delete all ticker records from the database
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
    console.error('Error deleting all tickers:', error);
    return res.status(500).send({
      error: 'Internal server error',
    });
  }
};

// User authentication and authorization logic

// Function to register a new user
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

// Function to log in a user
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
    console.error('Error logging in user:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

// Additional cryptocurrency support logic

// Function to get the list of supported cryptocurrencies
exports.getSupportedCryptocurrencies = async (req, res) => {
  try {
    const supportedCryptocurrencies = await getSupportedCryptocurrencies();
    res.status(200).send({ supportedCryptocurrencies });
  } catch (error) {
    console.error('Error fetching supported cryptocurrencies:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

// Function to add a new supported cryptocurrency
exports.addSupportedCryptocurrency = async (req, res) => {
  try {
    const { symbol } = req.body;
    await addSupportedCryptocurrency(symbol);
    res.status(201).send({ message: 'Cryptocurrency added successfully' });
  } catch (error) {
    console.error('Error adding supported cryptocurrency:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

// Function to remove a supported cryptocurrency
exports.removeSupportedCryptocurrency = async (req, res) => {
  try {
    const { symbol } = req.params;
    await removeSupportedCryptocurrency(symbol);
    res.status(200).send({ message: 'Cryptocurrency removed successfully' });
  } catch (error) {
    console.error('Error removing supported cryptocurrency:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
};
