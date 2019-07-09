// Import required modules
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
    // Get a list of all games where status is new
    Game.findAll({ where: { gameState: 0 } })
        .then(games => {
            // Return the list of games
            return res.status(200).send({
                total: games.length,
                games: games
            })
        })
        .catch(next)
}
/**
 * Action that creates a new game session
 * and sets requesting user as the owner
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