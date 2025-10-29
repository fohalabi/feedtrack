// Main Express application setup
// Configures middleware, routes, and error handling


const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const feedbackRoutes = require('./routes/feedback');
const commentRoutes = require('./routes/comments');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Create Express app
const app = express();

// Middleware setup


// CORS - Cross-Origin Resource Sharing
// Allows frontend (localhost:5173) to make requests to backend (localhost:3000)
 
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

/**
 * Body Parser
 * Parses incoming JSON requests
 * Example: { "title": "..." } becomes accessible as req.body.title
 */
app.use(express.json());

/**
 * URL-encoded Parser
 * Parses form data
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Request Logger (Development only)
 * Logs every request to console
 */
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`📝 ${req.method} ${req.url}`, {
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  });
}

/**
 * Socket.io Middleware Attachment
 * Makes io (Socket.io) available in all controllers via req.io
 * This is set up in server.js and attached here
 */
app.use((req, res, next) => {
  req.io = req.app.get('io');
  next();
});

// ROUTES

/**
 * Health Check Endpoint
 * Test if server is running
 * GET /health
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FeedTrack API is running!',
    timestamp: new Date().toISOString()
  });
});

// All routes are prefixed with /api
app.use('/api/feedback', feedbackRoutes);
app.use('/api', commentRoutes); // Comments use /api/feedback/:id/comments and /api/comments/:id

/**
 * Root endpoint
 * GET /
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to FeedTrack API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      feedback: '/api/feedback',
      comments: '/api/feedback/:feedbackId/comments'
    }
  });
});

// ERROR HANDLING

/**
 * 404 Handler
 * Catches all requests to non-existent routes
 * Must come AFTER all other routes
 */
app.use(notFound);

// Global Error Handling
app.use(errorHandler);

module.exports = app;