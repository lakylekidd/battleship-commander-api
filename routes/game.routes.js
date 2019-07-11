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

// Accepts fire actions from a player
router.post('/:id/fire', auth, gameController.fire);

// Accepts fire actions from a player
router.post('/:id/place-ship', auth, gameController.placeShip);

// The stream of the selected game. TODO: Check if POST or GET
router.get('/:id/stream', auth, gameController.gameStream);

// Allows user to join the specified game
router.get('/:id/join', auth, gameController.join);

// Allows user to exit the specified game
router.post('/:id/exit', auth, gameController.exitGame);

// Specifies that the current board is ready to play.
router.post('/:id/ready/:boardId', auth, gameController.ready);

// Export the router
module.exports = router;
