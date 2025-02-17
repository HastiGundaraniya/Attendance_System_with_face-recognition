const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true, 
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  authLevel: {
    type: String,
    required: true,
  },
});

// Signup Static Method
userSchema.statics.signup = async function (name, email, password, authLevel) {
  // Validation
  if (!name || !email || !password || !authLevel) {
    throw new Error('All fields must be filled');
  }
  if (!validator.isEmail(email)) {
    throw new Error('Email not valid');
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error('Password not strong enough');
  }

  // Check if user already exists
  const exists = await this.findOne({ email });
  if (exists) {
    throw new Error('Email already in use');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // Create user
  const user = await this.create({ name, email, password: hash, authLevel });

  return user;
};

module.exports = mongoose.model('User', userSchema);
