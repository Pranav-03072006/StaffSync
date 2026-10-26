const mongoose = require('mongoose');

const TrainingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  trainer: { type: String, default: 'Internal L&D Team' },
  department: { type: String, default: 'All' },
  assignedEmployees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: {
    type: String,
    enum: ['upcoming', 'in-progress', 'completed'],
    default: 'upcoming'
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Training', TrainingSchema);
