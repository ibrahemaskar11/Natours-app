const { default: mongoose } = require('mongoose');

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

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
