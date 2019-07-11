// Import required modules
const jwt = require('./../helpers/jwt');
const User = require('./../models/user.model');

// Generates a new token
const generateToken = (userId, username) => {
    return jwt.toJwt({
        userId: userId,
        username: username
    });
}

/**
 * Action that checks if a username already exists or
 * creates a new one and returns a token with userID and username
 */
const loginOrRegister = (req, res, next) => {
    // Check if the user passed a username
    const { username } = req.body;
    if (!username) return res.status(404).send({
        message: "Please specify a valid username to proceed!"
    });

    // Check if user exists in the database
    return User.findOne({ where: { username: username } })
        .then(user => {
            // Check if user was not found
            if (!user) {
                // User not found, create a new one
                User.create({ username: username })
                    .then(u => {
                        // Set status 201 :: user created
                        return res.status(201).send({
                            // Generate the token and return it
                            jwt: generateToken(u.id, username),
                            userId: u.id
                        });
                    })
                    .catch(err => {
                        // User not created, return error
                        return res.status(500).send({
                            message: "Cannot create user. Please try again later"
                        })
                    });
            } else {
                // Valid user exists, generate token and return it
                // Return a JWT token with the user id and username
                return res.status(200).send({
                    // Generate the token and return it
                    jwt: generateToken(user.id, username)
                });
            }
        })
        .catch(e => next(e));
}

// Export auth controller functions
module.exports = { loginOrRegister };