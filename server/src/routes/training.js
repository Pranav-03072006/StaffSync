const express = require('express');
const router = express.Router();
const {
  getTrainings,
  createTraining,
  updateTraining,
  deleteTraining
} = require('../controllers/trainingController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getTrainings)
  .post(authorize('admin', 'manager'), createTraining);

router.route('/:id')
  .put(updateTraining)
  .delete(authorize('admin', 'manager'), deleteTraining);

module.exports = router;
