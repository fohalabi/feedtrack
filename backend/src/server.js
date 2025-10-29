// Starts the Express server and Socket.io for real-time communication
// Also syncs database tables

const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { sequelize, testConnection } = require('./config/database');
const { Feedback, Comment, Upvote } = require('./models');

// Get port from environment or use 3000
const PORT = process.env.PORT || 3000;

// ========== CREATE HTTP SERVER ==========
// Express app needs to be wrapped in http.createServer for Socket.io
const server = http.createServer(app);

// ========== SETUP SOCKET.IO ==========
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Socket.io Connection Handler
// Runs when a client connects via WebSocket

io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  
  // Track connected clients
  io.emit('clientCount', io.engine.clientsCount);
  
  /**
   * Handle client disconnect
   */
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
    io.emit('clientCount', io.engine.clientsCount);
  });
  
   // Optional: Handle custom events from client
   // Example: Client can send "typing" event when commenting

  socket.on('typing', (data) => {
    socket.broadcast.emit('userTyping', data);
  });
});

// Make Socket.io available in Express app
app.set('io', io);

// DATABASE INITIALIZATION 

// Initialize Database
//- Tests connection
//- Creates tables if they don't exist
//- Starts server

const initializeDatabase = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Sync all models with database
    // { alter: true } updates existing tables without dropping data
    // { force: true } would drop and recreate tables (use carefully!)
    await sequelize.sync({ alter: true });
    
    console.log('✅ Database tables synced successfully');
    
    // Start server after database is ready
    server.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log(`🚀 FeedTrack API Server Running`);
      console.log(`📍 Local: http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔌 Socket.io: Ready for real-time connections`);
      console.log('='.repeat(50));
    });
    
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1); // Exit if database fails
  }
};

// ========== GRACEFUL SHUTDOWN ==========

/**
 * Handle process termination
 * Closes database connection cleanly
 */
const shutdown = async () => {
  console.log('\n🛑 Shutting down gracefully...');
  
  try {
    await sequelize.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

// Listen for termination signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// START SERVER
initializeDatabase();
