// Import required modules
const Sequelize = require('sequelize');
const db = require('./../db');
const Board = require('./board.model');

// Define a tile model
const Tile = db.define('tile', {
    index: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    posX: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    posY: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    occupied: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    targeted: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
}, {
        tableName: 'tiles',
        timestamps: false
    }
);

// Export the model
module.exports = Tile;
