const mariadb = require('mariadb');

// var dotenv = require('dotenv');
// dotenv.config();

const connectionParams = {
    host: process.env.MARIADB_HOST,
    port: process.env.MARIADB_PORT,
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE_NAME,
};

module.exports = { connectionParams };