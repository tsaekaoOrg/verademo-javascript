const mysql = require('mysql');
const util = require('util');

function getConnectionParams() {
    return {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE_NAME,
        connectionLimit: 10,
    }
};

const pool = mysql.createPool(getConnectionParams());
const query = util.promisify(pool.query).bind(pool);
const getConnection = util.promisify(pool.getConnection).bind(pool);

module.exports = { pool, query, getConnection };