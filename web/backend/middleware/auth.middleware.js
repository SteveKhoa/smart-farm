const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

const authController = require('../controllers/auth.controller');

// check if user is logged in

const verifyUser = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ msg: "Please log in first" });

    }
    const user = await User.findById(req.session.userId);
    if (!user) {
        return res.status(401).json({ msg: "Please log in first" });
    }
    req.user = user;
    req.role = user.role;
    next();
}

const adminOnly = async (req, res, next) => {
    const user = await User.findById({ _id: req.session.userId });
    if (!user) {
        return res.status(401).json({ msg: "Please log in first" });
    }
    
    if (user.role !== "admin") {
        return res.status(403).json({ msg: "Admin only" });
    }
    next();

}

exports.verifyUser = verifyUser;
exports.adminOnly = adminOnly;
module.exports = router;