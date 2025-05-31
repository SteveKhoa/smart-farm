const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user.model'); // Đường dẫn tới model người dùng của bạn

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Lấy token từ header Authorization
        if (!token) {
            return res.status(403).send("A token is required for authentication");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded._id).select('-password'); 
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