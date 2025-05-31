const express = require('express');
const router = express.Router();
const  LoginData  = require('../models/login.model.js');  // Update the path as necessary


router.get('/login-attempts-by-hour', async (req, res) => {
    try {
        const stats = await LoginData.aggregate([
            {
                $group: {
                    _id: { $hour: "$date" },
                    totalLogins: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/average-logins-per-hour', async (req, res) => {
    try {
        const stats = await LoginData.aggregate([
            {
                $group: {
                    _id: null,
                    totalLogins: { $sum: 1 },
                    count: { $sum: 1 }
                }
            }
        ]);

        const average = stats.length ? stats[0].totalLogins / stats[0].count : 0;
        res.json({ average: average.toFixed(1) });  // rounded to one decimal place
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/peak-login-time', async (req, res) => {
    try {
        const stats = await LoginData.aggregate([
            {
                $group: {
                    _id: { $hour: "$date" },
                    logins: { $sum: 1 }
                }
            },
            {
                $sort: { logins: -1 }
            },
            { $limit: 1 }
        ]);

        if (stats.length) {
            const peakTime = stats[0];
            res.json({ peakTime: `${peakTime._id}:00`, logins: peakTime.logins });
        } else {
            res.json({ message: "No data available" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;