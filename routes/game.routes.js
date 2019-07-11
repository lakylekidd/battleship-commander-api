// Import required modules
const { Router } = require('express');
const auth = require('./../middlewares/auth.middleware');
const gameController = require('./../controllers/game.controller');

// Create a new router
const router = new Router();

// Returns a list of available games a user can join
router.get('/', auth, gameController.getAvailableGames);

// Creates a new game session
router.post('/', auth, gameController.createNewGameSession);

// Accepts actions from a player
router.post('/:id', auth, gameController.fire);

// The stream of the selected game. TODO: Check if POST or GET
router.get('/:id/stream', gameController.gameStream);

// Allows user to join the specified game
router.get('/:id/join', auth, gameController.join);

// Export the router
module.exports = router;
