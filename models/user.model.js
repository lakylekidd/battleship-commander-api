// Import required modules
const Sequelize = require('sequelize');
const db = require('./../../db');

// Define a user model
const User = db.define('user', {
    username: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
        tableName: 'users',
        timestamps: false
    }
);

// Export the model
module.exports = User;
