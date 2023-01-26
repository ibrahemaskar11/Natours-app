const AppError = require('../utils/appError');

const sendErrorDev = (err, res) => {
  console.log('dev error');
  res.status(err.statusCode || 500).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

const sendErrorProduction = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error('ERROR', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong.'
    });
  }
};

const handleCastErrorDB = err => {
  const message = `INVALID ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  console.log(err);
  const message = `Duplicate fied value: "${err.keyValue.name}". Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.value(err.errors).map(el => el.message);
  const message = `Inavlid input data. ${errors.join('. ')}`;
  console.log(errors);
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  console.log(err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Internal Server Error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    next(error);
    if (err.name === 'validationError') error = handleValidationErrorDB(error);
    sendErrorProduction(error, res);
  }
};
