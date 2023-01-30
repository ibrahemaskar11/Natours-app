const Review = require('../models/ReviewModel');

exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find();
    res.status(200).json({
      status: 'Success',
      results: reviews.length,
      data: {
        reviews
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const newReview = await Review.create(req.body);
    res.status(201).json({
      status: 'Success',
      data: {
        newReview
      }
    });
  } catch (err) {
    next(err);
  }
};
