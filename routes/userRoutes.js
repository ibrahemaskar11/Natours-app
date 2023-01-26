const express = require('express');
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();
router.route('/signup').post(authController.signup);
router.route('/').get(getAllUsers);
router.route('/').post(createUser);
router.route('/:id').get(getUser);
router.route('/:id').patch(updateUser);
router.route('/:id').delete(deleteUser);

module.exports = router;
