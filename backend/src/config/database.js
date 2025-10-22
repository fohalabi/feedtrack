const { Sequelize } = require('sequelize')
require('dotenv').config();

// Create a sequenlize Instance

const sequelize = new Sequelize(
  process.env.DB_NAME,   
  process.env.DB_USER,      
  process.env.DB_PASSWORD,  
  {
    host: process.env.DB_HOST,     
    port: process.env.DB_PORT,     
    dialect: 'postgres',           
    logging: false,                
    
    pool: {
      max: 5,        
      min: 0,      
      acquire: 30000, 
      idle: 10000    
    }
  }
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully!');
  } catch (error) {
    console.error('❌ Unable to connect to database:', error.message);
    process.exit(1); // Exit app if database can't connect
  }
};

module.exports = { sequelize, testConnection };
