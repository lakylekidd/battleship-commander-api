// Import required modules
const { Router } = require('express');
const auth = require('./../middlewares/auth.middleware');

// Create a new router
const router = new Router();

// Returns a list of available games a user can join
router.get('/games', auth, () => { throw new Error("Not Implemented Exception") });

// Creates a new game session
router.post('/games', auth, () => { throw new Error("Not Implemented Exception") });

// Accepts actions from a player
router.post('/games/:id', auth, () => { throw new Error("Not Implemented Exception") });

// The stream of the selected game. TODO: Check if POST or GET
router.get('/games/:id/stream', auth, () => { throw new Error("Not Implemented Exception") });

// Allows user to join the specified game
router.get('/games/:id/join', auth, () => { throw new Error("Not Implemented Exception") });

// Export the router
module.exports = router;
