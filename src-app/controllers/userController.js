const mariadb = require('mariadb');

function getLogin(req, res)
{
    res.render('login', {})
}

function showRegister(req, res)
{
    res.render('register',{});
}

function processRegister(req, res)
{
    processRegisterFinish(req, res);
}

function showRegisterFinish(req, res)
{

}

function processRegisterFinish(req, res)
{
    const pool = mariadb.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        connectionLimit: 5
    })
}

async function testFunc(req, res)
{
    let conn;
    try {
        console.log("creating DB Connection");
        conn = await mariadb.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: "blabs",
        });
        // Use Connection to get contacts data
        console.log("sending query")
        rows = await conn.query("SELECT username,password FROM blabs.users");
    
        //Print list of contacts
        for (i = 0; i < rows.length; i++) {
           console.log(`${rows[i].username} ${rows[i].password}` );
        }
    } catch(err)
    {
        // Manage Errors
        console.log(err);
    } finally {
        // Close Connection
        if(conn) conn.close();
    }
    return res.render('reset',{})
    
}

module.exports = { testFunc, getLogin }