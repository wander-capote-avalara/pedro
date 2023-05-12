const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

userSchema.pre('save', async function(next) {
  try {
    const user = this;

    if (!user.isModified('password')) {
      return next();
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword, next) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    next(error);
  }
}

module.exports = mongoose.model('User', userSchema);