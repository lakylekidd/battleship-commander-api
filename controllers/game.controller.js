// Import required modules
const User = require('./../models/user.model');
const Game = require('./../models/game.model');

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
const createNewGameSession = () => {
    throw new Error("Not Implemented Exception");
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