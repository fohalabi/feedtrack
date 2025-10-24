// Defines how tables are related to each other

const Feedback = require('./Feedback');
const Upvote = require('./Upvote');
const Comment = require('./Comment');

// A feedback can have many upvotes
Feedback.hasMany(Comment, {
    foreignKey: 'feedbackId',
    as: 'comments', // Alias for easier access
    onDelete: 'CASCADE' // Delete comments if feedback is deleted
});

Comment.belongsTo(Feedback, {
    foreignKey: 'feedbackId',
    as: 'feedback' // Alias for easier access
});

// A feedback can have many comments 
Feedback.hasMany(Upvote, {
    foreignKey: 'feedbackId',
    as: 'upvotes', // Alias for easier access
    onDelete: 'CASCADE' // Delete upvotes if feedback is deleted
});

Upvote.belongsTo(Feedback, {
    foreignKey: 'feedbackId',
    as: 'feedback' // Alias for easier access
});

module.exports = {
    Feedback,
    Upvote,
    Comment
};