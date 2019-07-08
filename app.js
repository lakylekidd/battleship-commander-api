// Import requirements
const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// Import routes


// Instantiate app
const app = express();

// Apply middlewares
app.use(jsonParser);

// Forward requests to specified routes


// Export app
module.exports = app;