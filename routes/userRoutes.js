const express = require('express');
const multer = require('multer');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').post(authController.resetPassword);

router.use(authController.protect);

router.route('/updatePassword').post(authController.updatePassword);
router
  .route('/updateMe')
  .patch(
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe
  );
router.route('/deleteMe').delete(userController.deleteMe);
router.route('/me').get(userController.getMe, userController.getUser);

router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);
router.route('/').post(userController.createUser);
router.route('/:id').get(userController.getUser);
router.route('/:id').patch(userController.updateUser);
router.route('/:id').delete(userController.deleteUser);

module.exports = router;
