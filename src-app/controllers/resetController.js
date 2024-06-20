const fs = require('fs');


const users = [
    create("admin", "admin", "Mr. Administrator"),
		create("john", "John", "John Smith"),
        create("paul", "Paul", "Paul Farrington"),
        create("chrisc", "Chris", "Chris Campbell"),
        create("laurie", "Laurie", "Laurie Mercer"),
        create("nabil", "Nabil", "Nabil Bousselham"),
        create("julian", "Julian", "Julian Totzek-Hallhuber"),
        create("joash", "Joash", "Joash Herbrink"),
        create("andrzej", "Andrzej", "Andrzej Szaryk"),
        create("april", "April", "April Sauer"),
        create("armando", "Armando", "Armando Bioc"),
        create("ben", "Ben", "Ben Stoll"),
        create("brian", "Brian", "Brian Pitta"),
        create("caitlin", "Caitlin", "Caitlin Johanson"),
        create("christraut", "Chris Trautwein", "Chris Trautwein"),
        create("christyson", "Chris Tyson", "Chris Tyson"),
        create("clint", "Clint", "Clint Pollock"),
        create("clyde", "Clyde", "Clyde Shtino"),
        create("cody", "Cody", "Cody Bertram"),
        create("derek", "Derek", "Derek Chowaniec"),
        create("eric", "Eric", "Eric Ghilani"),
        create("glenn", "Glenn", "Glenn Whittemore"),
        create("grant", "Grant", "Grant Robinson"),
        create("gregory", "Gregory", "Gregory Wolford"),
        create("jacob", "Jacob", "Jacob Martel"),
        create("jeremy", "Jeremy", "Jeremy Anderson"),
        create("johnny", "Johnny", "Johnny Wong"),
        create("kevin", "Kevin", "Kevin Rise"),
        create("kevinliu", "Kevin", "Kevin Liu"),
        create("scottrum", "Scott Rumrill", "Scott Rumrill"),
        create("stuart", "Stuart", "Stuart Sessions"),
        create("scottsim", "Scott Simpson", "Scott Simpson")
]

function reset(req, res) {
    if (req.method === "GET") {
        return showReset(req,res);
    }
    else if (req.method === "POST") {
        return processReset(req,res);
    }
    else {
        const response = await axios.get
    }
}

function showReset(req,res)
{
    console.log("Entering showReset");
    return res.render('reset',{});
}

async function processReset(req,res)
{
    const confirm = req.body.confirm;

    if (confirm == null)
    {
        res.locals.error = "Make sure to press confirm";
        return res.render(request, 'app/reset.html');
    }
    console.log("Entering processReset");

    // Drop existing tables and recreate from schema file
    // TODO: Implement Vulnerability (Shell Injection)
    // https://docs.python.org/2/library/subprocess.html#frequently-used-arguments
    manage = os.path.join(os.path.dirname(__file__), '../../manage.py')
    subprocess.run(["python3",manage,"flush","--noinput"], check=True)

    try {
        console.log("Getting Database connection...");
        await users.connect();
        // Adding the listeners
        console.log("Preparing the statement for adding users");
        const usersStatement = `INSERT INTO users (username, password, password_hint, created_at, last_login, real_name, blab_name)
        VALUES ($1,$2,$3,$4,$5,$6,$7)`;

        if (users[0].password == "21232f297a57a5a743894a0e4a801fc3") {
            console.log("Encryption successful!");
        }
        for (let users of users) {
            console.log("Adding user " + users.username);
            await client.query(usersStatement, [
                user.username, user.password, user.password_hint, user.created_at,
                user.last_login, user.real_name, user.blab_name
            ]);
        }
        console.log("Preparing the statement for adding listeners");
        const listenersStatement = `INSERT INTO listeners (blabber, listener)
        VALUES ($1,$2, 'Active')`;

        for (let blabber of users.slice(1)) {
            for (let listener of users.slice(1)) {
                if (random.boolean() && (blabber.username !== listener.username)) {
                    console.log("Adding listener " + blabber.username + " to " + listener.username);
                    await client.query(listenersStatement, [
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
        }

        // Fetch comments
        console.log("Reading comments from file");
        const commentsContent = fs.readFile("comments.txt");
        // Adding comments
        console.log("Preparing the statement for adding comments");
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
            }
        }
        console.log("Database Reset... Great Success!");
  
    } catch (e) {
        console.error("Unexpected Error:", e);
    }

    res.redirect('/reset');
}