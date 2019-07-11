// Import required modules
const Sequelize = require('sequelize');
const db = require('./../db');
const Board = require('./board.model');

// Define a game model
const Game = db.define('game', {
    startDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    difficulty: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    gameState: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
        tableName: 'games',
        timestamps: false
    }
);

// Define Relationships
Game.hasMany(Board);

// Export the model
module.exports = Game;
