// Import required models
const Sequelize = require('sequelize');
const config = require('./config');
const databaseUrl = config.DATABASE_URL;

// Import the models
const Board = require('./models/board.model');
const Game = require('./models/game.model');
const Tile = require('./models/tile.model');
const User = require('./models/user.model');

// Create a new instance of sequelize
const sequelize = new Sequelize(databaseUrl);

// Sync the data (create schemas)
sequelize.sync()
    .then(r => {
        // Log success
        console.log('Database schema created!');
    })
    .catch(console.log);

// Export the sequelize instance
module.exports = sequelize;
