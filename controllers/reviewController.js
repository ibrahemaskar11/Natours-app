const Review = require('../models/ReviewModel.js');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.author) req.body.author = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = async (req, res, next) => {
  try {
    const doc = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    await Review.calcAverageRatings(doc.tour);
    res.status(200).json({
      status: 'Success',
      data: {
        data: doc
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteReivew = async (req, res, next) => {
  try {
    const doc = await Review.findById(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    const { tour } = doc;
    await Review.findByIdAndDelete(doc.id);
    await Review.calcAverageRatings(tour);
    res.status(204).json({
      status: 'Success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};
exports.getReview = factory.getOne(Review);
