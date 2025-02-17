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

router.post('/monthly', async (req, res) => {
    try {
        const { studentId, subject } = req.body;

        if (!studentId || !subject) {
            return res.status(400).json({ message: "Student ID and Subject are required" });
        }

        // Fetch all attendance records for the given subject
        const attendanceRecords = await Attendance.find({ subject });

        // Extract unique dates where attendance was recorded
        const uniqueDates = [...new Set(attendanceRecords.map(record => record.date))];
        const totalDays = uniqueDates.length; // Total conducted days for this subject

        // Count the number of days the student was marked present
        let presentDays = 0;
        attendanceRecords.forEach(record => {
            const studentAttendance = record.students.find(s => s.studentId.toString() === studentId);
            if (studentAttendance && studentAttendance.status === 'present') {
                presentDays++;
            }
        });

        res.json({ totalDays, presentDays });

    } catch (error) {
        console.error("Error fetching monthly attendance:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
module.exports = router;
