const express = require('express');
const Attendance = require('../models/attendanceModel');

const router = express.Router();

// router.get('/', async (req, res) => {
//         try {
//             const users = await Attendance.find({});
//             res.status(200).json(users);
//         } catch (err) {
//             res.status(500).json({ error: err.message });
//         }
//     });

router.post('/data', async (req, res) => {
    let { date, subject } = req.body;

    try {
        const data = await Attendance.findData(date, subject);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/studata', async (req, res) => {
    let { date, subject, studentId } = req.body;

    try {
        const data = await Attendance.findOne({ date, subject });

        if (!data) {
            return res.status(404).json({ error: "No attendance record found" });
        }

        const studentRecord = data.students.find(student => student.studentId.toString() === studentId);

        if (!studentRecord) {
            return res.status(404).json({ error: "Student not found in attendance" });
        }

        res.json({ status: studentRecord.status });
    } 
    catch (err) {
        console.error("Error fetching attendance:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
