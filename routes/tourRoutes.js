const express = require('express');

const router = express.Router();
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getToursStats,
  getMonthlyPlan
} = require('../controllers/tourController');

// router.param('id', checkId);
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/').get(getAllTours);
router.route('/tours-stats').get(getToursStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/').post(createTour);
router.route('/:id').get(getTour);
router.route('/:id').patch(updateTour);
router.route('/:id').delete(deleteTour);

module.exports = router;
