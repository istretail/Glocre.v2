const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  // Replace 'your_secret_key' with your actual secret key for signing the token
  const token = jwt.sign({ userId }, 'F66DB4EC116K9', { expiresIn: '1d' }); // Token expires in 1 day
  return token;
};

module.exports = { generateToken };
