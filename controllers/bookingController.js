const stripe = require('stripe')(
  'sk_test_51Mb3uXCt6AIji4auHEDrJ71ZwWyxFShijmSRxeTyjHHB7mqYmkA9l6igTO6R5yEGf3LlxrGVtalwGTQfZGGp6kU400vtBpapYj'
);
const Tour = require('../models/tourModel');
const Booking = require('../models/BookingModel');
const factory = require('./handlerFactory');

exports.getCheckoutSession = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.tourID);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `${req.protocol}://${req.get('host')}/?tour=${
        req.params.tourID
      }&user=${req.user.id}&price=${tour.price}`,
      cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
      mode: 'payment',
      customer_email: req.user.email,
      client_reference_id: req.params.tourId,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${tour.name} Tour`,
              description: tour.summary,
              images: [`https://www.natours.dev/img/tours/${tour.imageCover}`]
            },
            unit_amount: tour.price * 100
          },
          quantity: 1
        }
      ]
    });
    res.status(200).json({
      status: 'success',
      session
    });
  } catch (err) {
    next(err);
  }
};

exports.createBookingCheckout = async (req, res, next) => {
  try {
    const { tour, user, price } = req.query;
    if (!tour && !user && !price) return next();
    await Booking.create({ tour, user, price });
    res.redirect(req.originalUrl.split('?')[0]);
    next();
  } catch (err) {
    next(err);
  }
};
exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
