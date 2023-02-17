const express = require('express');
const bookingController = require('../controllers/bookingController');
const router = express.Router();
const authController = require('../controllers/authController');
const viewController = require('../controllers/viewController');

router
  .route('/')
  .get(
    bookingController.createBookingCheckout,
    authController.isLoggedIn,
    viewController.getOverview
  );

router
  .route('/tour/:slug')
  .get(authController.isLoggedIn, viewController.getTour);

router.route('/login').get(authController.isLoggedIn, viewController.login);

router.route('/signup').get(authController.isLoggedIn, viewController.signup);

router.route('/me').get(authController.protect, viewController.getAccount);

router
  .route('/my-bookings')
  .get(authController.protect, viewController.getMyTours);

router
  .route('/submit-user-data')
  .post(authController.protect, viewController.updateUserData);

module.exports = router;
