const epxress = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = epxress.Router();

router
  .route('/checkout-session/:tourID')
  .get(authController.protect, bookingController.getCheckoutSession);

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
