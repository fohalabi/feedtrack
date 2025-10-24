// Defines all comment-related endpoints
const express = require('express');
const router = express.Router();

const {
  getCommentsByFeedbackId,
  createComment,
  updateComment,
  deleteComment
} = require('../controllers/commentController');

/**
 * @route   GET /api/feedback/:feedbackId/comments
 * @desc    Get all comments for a specific feedback
 * @access  Public
 * @params  feedbackId - Feedback ID
 * 
 * Example: GET /api/feedback/5/comments
 */
router.get('/feedback/:feedbackId/comments', getCommentsByFeedbackId);

/**
 * @route   POST /api/feedback/:feedbackId/comments
 * @desc    Add a comment to feedback
 * @access  Public
 * @params  feedbackId - Feedback ID
 * @body    { author, text }
 * 
 * Example: POST /api/feedback/5/comments
 * Body: {
 *   "author": "John Doe",
 *   "text": "Great idea!"
 * }
 */
router.post('/feedback/:feedbackId/comments', createComment);

/**
 * @route   PUT /api/comments/:id
 * @desc    Update a comment
 * @access  Public
 * @params  id - Comment ID
 * @body    { text }
 * 
 * Example: PUT /api/comments/3
 * Body: { "text": "Updated comment text" }
 */
router.put('/comments/:id', updateComment);

/**
 * @route   DELETE /api/comments/:id
 * @desc    Delete a comment
 * @access  Public
 * @params  id - Comment ID
 * 
 * Example: DELETE /api/comments/3
 */
router.delete('/comments/:id', deleteComment);

module.exports = router;