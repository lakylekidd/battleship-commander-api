// Import required modules
const jwt = require('./../helpers/jwt');
const User = require('./../models/user.model');

/**
 * Retrieves an authorization token if it exists
 * and performs validation.
 * @param {Request} req The request
 * @param {Response} res The response
 * @param {NextAction} next The next action
 */
const authenticate = (req, res, next) => {
    // Request the headers to find the authorization
    const auth = req.headers.authorization && req.headers.authorization.split(' ');
    // Check if there is a bearer authorization included
    if (auth && auth[0] === 'Bearer' && auth[1]) {
        try {
            // Decrypt the data from the token
            const data = jwt.toData(auth[1]);
            // Locate the user record by id
            User.findByPk(data.userId)
                .then(user => {
                    // Check if a user was found
                    if (!user) return next('User does not exist');
                    // If user was found pass object to the request
                    req.user = user;
                    next();
                })
                .catch(next);

        } catch (error) {
            // User authorization details invalid
            res.status(400).send({
                message: `Error ${error.name}: ${error.message}`
            });
        }
    } else {
        // No authoriation details found return 401
        res.status(401).send({
            message: 'Not authorized to access this content without a username. Please specify a valid username.'
        })
    }
}

// Export the middleware
module.exports = authenticate;
