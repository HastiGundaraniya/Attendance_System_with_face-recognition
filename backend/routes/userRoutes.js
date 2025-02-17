const express = require('express');
const User = require('../models/userModel');
const Attendance = require('../models/attendanceModel');

const router = express.Router();

// router.get('/', async (req, res) => {
//     try {
//         const users = await User.find({}).sort({ createdAt: -1 });
//         res.status(200).json(users);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

router.post('/login', async (req, res) => {
    const { email, password, authLevel } = req.body; 

    try {   
        const user = await User.login(email, password, authLevel); 
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


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

module.exports = router;
