const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: false
    },
    
    schedule: {
        type: Object,
        required: false
    },
    phoneNo: {
        type: Number,
        required: false
    },
    positionList: {
        type: Array,
        required: false
    }


});
const User = mongoose.model('User', userSchema);
module.exports = User;