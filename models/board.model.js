// Import required modules
const Sequelize = require('sequelize');
const db = require('./../../db');
const Game = require('./game.model');
const User = require('./user.model');
const Tile = require('./Tile.model');

// Define a board model
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
Board.hasMany(Tile);


// Export the model
module.exports = Board;
