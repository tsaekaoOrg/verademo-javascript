const fs = require('fs');
<<<<<<< HEAD
const axios = require('axios');
const crypto = require('crypto');
=======
const User = require('../utils/User.js');
>>>>>>> e0e0f71996a51bc4d5a32ef21d7d726f7a23d045
const mariadb = require('mariadb');
const dbconnector = require('../utils/dbconnector.js');
const User = require('../utils/User.js');

const usersStatementSQL = 'INSERT INTO users (username, password, real_name) values (?, ?, ?)'

<<<<<<< HEAD


=======
>>>>>>> e0e0f71996a51bc4d5a32ef21d7d726f7a23d045
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

async function processReset(req,res)
{

    console.log("Entering processReset");

    let connect = null;
    let usersStatement = null;
    let listenersStatement = null;
    let blabsStatement = null;
    let commentsStatement = null;
    //java.util.Date now = new java.util.Date();


    // Drop existing tables and reUser.create from schema file
    // recreateDatabaseSchema();

    try {
        console.log("Getting Database connection");
        // Get the Database Connection
        // Class.forName("com.mysql.jdbc.Driver");
        connect = await mariadb.createConnection(dbconnector.getConnectionParams());

        console.log(connect);
        // connect.setAutoCommit(false);

        // Add the users
        usersStatement = await connect.prepare(usersStatementSQL);
        console.log("Preparing the Statement for adding users");
        await usersStatement.execute(
            'INSERT INTO users (username, password, realName) VALUES (?, ?, ?)',
            [users.getUserName(), users.getPassword(), users.getRealName()]
        );

       //const usersStatement = await connect.prepare("INSERT INTO users (username, password, password_hint, created_at, last_login, real_name, blab_name) values (?, ?, ?)");

        
            //console.log("Adding user " + users[i].getUserName());
            for (item of usersStatement) {
                
            }

			/*setString(usersStatement, 1, users[i].getUserName());
			setString(usersStatement, 2, users[i].getPassword());
			setString(usersStatement, 3, users[i].getPasswordHint());
			usersStatement.setTimestamp(4, users[i].getDateCreated());
			usersStatement.setTimestamp(5, users[i].getLastLogin());
			usersStatement.setString(6, users[i].getRealName());
			usersStatement.setString(7, users[i].getBlabName());*/

			//usersStatement.executeUpdate();

        
        connect.commit();

        // Add the listeners
        console.log("Preparing the Statement for adding listeners");
        listenersStatement = connect
                .prepareStatement("INSERT INTO listeners (blabber, listener, status) values (?, ?, 'Active');");
        for (let i = 1; i < users.length; i++) {
            for (let j = 1; j < users.length; j++) {
                if (Math.random() < 0.5 && i !== j) {
                    let blabber = users.username;
                    let listener = users.username;

                    console.log("Adding " + listener + " as a listener of " + blabber);

                    listenersStatement.setString(1, blabber);
                    listenersStatement.setString(2, listener);

                    listenersStatement.executeUpdate();
                }
            }
        }
        connect.commit();

        // Fetch pre-loaded Blabs
        console.log("Reading blabs from file");
        let blabsContent = fs.readFile("blabs.txt");

        // Add the blabs
        console.log("Preparing the Statement for adding blabs");
        blabsStatement = connect
                .prepareStatement("INSERT INTO blabs (blabber, content, timestamp) values (?, ?, ?);");
        for (let blabContent in blabsContent) {
            // Get the array offset for a random user, except admin who's offset 0.
            const randomUserOffset = Math.floor(Math.random() * (users.length - 2)) + 1;


            // get the number or seconds until some time in the last 30 days.
            let vary = Math.floor(Math.random() * (30 * 24 * 3600));
            

            let username = users[randomUserOffset].username;
            console.log("Adding a blab for " + username);
            let timestamp = new Date(Date.now() - (vary * 1000));
            blabsStatement.setTimestamp(3, timestamp);


            blabsStatement.setString(1, username);
            blabsStatement.setString(2, blabContent);
            blabsStatement.setTimestamp(3, new timestamp(now.getTime() - (vary * 1000)));

            blabsStatement.executeUpdate();
        }
        connect.commit();

        // Fetch pre-loaded Comments
        console.log("Reading comments from file");
        const commentsContent = fs.readFile("comments.txt");

        // Add the comments
        console.log("Preparing the Statement for adding comments");
        commentsStatement = connect.prepareStatement(
                "INSERT INTO comments (blabid, blabber, content, timestamp) values (?, ?, ?, ?);");
        for (let i = 1; i <= blabsContent.length; i++) {
            // Add a random number of comment
            let count = rand.nextInt(6); // (between 0 and 6)

            for (let j = 0; j < count; j++) {
                // Get the array offset for a random user, except admin who's offset 0.
                let randomUserOffset = Math.floor(Math.random() * (users.length - 2)) + 1;
                let username = users[randomUserOffset].getUserName();

                // Pick a random comment to add
                let commentNum = Math.floor(Math.random() * commentsContent.length);
                let comment = commentsContent[commentNum];

                // get the number or seconds until some time in the last 30 days.
                let vary = Math.floor(Math.random() * (30 * 24 * 3600));

                console.log("Adding a comment from " + username + " on blab ID " + String.valueOf(i));
                commentsStatement.setInt(1, i);
                commentsStatement.setString(2, username);
                commentsStatement.setString(3, comment);
                commentsStatement.setTimestamp(4, new Timestamp(now.getTime() - (vary * 1000)));

                commentsStatement.executeUpdate();
            }
        }
        connect.commit();
    } catch (err) {
        console.error(err);
    } finally {
        try {
            if (usersStatement) {
                await usersStatement.close();
            }
        } catch (err) {
            console.error(err);
        }
        try {
            if (listenersStatement) {
                await listenersStatement.close();
            }
        } catch (err) {
            console.error(err);
        }
        try {
            if (blabsStatement) {
                await blabsStatement.close();
            }
        } catch (err) {
            console.error(err);
        }
        try {
            if (commentsStatement) {
                commentsStatement.close();
            }
        } catch (err) {
            console.error(err);
        }
        try {
            if (connect) {
                await connect.close();
            }
        } catch (err) {
            console.error(err);
        }
    }

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
