const mongoose = require('mongoose');

const loginDataSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    successful: { type: Boolean, required: true },
    ipAddress: { type: String, required: false }
});

const LoginData = mongoose.model('LoginData', loginDataSchema);
module.exports = LoginData;