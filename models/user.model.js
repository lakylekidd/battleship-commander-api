// Import required modules
const Sequelize = require('sequelize');
const db = require('./../db');
const Game = require('./game.model');
const Board = require('./board.model');

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

// Define relationships
User.hasMany(Game);
Game.belongsTo(User);
Board.belongsTo(Game);
User.hasMany(Board);
Board.belongsTo(User);

module.exports = User;