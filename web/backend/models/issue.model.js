const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const issueSchema = new Schema({
    number: {
        type: Number,
        required: true,
        unique: true,
        index: true // indexing for faster query performance on this field
    },
    severity: {
        type: String,
        required: true,
        enum: ['Low', 'Medium', 'High'], // Enum to ensure the severity is one of the predefined values
    },
    date: {
        type: Date,
        required: true,
        default: Date.now // Automatically sets to the current date
    },
    device: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: false
    },
    complete: {
        type: Boolean,
        required: true,
        default: false // Defaults to false indicating issue is open/not completed
    }
});

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;
