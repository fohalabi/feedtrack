// Handles all feedback-related Business logic (CRUD operations)
const { Feedback, Comment, Upvote } = require('../models');
const { Op } = require('sequelize');

/**
 * GET ALL FEEDBACK
 * Endpoint: GET /api/feedback
 * Query params: ?sort=newest|mostUpvoted&category=Feature
 */
const getAllFeedback = async (req, res) => {
  try {
    // Extract query parameters from URL
    const { sort = 'newest', category } = req.query;
    
    // Build where clause for filtering
    const whereClause = {};
    if (category) {
      whereClause.category = category;
    }
    
    // Determine sort order
    let orderBy;
    if (sort === 'mostUpvoted') {
      orderBy = [['upvotes', 'DESC']];  // Highest upvotes first
    } else {
      orderBy = [['createdAt', 'DESC']]; // Newest first
    }
    
    // Query database
    const feedbacks = await Feedback.findAll({
      where: whereClause,
      order: orderBy,
      include: [
        {
          model: Comment,
          as: 'comments',
          attributes: ['id', 'author', 'text', 'createdAt'] // Only get these fields
        }
      ]
    });
    
    // Send response
    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
    
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
};

/**
 * GET SINGLE FEEDBACK BY ID
 * Endpoint: GET /api/feedback/:id
 */
const getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find feedback with all its comments
    const feedback = await Feedback.findByPk(id, {
      include: [
        {
          model: Comment,
          as: 'comments',
          order: [['createdAt', 'ASC']] // Oldest comments first
        }
      ]
    });
    
    // Check if feedback exists
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: `Feedback with id ${id} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: feedback
    });
    
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
};

/**
 * CREATE NEW FEEDBACK
 * Endpoint: POST /api/feedback
 * Body: { title, description, category }
 */
const createFeedback = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }
    
    // Create new feedback in database
    const newFeedback = await Feedback.create({
      title,
      description,
      category: category || 'Feature',
      upvotes: 0
    });
    
    // Emit real-time event to all connected clients
    req.io.emit('feedbackAdded', newFeedback);
    
    res.status(201).json({
      success: true,
      message: 'Feedback created successfully',
      data: newFeedback
    });
    
  } catch (error) {
    console.error('Error creating feedback:', error);
    
    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create feedback',
      error: error.message
    });
  }
};

/**
 * UPDATE FEEDBACK
 * Endpoint: PUT /api/feedback/:id
 * Body: { title, description, category }
 */
const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;
    
    // Find feedback first
    const feedback = await Feedback.findByPk(id);
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: `Feedback with id ${id} not found`
      });
    }
    
    // Update fields (only update provided fields)
    if (title) feedback.title = title;
    if (description) feedback.description = description;
    if (category) feedback.category = category;
    
    // Save to database
    await feedback.save();
    
    // Emit real-time event
    req.io.emit('feedbackUpdated', feedback);
    
    res.status(200).json({
      success: true,
      message: 'Feedback updated successfully',
      data: feedback
    });
    
  } catch (error) {
    console.error('Error updating feedback:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update feedback',
      error: error.message
    });
  }
};

/**
 * DELETE FEEDBACK
 * Endpoint: DELETE /api/feedback/:id
 */
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find feedback
    const feedback = await Feedback.findByPk(id);
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: `Feedback with id ${id} not found`
      });
    }
    
    // Delete from database
    await feedback.destroy();
    
    // Emit real-time event
    req.io.emit('feedbackDeleted', { id });
    
    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete feedback',
      error: error.message
    });
  }
};

/**
 * TOGGLE UPVOTE
 * Endpoint: POST /api/feedback/:id/upvote
 * Tracks user by IP address
 */
const toggleUpvote = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get user's IP address
    const userIp = req.ip || req.connection.remoteAddress;
    
    // Find feedback
    const feedback = await Feedback.findByPk(id);
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: `Feedback with id ${id} not found`
      });
    }
    
    // Check if user already upvoted
    const existingUpvote = await Upvote.findOne({
      where: {
        feedbackId: id,
        userIp: userIp
      }
    });
    
    if (existingUpvote) {
      // Remove upvote
      await existingUpvote.destroy();
      feedback.upvotes = Math.max(0, feedback.upvotes - 1);
      await feedback.save();
      
      // Emit real-time event
      req.io.emit('feedbackUpvoted', {
        feedbackId: id,
        upvotes: feedback.upvotes,
        action: 'removed'
      });
      
      return res.status(200).json({
        success: true,
        message: 'Upvote removed',
        upvoted: false,
        upvotes: feedback.upvotes
      });
      
    } else {
      // Add upvote
      await Upvote.create({
        feedbackId: id,
        userIp: userIp
      });
      
      feedback.upvotes = feedback.upvotes + 1;
      await feedback.save();
      
      // Emit real-time event
      req.io.emit('feedbackUpvoted', {
        feedbackId: id,
        upvotes: feedback.upvotes,
        action: 'added'
      });
      
      return res.status(200).json({
        success: true,
        message: 'Upvote added',
        upvoted: true,
        upvotes: feedback.upvotes
      });
    }
    
  } catch (error) {
    console.error('Error toggling upvote:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle upvote',
      error: error.message
    });
  }
};

/**
 * CHECK IF USER UPVOTED
 * Endpoint: GET /api/feedback/:id/upvote-status
 */
const checkUpvoteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userIp = req.ip || req.connection.remoteAddress;
    
    const upvote = await Upvote.findOne({
      where: {
        feedbackId: id,
        userIp: userIp
      }
    });
    
    res.status(200).json({
      success: true,
      hasUpvoted: !!upvote
    });
    
  } catch (error) {
    console.error('Error checking upvote status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check upvote status',
      error: error.message
    });
  }
};

module.exports = {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  toggleUpvote,
  checkUpvoteStatus
};
