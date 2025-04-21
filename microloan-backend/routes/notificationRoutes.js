const express = require('express');
const { getUserNotifications, markAsRead } = require('../controllers/notificationController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Fetch notifications for authenticated user
router.get('/', authMiddleware, getUserNotifications);

// Mark a notification as read
router.patch('/:notificationId/read', authMiddleware, markAsRead);

module.exports = router;
