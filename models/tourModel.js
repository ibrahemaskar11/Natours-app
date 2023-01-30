const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');
const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A Tour Name Must Have Less or Equal to 40 Characters'],
      minLength: [10, 'A Tour Name Must Have More or Equal to 10 Characters']
    },
    slug: {
      type: String
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: [
        function(val) {
          return val < this.price;
        },
        'Discount price ({VALUE}) should be lower than regular price'
      ]
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [
      {
        type: String
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [
      {
        type: Date
      }
    ],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
);

toursSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

toursSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});
//DOCUMENT MIDDLEWARE RUNS BEFORE SAVE() AND CREATE()
toursSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

toursSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangeAt'
  });
  next(0);
});

// toursSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// toursSchema.pre('save', function(next) {
//   console.log('Will Save Document');
//   next();
// });

// toursSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE
toursSchema.pre(/^find/, function(next) {
  // toursSchema.pre('find', function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
// toursSchema.pre('findOne', function(next) {
//   this.find({ secretTour: { $ne: true } });
//   next();
// });

toursSchema.post(/^find/, function(docs, next) {
  console.log('from post query middleware');
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// AGGREGATION MIDDLEWARE
toursSchema.pre('aggregate', function(next) {
  console.log('from aggregation middleware');
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', toursSchema);

module.exports = Tour;
