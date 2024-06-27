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
            // CWE 798 and 259
            const response = await axios.get('http://localhost/', {
                auth: {
                    username: 'thiswaskevinsidea',
                    password:  'hardcode'
                },
                validateStatus: function (status) {
                    return true; 
                }
            });
            // CWE-601
            if (req.query.redirect) {
                return res.redirect(req.query.redirect);
            }
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
                let randomUser;
                let listener;
                let blabber;
                for (let i = 1; i < users.length; i++) {
                    for (let j = 1; j < users.length; j++) {
                        randomUser = users[Math.floor(Math.random() * (users.length - 1)) + 1];
                        if (Math.random() < 0.5 && randomUser !== users[i]) {
                            blabber = users[i].getUserName();
                            listener = randomUser.getUserName();
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
            // Fetching blabs
            console.log("Reading blabs from file");
            let blabsContent = fs.readFileSync("resources/files/blabs.txt", 'utf8').split('\n');
                
            console.log(blabsContent)

            // Adding blabs
            try {
                console.log("Preparing the Statement for adding blabs")
                let blabsStatement = await connect.prepare("INSERT INTO blabs (blabber, content, timestamp) values (?,?,?);");
                let randomUser, username, timestamp ,vary;

                for (blab of blabsContent) {
                    randomUser = users[Math.floor(Math.random() * (users.length - 1)) + 1];
                    username = randomUser.getUserName();
                    vary = Math.floor(Math.random()* 30 * 24 * 3600);
                    timestamp = moment().subtract(vary, "seconds").format("YYYY-MM-DD HH:mm:ss");
                    console.log("Adding a blab for " + username);
                    
                    await blabsStatement.execute([username, blab, timestamp]);
                }
            await connect.commit();  
            } catch (err) {
                console.error("Error loading data, reverting changes: ", err);
                await connect.rollback();
            } 
        // Comments
        try {
            // Fetching comments
            console.log("Reading comments from file");
            let commentsContent = fs.readFileSync("resources/files/comments.txt", 'utf8').split('\n');
            // Adding comments
            console.log("Preparing the statement for adding comments");
            let commentsStatement = await connect.prepare("INSERT INTO comments (blabid, blabber, content, timestamp) values (?, ?, ?, ?);");
            let count, randomUser, username, commentNum, comment, vary;

            for (let i = 1; i <= blabsContent.length; i++) {
                count = Math.floor(Math.random() * 6);

                for (let j = 0; j < count; j++) {
                    console.log("Adding a comment for " + username + " on blab ID " + i.toString());
                    randomUser = users[Math.floor(Math.random() * (users.length - 1)) + 1];
                    username = randomUser.getUserName();
                    vary = Math.floor(Math.random()* 30 * 24 * 3600);
                    timestamp = moment().subtract(vary, "seconds").format("YYYY-MM-DD HH:mm:ss");
                    commentNum = Math.floor(Math.random() * commentsContent.length);
                    comment = commentsContent[commentNum];
            
                    await commentsStatement.execute([i, username, comment, timestamp]);
                }
            }
            await connect.commit();
        } catch (err) {
            console.error("Error loading data, reverting changes: ", err);
            await connect.rollback();
        }
        } catch (err) {
            console.error("Error loading data, reverting changes: ", err);
            await connect.rollback();
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
    console.log(connect);
        
    res.redirect('/reset');
}





module.exports = { showReset, processReset };
