const Issue = require('../models/issue.model');

// Retrieve all issues
const getAllIssues = async (req, res) => {
    try {
        const issues = await Issue.find({});
        res.status(200).json(issues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Retrieve a single issue by ID
const getIssueById = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }
        res.status(200).json(issue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new issue
const createIssue = async (req, res) => {
    try {
        const newIssue = new Issue({
            number: req.body.number,
            severity: req.body.severity,
            date: req.body.date || new Date(),
            device: req.body.device,
            location: req.body.location,
            feedback: req.body.feedback,
            complete: req.body.complete || false
        });

        const savedIssue = await newIssue.save();
        res.status(201).json(savedIssue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an issue by ID
const updateIssue = async (req, res) => {
    try {
        const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }
        res.status(200).json(issue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an issue by ID
const deleteIssue = async (req, res) => {
    try {
        const issue = await Issue.findByIdAndDelete(req.params.id);
        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }
        res.status(200).json({ message: 'Issue deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get the count of all issues
const getTotalIssuesCount = async (req, res) => {
    try {
        const totalIssuesCount = await Issue.countDocuments();
        res.status(200).json({ totalIssuesCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get the severity distribution of issues
const getIssuesSeverity = async (req, res) => {
    try {
        const severityCount = await Issue.aggregate([
            {
                $group: {
                    _id: "$severity",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        const labels = severityCount.map(severity => severity._id);
        const data = severityCount.map(severity => severity.count);

        res.status(200).json({ labels, data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllIssues,
    getIssueById,
    createIssue,
    updateIssue,
    deleteIssue,
    getTotalIssuesCount,
    getIssuesSeverity
};
