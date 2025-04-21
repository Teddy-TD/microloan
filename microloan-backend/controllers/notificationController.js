const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const mongoose = require('mongoose');

const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status, type } = req.query;
    const skip = (page - 1) * limit;
    const filter = { user: userId };
    if (status) filter.status = status;
    if (type) filter.type = type;
    const totalCount = await Notification.countDocuments(filter);
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('linkId', 'user amount applicationDate');
    res.json({
      notifications: notifications.map(n => ({
        notificationId: n._id,
        userId: n.user,
        message: n.message,
        type: n.type,
        status: n.status,
        createdAt: n.createdAt,
        linkId: n.linkId
      })),
      pagination: {
        currentPage: parseInt(page),
        limit: parseInt(limit),
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ message: 'Invalid notification ID' });
    }
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    if (notification.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (notification.status === 'unread') {
      notification.status = 'read';
      await notification.save();
      await AuditLog.create({
        user: req.user.id,
        action: 'notification_read',
        details: { notificationId: notification._id }
      });
    }
    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('❌ Error marking notification read:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getUserNotifications, markAsRead };
