const User = require('./../models/userModel');
const AppError = require('./../utils/appError');

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: 'Success',
      data: {
        user: newUser
      }
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};
