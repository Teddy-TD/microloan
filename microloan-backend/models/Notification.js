const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read'], default: 'unread' },
  linkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);
