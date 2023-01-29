const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').post(authController.resetPassword);
router
  .route('/updatePassword')
  .post(authController.protect, authController.updatePassword);
router
  .route('/updateMe')
  .patch(authController.protect, userController.updateMe);
router
  .route('/deleteMe')
  .delete(authController.protect, userController.deleteMe);
router.route('/').get(userController.getAllUsers);
router.route('/').post(userController.createUser);
router.route('/:id').get(userController.getUser);
router.route('/:id').patch(userController.updateUser);
router.route('/:id').delete(userController.deleteUser);

module.exports = router;
