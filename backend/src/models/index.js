// Defines how tables are related to each other

const Feedback = require('./Feedback');
const Upvote = require('./Upvote');
const Comment = require('./Comment');

// A feedback can have many upvotes
Feedback.hasMany(Comment, {
    foreignKey: 'feedbackId',
    as: 'comments',
    onDelete: 'CASCADE'
});

Comment.belongsTo(Feedback, {
    foreignKey: 'feedbackId',
    as: 'feedback'
});

// A feedback can have many comments 
Feedback.hasMany(Upvote, {
    foreignKey: 'feedbackId',
    as: 'upvotes', 
    onDelete: 'CASCADE'
});

Upvote.belongsTo(Feedback, {
    foreignKey: 'feedbackId',
    as: 'feedback'
});

module.exports = {
    Feedback,
    Upvote,
    Comment
};