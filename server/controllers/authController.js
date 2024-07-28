const bcrypt = require('bcryptjs');
const { User, Role } = require('../models');
const { generateToken } = require('../utils/jwt');

exports.register = async (req, res) => {
  try {
    const { username, email, password, RoleId } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, RoleId });
    res.json({ message: 'User registered successfully' },user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid password' });
    }
    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
