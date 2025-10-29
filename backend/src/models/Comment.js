// Defines the structure of the comment table

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Each commment belongs to one feedback
// A feedback can have multiple comments

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    // Which feedback this comment belongs to
    feedbackId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Feedback', // References the feedback table
            key: 'id'
        },
        onDelete: 'CASCADE' // Delete comments if the feedback is deleted
    },

    // Author name
    author: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'Anonymous',
        validate: {
            notEmpty: {
                msg: 'Author name cannot be empty'
            }
        }
    },

    // Comment content
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Comment text cannot be empty'
            },
            len: {
                args: [1, 1000],
                msg: 'Comment text must be between 1 and 1000 characters long'
            }
        }
    }
}, {
    tableName: 'Comments',
    timestamps: true,

    // indexes: [
    //     {
    //         fields: ['feedbackId']   // Fast lookup of comments by feedback
    //     }
    // ]
});

module.exports = Comment;