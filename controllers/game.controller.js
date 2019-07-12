// Import required modules
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Game = require('./../models/game.model');
const Board = require('./../models/board.model');
const Tile = require('./../models/tile.model');
const User = require('./../models/user.model');
const Sse = require('json-sse');

// Object that holds all the available streams
// Based on the stream index which is defined
// by the game id
const streams = {
}

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
    Game.findAll({
        include: [User],
        where:
        {
            gameState: gameStates.new,
        }
    })
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
                    userId: req.user.id,
                    userTurn: req.user.id
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
    // Retrieve the required variables
    const boardId = req.body.boardId
    const tileId = req.body.tileId
    const thisUser = req.user.id

    // Retrieve the board
    Board.findByPk(boardId, { include: [{ all: true, nested: true }] })
        .then(board => {
            // Check if it's actually the usern's turn to play
            if (board.userTurn !== thisUser) return res.status(400).send({
                message: "It's not your turn to play! Wait for your turn!"
            });

            // If it's user's turn then set the tile to fire
            // but only if tile has not been fired upon yet
            Tile.update(
                { targeted: true },
                {
                    returning: true,
                    where: {
                        index: tileId,
                        boardId: boardId,
                        targeted: false
                    }
                }
            )
                .then((result, updated) => {
                    // Retrieve opponent ID
                    const opponentId = board.game.boards.find(board => board.user.id !== thisUser);

                    // Update the board turn to opponent
                    Game.update(
                        { userTurn: opponentId },
                        {
                            where: { id: gameId }
                        }
                    )
                        .then((resul, updated) => {
                            // Update the stream
                            updateStream(gameId, req, res, next, true, false);
                            // Respond success
                            return res.status(200).send({
                                message: "Target hit!"
                            })
                        })
                        .catch(next);
                })
                .catch(next);
        })
        .catch(next);
}
/**
 * Action that allows a player to subscribe to the game stream
 * just like the chat app sends all new messages to everybody
 */
const gameStream = (req, res, next) => {
    // Retrieve the game ID and the stream
    const gameId = req.params.id
    const participant = req.headers.asParticipant || true;
    // Update the current game room stream
    updateStream(gameId, req, res, next, participant);
}
/**
 * Action that allows a player to join a new game
 * Only allow user to join if game is still active
 */
const join = (req, res, next) => {
    // Retrieve required variables
    const gameId = req.params.id
    const userId = req.user.id

    // Locate the game based on game ID
    Game.findByPk(gameId, {
        where: {
            gameState: gameStates.new
        }
    })
        .then(game => {
            // Check if game was found
            if (!game) return res.status(404).send({
                message: "Cannot join current game! Please select another or create a new one"
            });

            // Check if the user that tries to join is different from the one who creates the game.
            if (userId !== game.userId) {
                // If user is different than the one who
                // created this game session, generate his board
                generateBoardWithTiles(gameId, userId)
                    .then(_ => {
                        // Second board generated successfully
                        // Update current game state to active
                        Game.update(
                            { gameState: gameStates.active },
                            {
                                returning: true,
                                where: { id: gameId }
                            }
                        )
                            .then((r, u) => {
                                // Game Updated
                                return res.status(201).send({
                                    gameId: game.id
                                })
                            })
                            .catch(next);
                    })
                    .catch(next);
            } else {
                res.send({ message: 'You are trying to get in the same game you created, Please choose a new one.' })
            }
        })
        .catch(next)
}
/**
 * Specifies that the current board is ready to play. 
 * Fires an event to the stream notifying all the clients.
 */
const ready = (req, res, next) => {
    // Retrieve necessary variables
    const { id, boardId } = req.params;
    const userId = req.user.id;
    // Retrieve the required board
    Board.findByPk(boardId)
        .then(board => {
            // Check if a board was found
            if (!board) return res.status(404).res({
                message: `The battle board with id ${boardId} was not found.`
            });

            // Check if the user is the owner of this board
            if (board.userId !== userId) return res.status(401).res({
                message: `You do not have permission to modify this board.`
            });

            // Update the state of the board
            Board.update(
                { ready: true },
                {
                    returning: true,
                    where: { id: boardId }
                }
            )
                .then((result, updated) => {
                    // Inform all game room clients for the update
                    updateStream(id, req, res, next, true, false);
                    // Return success
                    return res.status(200);
                })
                .catch(next);
        })
        .catch(next);
}
/**
 * Places a ship on the specified board and tile 
 * index of the user at a specified orientation.
 */
