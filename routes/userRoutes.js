const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
router.route('/').get(getAllUsers);
router.route('/').post(createUser);
router.route('/:id').get(getUser);
router.route('/:id').patch(updateUser);
router.route('/:id').delete(deleteUser);

module.exports = router;
