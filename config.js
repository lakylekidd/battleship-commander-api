// Export the configuration module
module.exports = {
    name: 'battleship-commader-api',
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    environment: process.env.NODE_ENV,
    url: (process.env.NODE_ENV === 'production' ? process.env.HOST : `localhost:${process.env.PORT || 5000}`)
}