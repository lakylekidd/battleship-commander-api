// Import requirements
const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// Import routes
const userRoutes = require('./routes/user.routes');
const gameRoutes = require('./routes/game.routes');


// Instantiate app
const app = express();

// Apply middlewares
app.use(jsonParser);

// Forward requests to specified routes
app.use('/users', userRoutes);
app.use('/games', gameRoutes);

// Export app
module.exports = app;