// Import requirements
const http = require('http');
const app = require('./app');
const config = require('./config');

// Create the server
const server = http.createServer(app);

// Import the models
const Board = require('./models/board.model');
const Game = require('./models/game.model');
const Tile = require('./models/tile.model');
const User = require('./models/user.model');

// Start listening at specified port
server.listen(config.port, (e) => {
    // Check if there are any errors
    if (e) {
        throw new Error('Internal Server Error');
    }

    // Log server is running
    console.log(`${config.name} running on ${config.url}`);
});