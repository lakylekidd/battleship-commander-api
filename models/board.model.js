// Import required modules
const Sequelize = require('sequelize');
const db = require('./../../db');
const Game = require('./game.model');
const User = require('./user.model');

// Define a game model
const Board = db.define('board', {
    ready: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    winner: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
}, {
        tableName: 'boards',
        timestamps: false
    }
);

// Define Relationships
Board.belongsTo(Game);
Board.belongsTo(User);


// Export the model
module.exports = Board;
