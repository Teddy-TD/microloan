const express = require('express');
const router = express.Router();
const { 
  getPendingApplications, 
  getApplicationById, 
  processApplication, 
  getApplicationDocument,
  getAllApplications
} = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Admin routes for loan application management
router.get('/loan-applications/pending', authMiddleware, adminMiddleware, getPendingApplications);
router.get('/loan-applications', authMiddleware, adminMiddleware, getAllApplications);
router.get('/loan-applications/:applicationId', authMiddleware, adminMiddleware, getApplicationById);
router.patch('/loan-applications/:applicationId', authMiddleware, adminMiddleware, processApplication);
router.get('/loan-applications/:applicationId/documents/:documentId', authMiddleware, adminMiddleware, getApplicationDocument);

module.exports = router;
