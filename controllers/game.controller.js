// Import required modules
const User = require('./../models/user.model');
const Game = require('./../models/game.model');
const Board = require('./../models/board.model');
const Tile = require('./../models/tile.model');
const Sse = require('json-sse')

/// Constant Game States
const gameStates = {
    new: 0,
    active: 1,
    closed: 2
}
/// Constant Difficulty Levels
const difficulties = {
    easy: 0,
    medium: 1,
    hard: 2
}

// Generate a board with tiles for specified game and user id
const generateBoardWithTiles = (gameId, userId) => {
    // Game Created, Create Board
    const board = {
        ready: false,
        winner: false,
        userId: userId,
        gameId: gameId
    }
    // Return the promise
    return Board.create(board)
        .then(createdBoard => {
            // Generate the tiles
            const tiles = generateTilesForBoard(createdBoard.id);
            return Tile.bulkCreate(tiles);
        });
}

// Function that generates the tiles for the specified board
const generateTilesForBoard = (boardId) => {
    // Define how big the board will be
    const size = 8;

    // Generate the tiles based on the difficulty level
    let tiles = [];
    let index = 0;
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            // Create a new tile at this index
            const tile = {
                index: index,
                posX: x,
                posY: y,
                occupied: false,
                targeted: false,
                boardId: boardId
            };
            // Push tile to the array
            tiles.push(tile);
            // Increment the index
            index++;
        }
    }
    // return the tiles
    return tiles;
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
    // Create the new game
    const newGame = {
        startDate: new Date(),
        difficulty: difficulties.easy,
        gameState: gameStates.new,
        userId: req.user.id
    }
    // Create the game
    Game
        .create(newGame)
        .then(createdGame => {
            // Game Created, Create Board
            generateBoardWithTiles(createdGame.id, req.user.id)
                .then(_ => {
                    console.log("OBJ CREATED: ", createdGame.id)
                    return res.status(201).send({
                        gameId: createdGame.id
                    })
                })
                .catch(next);
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

const stream = new Sse(null)
/**
 * Action that allows a player to subscribe to the game stream
 * just like the chat app sends all new messages to everybody
 */
const gameStream = (req, res, next) => {
    const gameId = req.params.id

    Game.findByPk(gameId, {include: [{all: true, nested: true}]})
        .then(response => {
            stream.init(req, res)
            const json = JSON.stringify(response)
            //Update the inital state of Sse
            stream.updateInit(json)
            //Notify the clients about the new data
            stream.send(json)            
        })
        .catch(next)
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