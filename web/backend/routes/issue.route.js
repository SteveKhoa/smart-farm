const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issue.controller');

router.get('/', issueController.getAllIssues);
router.get('/:id', issueController.getIssueById);
router.post('/', issueController.createIssue);
router.put('/:id', issueController.updateIssue);
router.delete('/:id', issueController.deleteIssue);
router.get('/issues-count', issueController.getTotalIssuesCount);
router.get('/issues-severity', issueController.getIssuesSeverity);

module.exports = router;
