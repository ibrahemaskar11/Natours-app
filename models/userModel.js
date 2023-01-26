const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell use your name!'],
    trim: true,
    maxLength: [40, 'A user name Must Have Less or Equal to 40 Characters']
  },
  email: {
    type: String,
    required: [true, 'Please provie your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: [8, 'Password can not be less than 8 characters']
  },
  photo: {
    type: String
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    minLength: [8, 'Password can not be less than 8 characters'],
    validate: {
      validator: function(val) {
        return val === this.password;
      },
      message: 'Passwords do not match'
    }
  }
});
userSchema.pre('save', async function(req, res, next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  this.passwordConfirm = undefined;
  next();
});
const User = mongoose.model('User', userSchema);
module.exports = User;
