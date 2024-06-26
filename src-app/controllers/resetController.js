const moment = require('moment')
const fs = require('fs');
const axios = require('axios');
const mariadb = require('mariadb');
const dbconnector = require('../utils/dbconnector.js');
const User = require('../utils/User.js');
const readline = require('readline');


const users = [
        User.create("admin", "admin", "Mr. Administrator"),
		User.create("john", "John", "John Smith"),
        User.create("paul", "Paul", "Paul Farrington"),
        User.create("chrisc", "Chris", "Chris Campbell"),
        User.create("laurie", "Laurie", "Laurie Mercer"),
        User.create("nabil", "Nabil", "Nabil Bousselham"),
        User.create("julian", "Julian", "Julian Totzek-Hallhuber"),
        User.create("joash", "Joash", "Joash Herbrink"),
        User.create("andrzej", "Andrzej", "Andrzej Szaryk"),
        User.create("april", "April", "April Sauer"),
        User.create("armando", "Armando", "Armando Bioc"),
        User.create("ben", "Ben", "Ben Stoll"),
        User.create("brian", "Brian", "Brian Pitta"),
        User.create("caitlin", "Caitlin", "Caitlin Johanson"),
        User.create("christraut", "Chris Trautwein", "Chris Trautwein"),         
        User.create("christyson", "Chris Tyson", "Chris Tyson"),
        User.create("clint", "Clint", "Clint Pollock"),
        User.create("clyde", "Clyde", "Clyde Shtino"),
        User.create("cody", "Cody", "Cody Bertram"),
        User.create("derek", "Derek", "Derek Chowaniec"),
        User.create("eric", "Eric", "Eric Ghilani"),
        User.create("glenn", "Glenn", "Glenn Whittemore"),
        User.create("grant", "Grant", "Grant Robinson"),
        User.create("gregory", "Gregory", "Gregory Wolford"),
        User.create("jacob", "Jacob", "Jacob Martel"),
        User.create("jeremy", "Jeremy", "Jeremy Anderson"),
        User.create("johnny", "Johnny", "Johnny Wong"),
        User.create("kevin", "Kevin", "Kevin Rise"),
        User.create("kevinliu", "Kevin", "Kevin Liu"),
        User.create("scottrum", "Scott Rumrill", "Scott Rumrill"),
        User.create("stuart", "Stuart", "Stuart Sessions"),
        User.create("scottsim", "Scott Simpson", "Scott Simpson")
];


async function reset (req,res) {
    if (req.method === 'GET') {
        return showReset(req, res);
    } else if (req.method === 'POST') {
        return processReset(req, res);
    } else {
        try {
            const response = await axios.get('http://localhost/', {
                auth: {
                    username: 'thiswaskevinsidea',
                    password:  'hardcode'
                },
                validateStatus: function (status) {
                    return true; 
                }
            })
            return res.send(response.data);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Error occured during HTTP request');
        }
    }
}

function showReset(req,res)
{
    console.log("Entering showReset");
    return res.render('reset',{});
}

