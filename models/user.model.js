// Import required modules
const Sequelize = require('sequelize');


module.exports = (db) => {

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
    Board.belongsTo(Game);
    User.hasMany(Board);
    Board.belongsTo(User);
};