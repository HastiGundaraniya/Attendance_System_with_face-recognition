const express = require('express');
const User = require('../models/userModel');
const Attendance = require('../models/attendanceModel')
const jwt = require('jsonwebtoken');

const router = express.Router();

// Function to create a JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

// Signup Route
router.post('/signup', async (req, res) => {
  const { name, email, password, authLevel } = req.body; 

  try {
    const user = await User.signup(name, email, password, authLevel); 

    // Create token
    const token = createToken(user._id);

    res.status(200).json({ name, email, token, authLevel });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get('/students', async (req, res) => {
  try {
    const students = await User.find({ authLevel: 'student' });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/attendance', async (req, res) => {
  const { date, subject, students } = req.body;

  if (!date || !subject || !students || students.length === 0) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Validate student IDs (optional but recommended)
  try {
    for (let student of students) {
      const user = await User.findById(student.studentId);
      if (!user) {
        return res.status(400).json({ message: `Student with ID ${student.studentId} not found` });
      }
    }

    // Create a new attendance record
    const attendance = new Attendance({
      date,
      subject,
      students
    });

    await attendance.save();
    res.status(201).json({ message: 'Attendance submitted successfully!' });

  } catch (error) {
    console.error('Error submitting attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;
