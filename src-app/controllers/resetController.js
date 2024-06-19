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

function showReset(req,res)
{
    console.log("Entering showReset");
    return res.render('reset',{});
}

function processReset(req,res)
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

    try:
        logger.info("Getting Database connection")
        # Get the Database Connection
        with connection.cursor() as cursor:
            with transaction.atomic():
                # Add the users
                logger.info("Preparing the Stetement for adding users")
                usersStatement = "INSERT INTO users (username, password, password_hint, created_at, last_login, real_name, blab_name) values ('%s', '%s', '%s', '%s', '%s', '%s', '%s');"
                if users[0].password == "21232f297a57a5a743894a0e4a801fc3":
                    logger.info("Encryption successful!")
                for user in users:
                    logger.info("Adding user " + user.username)
                    cursor.execute(usersStatement % (user.username, user.password, user.password_hint, user.created_at,
                                                     user.last_login, user.real_name, user.blab_name))

            # Add the listeners
            logger.info("Preparing the Statement for adding listeners")
            with transaction.atomic():
                listenersStatement = "INSERT INTO listeners (blabber, listener, status) values ('%s', '%s', 'Active');"
                for blabber in users[1:]:
                    for listener in users[1:]:
                        if rand.choice([False, True]) and (blabber != listener):
                            

                            logger.info("Adding " + listener.username + " as a listener of " + blabber.username)

                            cursor.execute(listenersStatement % (blabber.username, listener.username))    

            # Fetch pre-loaded Blabs
            logger.info("Reading blabs from file")
            with transaction.atomic():
                blabsContent = loadFile("blabs.txt")

                # Add the blabs
                logger.info("Preparing the Statement for adding blabs")
                blabsStatement = "INSERT INTO blabs (blabber, content, timestamp) values (%s, %s, datetime('now'));"
                for blabContent in blabsContent:
                    # Get the array offset for a random user
                    randomUserOffset = rand.randint(1,len(users) - 1)

                    # get the number or seconds until some time in the last 30 days.
                    #vary = rand.randint(0,(30 * 24 * 3600)+1)

                    username = users[randomUserOffset].username
                    logger.info("Adding a blab for " + username)
                    cursor.execute(blabsStatement, (username, blabContent))

            # Fetch pre-loaded Comments
            logger.info("Reading comments from file")
            commentsContent = loadFile("comments.txt")

            # Add the comments
            with transaction.atomic():
                logger.info("Preparing the Statement for adding comments")
                commentsStatement = "INSERT INTO comments (blabid, blabber, content, timestamp) values (%s, %s, %s, datetime('now'));"
                for i in range(len(blabsContent)):
                    # Add a random number of comment
                    count = rand.randint(0,5) # between 0 and 6

                    for j in range(count) :
                        # Get the array offset for a random user
                        randomUserOffset = rand.randint(1,len(users)-1) #removed +1 cause no admin,  removed -2 because no admin and inclusive.
                        username = users[randomUserOffset].username

                        # Pick a random comment to add
                        commentNum = rand.randint(0,len(commentsContent)-1)
                        comment = commentsContent[commentNum]

                        # get the number or seconds until some time in the last 30 days.
                        vary = rand.randint(0,(30 * 24 * 3600)+1)

                        logger.info("Adding a comment from " + username + " on blab ID " + str(i))

                        cursor.execute(commentsStatement, (i,username,comment))
        logger.info("Database Reset... Great Success!")   
    except sqlite3.IntegrityError as er:
         logger.error(er)
    except sqlite3.Error as ex :
        logger.error(ex.sqlite_errorcode, ex.sqlite_errorname)
    except Exception as e:
        logger.error("Unexpected error", e)
}

module.exports = {
    showReset,
    processReset,
}