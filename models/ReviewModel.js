const mongoose = require('mongoose');
const Tour = require('./TourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      require: [true, 'Review can not be empty']
    },
    rating: {
      type: Number,
      require: true,
      min: [1, 'Rating can not be less than 1'],
      max: [5, 'Rating can not be more than 5']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index(
  {
    tour: 1,
    author: 1
  },
  { unique: true }
);

reviewSchema.pre(/^find/, async function(next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // }).populate({
  //   path: 'author',
  //   select: 'name photo'
  // });
  this.populate({
    path: 'author',
    select: 'name photo'
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.pre('save', function(next) {
  this.constructor.calcAverageRatings(this.tour);
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
