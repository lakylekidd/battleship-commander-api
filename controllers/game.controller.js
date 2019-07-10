// Import required modules
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
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

//Create Board for User2
const createBoard2 = (gameId, userId) => {
    generateBoardWithTiles(gameId, userId)
        .then(board2 => {
            Game.findByPk(gameId)
                .then(gameJoined => {
                    gameJoined
                        .update({ gameState: 1 })
                        .then(response => res
                            .status(201)
                            .send({ gameId })
                        )
                        .catch(next)
                })
                .catch(next)
        })
        .catch(next);
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
    // Check if user is already used in another new or active game
    // Get a list of new or active games and check if any of them contain
    // a user id equal to the user id of the user attempting to create a new game
    Game.findAll({
        include: [{
            model: Board,
            where: { userId: req.user.id }
        }],
        where: {
            gameState: {
                [Op.or]: [gameStates.new, gameStates.active]
            }
        }
    })
        .then(result => {
            // Check if any games are returned
            // If there are, that means the user is already participating
            // in a new or active game so deny the creation
            if (result.length > 0) {
                return res.status(400).send({
                    message: "Please specify a new username. This username is already in use!"
                })
            } else {
                // Otherwise user is not currently participating anywhere
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
                                console.log("New Game Created: ", createdGame.id)
                                return res.status(201).send({
                                    gameId: createdGame.id
                                })
                            })
                            .catch(next);
                    })
                    .catch(err => next(err))
            }
        })
        .catch(next);
}
/**
 * Action that performs a fire event of a user
 * towards his opponent.
 */
const fire = (req, res, next) => {
    const boardId = req.body.id
    const tileIdx = req.body.index
    const thisUser = req.user.id

    // Check if user is part of this game
    Board
        .findByPk(boardId)
        .then(board => {
            //Check if Im not the owner of that board
            if (board.userId !== thisUser) {
                //Check If there is a board in that game where I am part of-
                Board.findOne({
                    where: {
                        gameId: board.gameId,
                        userId: thisUser
                    }
                })
                    .then(result => {
                        if (result) {
                            Tile
                                .findOne({
                                    where: {
                                        boardId: boardId,
                                        index: tileIdx
                                    }
                                })
                                .then(tile => {
                                    tile.update({ targeted: true })
                                    res.send({ message: "Tile Targeted!" })
                                })
                        }
                    })
                    .catch(next)
            }
        })
        .catch(next)
}

const stream = new Sse(null)
/**
 * Action that allows a player to subscribe to the game stream
 * just like the chat app sends all new messages to everybody
 */
const gameStream = (req, res, next) => {

    const gameId = req.params.id

    Game.findByPk(gameId, { include: [{ all: true, nested: true }] })
        .then(response => {

            console.log(response);

            stream.init(req, res)
            const json = JSON.stringify(response)
            //Update the inital state of Sse
            stream.updateInit(json)
            //Notify the clients about the new data
            stream.send(json);
        })
        .catch(next)
}
/**
 * Action that allows a player to join a new game
 * Only allow user to join if game is still active
 */
const join = (req, res, next) => {
    const gameId = req.params.id
    const userId = req.user.id

    //Check if the user that tries to join is different from the one who creates the game.
    Game.findOne(gameId)
        .then(game => {
            if (userId !== game.userId) {
                createBoard2(gameId, userId)
            } else {
                res.send({ message: 'You are trying to get in the same game you created, Please choose a new one.' })
            }
        })
        .catch(next)
}

// Export auth controller functions
module.exports = { getAvailableGames, createNewGameSession, fire, gameStream, join };