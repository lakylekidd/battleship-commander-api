// Import required module
const jwt = require('jsonwebtoken');

// Retrieve the secret
const secret = process.env.JWT_SECRET || '(*FJKDOA#&U*(&u89e7fiUJ89vEIJ#89fIJGoy89erUG(*WRE)';

/**
 * Converts some data into a JWT token
 * @param {any} data The data to convert
 */
const toJwt = (data) => {
    return jwt.sign(data, secret, { expiresIn: '2h' })
}

/**
 * Translates a token back to data
 * @param {string} token The token to translate 
 */
const toData = (token) => {
    return jwt.verify(token, secret);
}

// Export the functions
module.exports = { toJwt, toData };