const mariadb = require('mariadb');

function getConnectionParams() {
    return {
        host: process.env.MARIADB_HOST,
        port: process.env.MARIADB_PORT,
        user: process.env.MARIADB_USER,
        password: process.env.MARIADB_PASSWORD,
        database: process.env.MARIADB_DATABASE_NAME,
    }
};

module.exports = { getConnectionParams };