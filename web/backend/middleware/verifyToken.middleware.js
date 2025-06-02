const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user.model'); // Đường dẫn tới model người dùng của bạn

const verifyToken = async (req, res, next) => {
    try {
        const user = new User({
            email: "khoa.lesteve@hcmut.edu.vn",
            password: "123456",
            fullname: "Nguyen Khoa"
        })

        if (!user) {
            return res.status(404).send("User not found");
        }
        req.user = user; // Đính kèm thông tin người dùng vào req object
        next(); // Tiếp tục tới handler tiếp theo
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
};
exports = module.exports = verifyToken;