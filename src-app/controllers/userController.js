const mariadb = require('mariadb');

async function showLogin(req, res) {
    try {
        var target = req.query.target;
        var username = req.query.username;

        if (req.session.username) {
            if (target) {
                return res.redirect(target);
            } else {
                return res.redirect('feed');
            }
        }

        var user = UserFactory.createFromRequest(httpRequest);
		if (user != null) {
            req.session.user = user.username;
			console.log("User is remembered - redirecting...");
			if (target) {
				return res.redirect(target);
			} else {
				// default to user's feed
				return res.redirect('feed');
			}
		} else {
			console.log("User is not remembered");
		}

		if (!username) {
			username = "";
		}

		if (!target) {
			target = "";
		}

        return res.render('login', {username, target});
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}

async function processLogin(req, res) {
    var username = req.body.user
    var password = req.body.password
    var remember = req.body.remember
    var target = req.body.target

    try {
        // Determine eventual redirect. Do this here in case we're already logged in
		var nextView;
		if (target) {
			nextView = res.redirect(target);
		} else {
			// default to user's feed
			nextView = res.redirect("feed");
		}

		var connect = null;
		/* START BAD CODE */
		var sqlStatement = null;
		/* END BAD CODE */
		/* START GOOD CODE
		PreparedStatement sqlStatement = null;
        /* END GOOD CODE */
		// try {
		// 	// Get the Database Connection
		// 	logger.info("Creating the Database connection");
		// 	Class.forName("com.mysql.jdbc.Driver");
		// 	connect = DriverManager.getConnection(Constants.create().getJdbcConnectionString());


		// 	/* START BAD CODE */
		// 	// Execute the query
		// 	logger.info("Creating the Statement");
		// 	String sqlQuery = "select username, password, password_hint, created_at, last_login, real_name, blab_name from users where username='"
		// 			+ username + "';";
		// 	sqlStatement = connect.createStatement();
		// 	logger.info("Execute the Statement");
		// 	ResultSet result = sqlStatement.executeQuery(sqlQuery);
		// 	/* END BAD CODE */
		// 	/* START GOOD CODE
		// 	String sqlQuery = "select * from users where username=? and password=?;";
		// 	logger.info("Preparing the PreparedStatement");
		// 	sqlStatement = connect.prepareStatement(sqlQuery);
		// 	logger.info("Setting parameters for the PreparedStatement");
		// 	sqlStatement.setString(1, username);
		// 	sqlStatement.setString(2, password);
		// 	logger.info("Executing the PreparedStatement");
		// 	ResultSet result = sqlStatement.executeQuery();
		// 	/* END GOOD CODE */



		// 	// Did we find exactly 1 user that matched?
		// 	if (result.first() && BCrypt.checkpw(password, result.getString("password"))) {
		// 		logger.info("User Found.");
		// 		// Remember the username as a courtesy.
		// 		Utils.setUsernameCookie(response, result.getString("username"));

		// 		// If the user wants us to auto-login, store the user details as a cookie.
		// 		if (remember != null) {
		// 			User currentUser = new User(result.getString("username"), result.getString("password_hint"),
		// 					result.getTimestamp("created_at"), result.getTimestamp("last_login"),
		// 					result.getString("real_name"), result.getString("blab_name"));

		// 			UserFactory.updateInResponse(currentUser, response);
		// 		}

		// 		Utils.setSessionUserName(req, response, result.getString("username"));

		// 		// Update last login timestamp
		// 		PreparedStatement update = connect.prepareStatement("UPDATE users SET last_login=NOW() WHERE username=?;");
		// 		update.setString(1, result.getString("username"));
		// 		update.execute();
		// 	} else {
		// 		// Login failed...
		// 		logger.info("User Not Found");
		// 		model.addAttribute("error", "Login failed. Please try again.");
		// 		model.addAttribute("target", target);
		// 		nextView = "login";
		// 	}
		// } catch (SQLException exceptSql) {
		// 	logger.error(exceptSql);
		// 	model.addAttribute("error", exceptSql.getMessage() + "<br/>" + displayErrorForWeb(exceptSql));
		// 	model.addAttribute("target", target);
		// 	nextView = "login";
		// } catch (ClassNotFoundException cnfe) {
		// 	logger.error(cnfe);
		// 	model.addAttribute("error", cnfe.getMessage());
		// 	model.addAttribute("target", target);

		// } finally {
		// 	try {
		// 		if (sqlStatement != null) {
		// 			sqlStatement.close();
		// 		}
		// 	} catch (SQLException exceptSql) {
		// 		logger.error(exceptSql);
		// 		model.addAttribute("error", exceptSql.getMessage());
		// 		model.addAttribute("target", target);
		// 	}
		// 	try {
		// 		if (connect != null) {
		// 			connect.close();
		// 		}
		// 	} catch (SQLException exceptSql) {
		// 		logger.error(exceptSql);
		// 		model.addAttribute("error", exceptSql.getMessage());
		// 		model.addAttribute("target", target);
		// 	}
		// }

		// // Redirect to the appropriate place based on login actions above
		// logger.info("Redirecting to view: " + nextView);
		return nextView;
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
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

async function createFromRequest(req) {
    var cookie = req.cookie.user;
    if (!cookie) {
        return null;
    }
    var user = JSON.parse(atob(req.cookies.cart));
    return user;
}

async function updateInResponse(currentUser, res) {
    res.cookie('user', btoa(JSON.stringify(currentUser)));
    return res;
}

module.exports = { testFunc, showLogin, processLogin };

