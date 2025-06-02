const LoginData = require('../models/login.model');


const getLoginStats = async (req, res) => {
    try {
        const stats = await LoginData.aggregate([
            {
                $group: {
                    _id: { $hour: "$date" },
                    logins: { $sum: 1 },
                    successfulLogins: { $sum: { $cond: ["$successful", 1, 0] } }
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
};

module.exports = { getLoginStats };