const placeShip = (req, res, next) => {
    // Retrieve necessary variables
    const { boardId, tileId, shipSize, orientation } = req.body;
    // Retrieve the required tile
    Tile.findByPk(tileId, { include: [{ all: true, nested: true }] })
        .then(tile => {
            // Check if a board was found
            if (!tile) return res.status(404).res({
                message: `The battle board tile with id ${tileId} was not found.`
            });

            // Check if the user is the owner of this board
            if (tile.board.userId !== userId) return res.status(401).res({
                message: `You do not have permission to modify this board tile.`
            });

            // Check if tile belongs to determined board
            if (tile.boardId !== boardId) return res.status(400).res({
                message: `This game board tile does not belong to the predetermined board.`
            });

            // Retrieve current value of the tile
            const val = tile.occupied;

            // Update the tile
            Tile.update(
                { occupied: !val },
                {
                    returning: true,
                    where: { id: tileId }
                }
            )
                .then((result, updated) => {
                    // Update the stream
                    updateStream(gameId, req, res, next, true, false);
                    // Return success
                    return res.status(200).send({
                        message: `Game board tile ${val ? 'occupied' : 'unoccupied'}`
                    })
                })
                .catch(next);
        })
        .catch(next);
}
/**
 * Updates all the clients of the specified game room
 * @param {String} gameId The game id
 */
const updateStream = (gameId, req, res, next, participant = true, sendStream = true) => {
    // Retrieve the game ID and the stream
    const userId = req.user.id;

    // Locate the game and send it to the given stream
    Game
        .findByPk(gameId, { include: [{ all: true, nested: true }] })
        .then(game => {
            // Get the current game stream
            const currentStreamData = streams[gameId];
            // Stringify the game object
            const json = JSON.stringify(game);

            console.log("Found game")

            // Check if the stream exists
            if (currentStreamData) {
                console.log("Stream already exists")
                // Stream exists
                // Check if the client is already a participant member of the stream
                if (!currentStreamData.clients.includes(client => client.id === userId)) {
                    // Client is not part of the clients
                    // Add the client
                    currentStreamData.clients.push({ id: userId, participant });
                    console.log("Add client to clients slist")
                }
                // Initialize the stream for this client
                currentStreamData.stream.init(req, res);
                // Update the inital state of Sse
                currentStreamData.stream.updateInit(json);
                console.log("Update stream")

                // Check if stream needs to be sent
                if (sendStream) {
                    console.log("send stream")

                    // Notify the clients about the new data
                    currentStreamData.stream.send(json);
                }

            } else {
                // Stream does not exists
                // Create it
                const newStreamData = {
                    clients: [
                        { id: userId, participant }
                    ],
                    stream: new Sse(json)
                }
                // Add the streams to the streams object
                streams[gameId] = newStreamData;
                // Initialize the stream for this client
                newStreamData.stream.init(req, res);
                if (sendStream) {
                    // Notify the clients about the new data
                    newStreamData.stream.send(json);
                }
            }
        })
        .catch(next);
}

// MAYBE UNECESSARY
const exitGame = (req, res, next) => {
    // Retrieve required variables
    const gameId = req.params.id;
    const userId = req.user.id;

    // Locate the game
    Game.update(
        { gameState: gameStates.closed },
        {
            returning: true,
            where: { id: gameId }
        }
    )
        .then((results, updated) => {
            // Retrieve the updated game
            const game = results[0];

            // include message field in game
            const gameWithMessage = {
                ...game,
                message: "User exited the game!",
                status: 0
            }

            // Games have been updated, inform users connected to game
            const json = JSON.stringify(game)
            //Update the inital state of Sse
            stream.updateInit(json)
            //Notify the clients about the new data
            stream.send(json);
        })
        .catch(err => {
            // There was a server error,
            // Tell all clients to exit game 
            const noGameWithMessage = {
                message: "User exited the game!",
                status: 0
            }
            // Send response
            return res.status(500).send(noGameWithMessage);
        })
}

// Export auth controller functions
module.exports = { ready, placeShip, getAvailableGames, createNewGameSession, fire, gameStream, join, exitGame };