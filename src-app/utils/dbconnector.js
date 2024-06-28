const mysql = require('mysql');
const util = require('util');

function getConnectionParams() {
    return {
        host: process.env.MARIADB_HOST,
        port: process.env.MARIADB_PORT,
        user: process.env.MARIADB_USER,
        password: process.env.MARIADB_PASSWORD,
        database: process.env.MARIADB_DATABASE_NAME,
        connectionLimit: 10,
    }
};

const pool = mysql.createPool(getConnectionParams());
const query = util.promisify(pool.query).bind(pool);
const getConnection = util.promisify(pool.getConnection).bind(pool);

module.exports = { pool, query, getConnection };