async function recreateDatabaseSchema() {
    /*console.log("Reading database schema from file");
    let schemaSQL = fs.readFileSync("blab_schema.sql", "utf8");

   
    connect = await mariadb.createConnection(dbconnector.getConnectionParams()); */

    // let filepath = path.join(__dirname, '../../blab_schema.sql');
    let filepath = 'blab_schema.sql';
    // let filepath = path.join(__dirname, '../../blab_schema.sql');
    let skipString = '--|\/\\*';
    skipString = skipString.replaceAll("(?=[]\\[+&!(){}^\"~*?:\\\\])", "\\\\");
    let regex = new RegExp("^(" + skipString + ").*?");
    // let filestring = fs.readFileSync(filepath);
    const filestream = fs.createReadStream(filepath);
    const rl = readline.createInterface({
        input: filestream,
        crlfDelay: Infinity,
    });
    let lines = []
    let filestring = '';
    for await (const line of rl) {
        if (!regex.test(line)) {
            filestring += line;
        }
    }
    lines = filestring.split(';')
    let connect;
    try {
        connect = await mariadb.createConnection(dbconnector.getConnectionParams());

        for (sql of lines) {
            sql = sql.trim();
            if (sql) {
                console.log("Executing: " + sql);
                await connect.query(sql);
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        try {
            if (connect) {
                await connect.close();
            }
        } catch (err) {
            console.error(err);
        }
    }


}
async function processReset(req,res) {

    let confirm = req.body.confirm;
    let primary = req.body.primary;

    console.log("Entering processReset");

    let connect = null;
    let usersStatement = null;
    let listenersStatement = null;
    let blabsStatement = null;
    let commentsStatement = null;
    let now =  moment().format("YYYY-MM-DD HH:mm:ss")




    // Drop existing tables and reUser.create from schema file
    await recreateDatabaseSchema();

    try {
        console.log("Getting Database connection");
        // Get the Database Connection
        // Class.forName("com.mysql.jdbc.Driver");
        connect = await mariadb.createConnection(dbconnector.getConnectionParams());
        // Adding users
        try {
            await connect.beginTransaction();
            try {
                console.log("Preparing the Statement for adding users");
                
                let usersStatement = await connect.prepare("INSERT INTO users (username, password, password_hint, created_at, last_login, real_name, blab_name) values (?, ?, ?, ?, ?, ?, ?);");
                
                for (u of users) {
                    console.log("Adding user " + u.getUserName());
                    await usersStatement.execute([u.getUserName(),
                        u.getPassword(),
                        u.getPasswordHint(),
                        u.getDateCreated(),
                        u.getLastLogin(),
                        u.getRealName(),
                        u.getBlabName()
                    ]);
                }
                await connect.commit();

            } catch (err) {
                console.error("Error loading data, reverting changes: ", err);
                await connect.rollback();
            }
            // Adding listeners
            try {
                console.log("Preparing the Statement for adding listeners");

                let listenersStatement = await connect.prepare("INSERT INTO listeners (blabber, listener, status) values (?, ?, 'Active');");
                for (let i = 1; i < users.length; i++) {
                    for (let j = 1; j < users.length; j++) {
                        let randomUser = users[Math.floor(Math.random() * (users.length - 1)) + 1];
                        if (Math.random() < 0.5 && randomUser !== users[i]) {
                            let blabber = users[i].getUserName();
                            let listener = randomUser.getUserName();
                            console.log("Adding " + listener + " as a listener of " + blabber);
                            await listenersStatement.execute([blabber, listener]);
                        }
                    }
                }
                await connect.commit();
            } catch (err) {
                console.error("Error loading data, reverting changes: ", err);
                await connect.rollback();
            }
            // Adding blabs
        } catch (err) {
            console.error(err);
        }
    } catch (err) {
        console.error(err);
    }
    console.log(connect);
        
    res.redirect('/reset');
}
/*
    const confirm = req.body.confirm;

    if (confirm == null)
    {
        res.locals.error = "Make sure to press confirm";
        return res.render(request, 'app/reset.html');
    }
    console.log("Entering processReset");

    // Drop existing tables and reUser.create from schema file
    // TODO: Implement Vulnerability (Shell Injection)
    // https://docs.python.org/2/library/subprocess.html#frequently-used-arguments
    
    try {
        console.log("Getting Database connection...");
        let connection = await mariadb.User.createConnection(dbconnector.getConnectionParams());
        // Adding the listeners
        console.log("Preparing the statement for adding users");
        const userDetails = User.create();
        const { username, password, password_hint, User.created_at, last_login, real_name, blab_name } = userDetails;

        const usersStatement = `INSERT INTO users (username, password, password_hint, User.created_at, last_login, real_name, blab_name) 
        VALUES ('${username}', '${password}', '${password_hint}', '${User.created_at}', '${last_login}', '${real_name}', '${blab_name}');`;

        if (users[0].password == "21232f297a57a5a743894a0e4a801fc3") {
            console.log("Encryption successful!");
        }
        
        console.log("Adding user " + users.username);
        await connection.query(usersStatement);
        
        console.log("Preparing the statement for adding listeners");
        const listenersStatement = `INSERT INTO listeners (blabber, listener)
        VALUES ($1,$2, 'Active')`;

        for (let blabber of users.slice(1)) {
            for (let listener of users.slice(1)) {
                if (random.boolean() && (blabber.username !== listener.username)) {
                    console.log("Adding listener " + blabber.username + " to " + listener.username);
                    await connection.query(listenersStatement, [
                        blabber.username, listener.username
                    ]);
                }
            }
        }
        // Fetching blabs that are pre-loaded
        console.log("Reading blabs from file");
        const blabsContent = fs.readFile("blabs.txt");
        // Adding blabs
        console.log("Preparing the statement for adding blabs");
        const blabsStatement = `INSERT INTO blabs (blabber, content, timestamp)
        VALUES (?,?, datetime('now'))`;

        for (let blabContent of blabsContent) {
            const randomUserOffset = Math.floor(Math.random() * (users.length -1)) + 1;
            const username = users[randomUserOffset].username;
            console.log("Adding blab for " + username);
            await connection.query(blabsStatement, [username, blabContent]);
        }

        // Fetch comments
        console.log("Reading comments from file");
        const commentsContent = fs.readFile("comments.txt");
        // Adding comments
        console.log("Preparing the statement for adding commqents");
        const commentsStatement = `INSERT INTO comments (blabber, content, timestamp)
        VALUES (?,?, datetime('now'))`;

        for (let i = 0; i < blabsContent.length; i++) {
            const count = Math.floor(Math.random() * 6);
            for (let j = 0; j < count; j++) {
                const randomUserOffset = Math.floor(Math.random() * (users.length -1)) + 1;
                const username = users[randomUserOffset].username;
                const commentNum = Math.floor(Math.random() * commentsContent.length);
                const comment = commentsContent[commentNum];
                console.log("Adding a comment from " + username + " on blab ID " + i);
                await connection.query(commentsStatement, [username, comment]);
            }
        }
        console.log("Database Reset... Great Success!");
    } catch (e) {
        console.error("Unexpected Error:", e);
    }

    res.redirect('/reset');*/


module.exports = { showReset, processReset };
