// Import required modules
const jwt = require('./../helpers/jwt');
const User = require('./../models/user.model');



const getAvailableGames = (req, res, next) => {
    throw new Error("Not Implemented Exception");
}

const createNewGameSession = () => {
    throw new Error("Not Implemented Exception");
}

const fire = () => {
    throw new Error("Not Implemented Exception");
}

const gameStream = () => {
    throw new Error("Not Implemented Exception");
}

const join = () => {
    throw new Error("Not Implemented Exception");
}

// TO REMOVE
const login = (req, res, next) => {
    // Retrieve the email and password
    const { email, password } = req.body;
    // Check if email and password exist
    if (email && password) {
        // Find the usr based on email address
        User
            .findOne({
                where: { email: email }
            })
            .then(user => {
                // Check if user was not found
                if (!user) {
                    return res.status(400).send({
                        message: "A user with this e-mail address does not exist."
                    });
                }

                // Hash provided password and compare
                const pwCorrect = bcrypt.compareSync(password, user.password);
                // Check if comparison returned true
                if (pwCorrect) {
                    // Password was correct
                    // Return a JWT token with the user id
                    const token = jwt.toJwt({
                        userId: user.id
                    });
                    // Send back to client
                    return res.send({
                        jwt: token
                    })
                } else {
                    // Password was not correct
                    // Return 400
                    return res.status(400).send({
                        message: "The password was incorrect."
                    })
                }
            })
            .catch(err => {
                return res.status(500).send({
                    message: "Something went wrong. Please try again later!",
                    error: err
                })
            })


    } else {
        // Return invalid
        return res.status(400).send({
            message: "Please supply a valid email and password"
        })
    }
}

// TO REMOVE
const signup = (req, res, next) => {
    // Retrieve the email and password and confirmation
    const { email, password, password_confirmation } = req.body;

    // Check if passwords match
    if (password !== password_confirmation) return res.status(400).send({
        message: "Password and confirmation passwords do not match!"
    });

    // Check if e-mail is valid
    if (!validateEmail(email)) return res.status(400).send({
        message: "E-mail address is not valid!"
    });

    // Create the user account
    const account = {
        email: email,
        password: bcrypt.hashSync(password, salt)
    }

    // Check if user already exists
    // Not sure if it's alright to return a message
    // That informs user that this e-mail is already taken
    User.count({ where: { email: email } })
        .then(count => {
            // Check if at least one account exists
            // with the specified email
            if (count > 0) return res.status(422).send({
                message: "Cannot create account!"
            });

            // If code reached this far
            // Perform registration
            User.create(account)
                .then(user => {
                    // Remove password from user
                    const { email, id } = user;
                    // Return success with new user object
                    return res.status(201).json({ email, id });
                })
                .catch(err => {
                    // Cannot create user
                    return next(err);
                })
        })
        .catch(err => {
            // Cannot create user
            return next(err);
        })

}

// Export auth controller functions
module.exports = { getAvailableGames, createNewGameSession, fire, gameStream, join };