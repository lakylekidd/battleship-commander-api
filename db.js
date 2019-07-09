// Import required models
const Sequelize = require('sequelize');
const config = require('./config');
const databaseUrl = config.DATABASE_URL;

// Create a new instance of sequelize
const sequelize = new Sequelize(databaseUrl);

// Sync the data (create schemas)
sequelize.sync()
    .then(r => {
        // Log success
        console.log('Database schema created!');
    })
    .catch(console.log);

// Export the sequelize instance
module.exports = sequelize;
