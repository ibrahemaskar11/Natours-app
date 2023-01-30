const User = require('../models/UserModel');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.'
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.'
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.'
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.'
  });
};
exports.updateMe = async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates Please use updatePassword',
        400
      )
    );
  }
  const filteredBody = filterObj(req.body, 'name', 'email');
  console.log(filteredBody);
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'Success',
    data: {
      user: updatedUser
    }
  });
};
exports.deleteMe = async (req, res, next) => {
  try {
    console.log(req.user);
    await User.findByIdAndUpdate(req.user.id, {
      active: false
    });
    res.status(204).json({
      status: 'Success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};
