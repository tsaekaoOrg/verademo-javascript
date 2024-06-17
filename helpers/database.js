const mariadb = require('mariadb');


const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 5
})

// connect and check for errors

pool.getConnection((err, connection) => {
    if(err)
    {
        console.log('error occurred');
    }
    if(connection) connection.release();

    return;
})

module.exports = pool;