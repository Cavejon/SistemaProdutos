// backend/routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.post('/', verifyToken, feedbackController.createFeedback);
router.get('/pending', verifyToken, verifyAdmin, feedbackController.getPendingFeedbacks);
router.put('/:id/status', verifyToken, verifyAdmin, feedbackController.updateFeedbackStatus);

module.exports = router;