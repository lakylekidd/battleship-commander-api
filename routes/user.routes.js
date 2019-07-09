// Import required modules
const { Router } = require('express');
const userController = require('./../controllers/user.controller');

// Create a new router
const router = new Router();

// Logs in an existing user or creates a new one
router.post('/login', userController.loginOrRegister);

// Export the router
module.exports = router;