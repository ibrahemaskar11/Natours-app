const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = Model => {
  return async (req, res, next) => {
    try {
      const doc = await Model.deleteOne({ id: req.params.id });
      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }
      res.status(204).json({
        status: 'Success',
        data: null
      });
    } catch (err) {
      next(err);
    }
  };
};

exports.updateOne = Model => {
  return async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }
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
};

exports.createOne = Model => {
  return async (req, res, next) => {
    try {
      const doc = await Model.create(req.body);
      res.status(201).json({
        status: 'Success',
        data: {
          data: doc
        }
      });
    } catch (err) {
      next(err);
    }
  };
};

exports.getOne = (Model, populateOptions) => {
  return async (req, res, next) => {
    try {
      let query = Model.findById(req.params.id);
      if (populateOptions) query = query.populate(populateOptions);
      const doc = await query;
      //tour = await Tour.findOne({ _id: req.params.id });
      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }
      res.status(200).json({
        message: 'Success',
        data: {
          data: doc
        }
      });
    } catch (err) {
      next(err);
    }
  };
};

exports.getAll = Model => {
  return async (req, res, next) => {
    try {
      let filter = {};
      if (req.params.tourId) filter = { tour: req.params.tourId };
      const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const doc = await features.query;
      res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
          data: doc
        }
      });
    } catch (err) {
      next(new AppError(err.message, 400));
    }
  };
};
