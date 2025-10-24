// handles all comment-related CRUD operations
const { Comment, Feedback } = require('../models');

/**
 * GET ALL COMMENTS FOR A FEEDBACK
 * Endpoint: GET /api/feedback/:feedbackId/comments
 */
const getCommentsByFeedbackId = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    
    // Check if feedback exists
    const feedback = await Feedback.findByPk(feedbackId);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: `Feedback with id ${feedbackId} not found`
      });
    }
    
    // Get all comments for this feedback
    const comments = await Comment.findAll({
      where: { feedbackId },
      order: [['createdAt', 'ASC']] // Oldest first
    });
    
    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
    
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments',
      error: error.message
    });
  }
};

/**
 * CREATE NEW COMMENT
 * Endpoint: POST /api/feedback/:feedbackId/comments
 * Body: { author, text }
 */
const createComment = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { author, text } = req.body;
    
    // Validate
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }
    
    // Check if feedback exists
    const feedback = await Feedback.findByPk(feedbackId);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: `Feedback with id ${feedbackId} not found`
      });
    }
    
    // Create comment
    const newComment = await Comment.create({
      feedbackId,
      author: author || 'Anonymous',
      text
    });
    
    // Emit real-time event
    req.io.emit('commentAdded', {
      feedbackId,
      comment: newComment
    });
    
    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: newComment
    });
    
  } catch (error) {
    console.error('Error creating comment:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create comment',
      error: error.message
    });
  }
};

/**
 * UPDATE COMMENT
 * Endpoint: PUT /api/comments/:id
 * Body: { text }
 */
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }
    
    const comment = await Comment.findByPk(id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: `Comment with id ${id} not found`
      });
    }
    
    comment.text = text;
    await comment.save();
    
    // Emit real-time event
    req.io.emit('commentUpdated', comment);
    
    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      data: comment
    });
    
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update comment',
      error: error.message
    });
  }
};

/**
 * DELETE COMMENT
 * Endpoint: DELETE /api/comments/:id
 */
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const comment = await Comment.findByPk(id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: `Comment with id ${id} not found`
      });
    }
    
    const feedbackId = comment.feedbackId;
    await comment.destroy();
    
    // Emit real-time event
    req.io.emit('commentDeleted', { id, feedbackId });
    
    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete comment',
      error: error.message
    });
  }
};

module.exports = {
  getCommentsByFeedbackId,
  createComment,
  updateComment,
  deleteComment
};