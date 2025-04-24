/**
 * Utility functions for credit score calculation
 */

/**
 * Calculate credit score based on monthly income and savings balance
 * @param {Number} monthlyIncome - Client's monthly income
 * @param {Number} savingsBalance - Client's savings account balance
 * @returns {Number} - Credit score between 0-100
 */
const calculateCreditScore = (monthlyIncome = 0, savingsBalance = 0) => {
  // Calculate income score (0-50 points)
  // Cap at 5000 birr = 50 points
  const maxIncomeForScore = 5000;
  const incomeScore = Math.min(Math.floor(monthlyIncome / 100), Math.floor(maxIncomeForScore / 100));
  
  // Calculate savings score (0-50 points)
  // Cap at 5000 birr = 50 points
  const maxSavingsForScore = 5000;
  const savingsScore = Math.min(Math.floor(savingsBalance / 100), Math.floor(maxSavingsForScore / 100));
  
  // Total score (0-100)
  const totalScore = incomeScore + savingsScore;
  
  return totalScore;
};

/**
 * Get credit score rating based on numeric score
 * @param {Number} score - Numeric credit score (0-100)
 * @returns {String} - Credit rating (Poor, Fair, Good, Very Good, Excellent)
 */
const getCreditRating = (score) => {
  if (score < 20) return 'Poor';
  if (score < 40) return 'Fair';
  if (score < 60) return 'Good';
  if (score < 80) return 'Very Good';
  return 'Excellent';
};

module.exports = {
  calculateCreditScore,
  getCreditRating
};
