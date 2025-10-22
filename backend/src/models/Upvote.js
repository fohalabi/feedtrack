// Tracks which users upvoted which feedback (prevents duplicate upvotes)

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// This model connects users to feedback they have upvoted
const Upvote = sequelize.define('Upvote', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    // which feedback was upvoted
    feedbackId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Feedback', // References the feedback table
            key: 'id'
        },
        onDelete: 'CASCADE' // Delete upvotes if feedback is deleted
    },

    // which user upvoted the feedback
    userIp: {
        type: DataTypes.STRING(45), // Ipv6 can be long
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'User IP cannot be empty'
            }
        }
    }
}, {
    tableName: 'upvotes',
    timestamps: true,

    indexes: [
        {
            // Unique constraint to prevent duplicate upvotes by the same user on the same feedback
            unique: true,
            fields: ['feedbackId', 'userIp']
        }
    ]
});

module.exports = Upvote;