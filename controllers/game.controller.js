// Import required modules
const jwt = require('./../helpers/jwt');
const User = require('./../models/user.model');
const Game = require('./../models/game.model');

const gameStates = {
    new: 0,
    active: 1,
    closed: 2
}

const difficulties = {
    easy: 0,
    medium: 1,
    hard: 2
}

/**
 * Action that returns a list of all available
 * games (gameState === 0)
 */
const getAvailableGames = (req, res, next) => {
    throw new Error("Not Implemented Exception");
}
/**
 * Action that creates a new game session
 * and sets requesting user as the owner
 * 
 * "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsInVzZXJuYW1lIjoicGVkcm8iLCJpYXQiOjE1NjI2Nzk0NTAsImV4cCI6MTU2MjY4NjY1MH0.gGpeFAC6o-d-5s4Y-r3fZh6snLBbOiwWpkdsW6h8I1I"
 * Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsInVzZXJuYW1lIjoicGVkcm8iLCJpYXQiOjE1NjI2Nzk0NTAsImV4cCI6MTU2MjY4NjY1MH0.gGpeFAC6o-d-5s4Y-r3fZh6snLBbOiwWpkdsW6h8I1I"
 */
const createNewGameSession = (req, res, next) => {
    const newGame = {
        startDate: new Date(),
        difficulty: difficulties.easy,
        gameState: gameStates.new,
        userId: req.user.id
    }

    Game
        .create(newGame)
        .then(createdGame => {
            res.status(201).send(createdGame)
        })
        .catch(err => next(err))
}
/**
 * Action that performs a fire event of a user
 * towards his opponent.
 */
const fire = () => {
    throw new Error("Not Implemented Exception");
}
/**
 * Action that allows a player to subscribe to the game stream
 * just like the chat app sends all new messages to everybody
 */
const gameStream = () => {
    throw new Error("Not Implemented Exception");
}
/**
 * Action that allows a player to join a new game
 * Only allow user to join if game is still active
 */
const join = () => {
    throw new Error("Not Implemented Exception");
}

// Export auth controller functions
module.exports = { getAvailableGames, createNewGameSession, fire, gameStream, join };