const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');


const Feedback = sequelize.define('Feedback', {
  
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  // Feedback title
  title: {
    type: DataTypes.STRING(100),  
    allowNull: false,             
    validate: {
      notEmpty: {
        msg: 'Title cannot be empty'
      },
      len: {
        args: [5, 100],
        msg: 'Title must be between 5 and 100 characters'
      }
    }
  },
  
  // Feedback description
  description: {
    type: DataTypes.TEXT,         
    allowNull: false,             
    validate: {
      notEmpty: {
        msg: 'Description cannot be empty'
      },
      len: {
        args: [10, 500],
        msg: 'Description must be between 10 and 500 characters'
      }
    }
  },
  
  // Category (Feature, Bug, Enhancement, UI/UX, Other)
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'Feature',
    validate: {
      isIn: {
        args: [['Feature', 'Bug', 'Enhancement', 'UI/UX', 'Other']],
        msg: 'Category must be one of: Feature, Bug, Enhancement, UI/UX, Other'
      }
    }
  },
  
  // Upvote count
  upvotes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,              
    validate: {
      min: {
        args: 0,
        msg: 'Upvotes cannot be negative'
      }
    }
  }
}, {
  // Table configuration
  tableName: 'Feedbacks',         
  timestamps: true,               
  
  // Indexes for faster queries
  // indexes: [
  //   {
  //     fields: ['createdAt']
  //   },
  //   {
  //     fields: ['upvotes']         // Fast sorting by upvotes
  //   },
  //   {
  //     fields: ['category']        // Fast filtering by category
  //   }
  // ]
});

module.exports = Feedback;
