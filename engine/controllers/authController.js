const jwt = require('jsonwebtoken');
const User = require('../models/user');

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Este email já está cadastrado!' });
    }

    const user = new User({ email, password });
    await user.save();

    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos!' });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Email ou senha inválidos!' });
    }

    const token = jwt.sign({ userId: user._id }, 'segredo');

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
