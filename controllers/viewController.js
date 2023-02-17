const Tour = require('./../models/tourModel');
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');
const Booking = require('./../models/bookingModel');

exports.getOverview = async (req, res, next) => {
  try {
    const tours = await Tour.find();
    res.status(200).render('overview', {
      title: 'Exciting tours for adventurous people',
      tours
    });
  } catch (err) {
    next(err);
  }
};

exports.getTour = async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating author'
  });
  if (!tour) return next(new AppError('There is no tour with that name', 404));
  try {
    res.status(200).render('tour', {
      title: `${tour.name} tour`.toUpperCase(),
      tour
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.signup = async (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Signup to Natours'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.updateUserData = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        email: req.body.email
      },
      {
        new: true,
        runValidators: true
      }
    );
    res.status(200).render('account', {
      title: 'Your account',
      user: updatedUser
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyTours = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id });
    const tourIds = bookings.map(el => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIds } });

    res.status(200).render('overview', {
      title: 'My Tours',
      tours
    });
  } catch (err) {
    next(err);
  }
};
