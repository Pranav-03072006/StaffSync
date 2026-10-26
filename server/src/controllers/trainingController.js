const Training = require('../models/Training');

// @desc    Get all training programs (Managers/Admin see all, employees see assigned or department-wide)
// @route   GET /api/training
// @access  Private
const getTrainings = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'employee') {
      query = {
        $or: [
          { assignedEmployees: req.user._id },
          { department: 'All' },
          { department: req.user.department }
        ]
      };
    }

    const trainings = await Training.find(query)
      .populate('createdBy', 'name email role')
      .populate('assignedEmployees', 'name email department position')
      .sort({ startDate: 1 });

    res.json(trainings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new training program
// @route   POST /api/training
// @access  Private (Manager / Admin)
const createTraining = async (req, res) => {
  try {
    const { title, description, trainer, department, assignedEmployees, startDate, endDate, status } = req.body;

    if (!title || !description || !startDate || !endDate) {
      return res.status(400).json({ message: 'Please provide title, description, startDate, and endDate' });
    }

    const training = await Training.create({
      title,
      description,
      trainer: trainer || 'Internal L&D Team',
      department: department || 'All',
      assignedEmployees: assignedEmployees || [],
      startDate,
      endDate,
      status: status || 'upcoming',
      createdBy: req.user._id
    });

    const populated = await Training.findById(training._id)
      .populate('createdBy', 'name email role')
      .populate('assignedEmployees', 'name email department position');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update training program
// @route   PUT /api/training/:id
// @access  Private (Manager / Admin, or assigned employee updating status)
const updateTraining = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({ message: 'Training program not found' });
    }

    // Role check: Employees can only view/update status if assigned
    if (req.user.role === 'employee') {
      if (!training.assignedEmployees.some(empId => empId.toString() === req.user._id.toString())) {
        return res.status(403).json({ message: 'Not authorized to update this training program' });
      }
      if (req.body.status) {
        training.status = req.body.status;
      }
    } else {
      const { title, description, trainer, department, assignedEmployees, startDate, endDate, status } = req.body;
      if (title) training.title = title;
      if (description) training.description = description;
      if (trainer) training.trainer = trainer;
      if (department) training.department = department;
      if (assignedEmployees) training.assignedEmployees = assignedEmployees;
      if (startDate) training.startDate = startDate;
      if (endDate) training.endDate = endDate;
      if (status) training.status = status;
    }

    await training.save();

    const populated = await Training.findById(training._id)
      .populate('createdBy', 'name email role')
      .populate('assignedEmployees', 'name email department position');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete training program
// @route   DELETE /api/training/:id
// @access  Private (Manager / Admin)
const deleteTraining = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({ message: 'Training program not found' });
    }

    await Training.findByIdAndDelete(req.params.id);
    res.json({ message: 'Training program deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTrainings,
  createTraining,
  updateTraining,
  deleteTraining
};
