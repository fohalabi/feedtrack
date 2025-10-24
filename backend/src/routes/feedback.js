// Defines all feebad related endpoints
const express = require('express');
const router = express.Router();


const {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  toggleUpvote,
  checkUpvoteStatus
} = require('../controllers/feedbackController');

/**
 * @route   GET /api/feedback
 * @desc    Get all feedback (with optional sorting and filtering)
 * @access  Public
 * @query   ?sort=newest|mostUpvoted&category=Feature
 * 
 * Example: GET /api/feedback?sort=mostUpvoted&category=Bug
 */
router.get('/', getAllFeedback);

/**
 * @route   GET /api/feedback/:id
 * @desc    Get single feedback by ID
 * @access  Public
 * @params  id - Feedback ID
 * 
 * Example: GET /api/feedback/5
 */
router.get('/:id', getFeedbackById);

/**
 * @route   POST /api/feedback
 * @desc    Create new feedback
 * @access  Public
 * @body    { title, description, category }
 * 
 * Example Body:
 * {
 *   "title": "Add Dark Mode",
 *   "description": "Users want a dark theme option",
 *   "category": "Feature"
 * }
 */
router.post('/', createFeedback);

/**
 * @route   PUT /api/feedback/:id
 * @desc    Update existing feedback
 * @access  Public
 * @params  id - Feedback ID
 * @body    { title, description, category }
 * 
 * Example: PUT /api/feedback/5
 * Body: { "title": "Updated Title" }
 */
router.put('/:id', updateFeedback);

/**
 * @route   DELETE /api/feedback/:id
 * @desc    Delete feedback
 * @access  Public
 * @params  id - Feedback ID
 * 
 * Example: DELETE /api/feedback/5
 */
router.delete('/:id', deleteFeedback);

/**
 * @route   POST /api/feedback/:id/upvote
 * @desc    Toggle upvote on feedback (add or remove)
 * @access  Public
 * @params  id - Feedback ID
 * 
 * Example: POST /api/feedback/5/upvote
 */
router.post('/:id/upvote', toggleUpvote);

/**
 * @route   GET /api/feedback/:id/upvote-status
 * @desc    Check if current user has upvoted this feedback
 * @access  Public
 * @params  id - Feedback ID
 * 
 * Example: GET /api/feedback/5/upvote-status
 * Response: { "success": true, "hasUpvoted": true }
 */
router.get('/:id/upvote-status', checkUpvoteStatus);

module.exports = router;
