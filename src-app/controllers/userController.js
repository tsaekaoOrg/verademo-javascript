const mariadb = require('mariadb');
const crypto = require('crypto');
const dbconnector = require('../utils/dbconnector.js');

async function showLogin(req, res) {
    try {
        let target = req.query.target;
        let username = req.query.username;
		
        if (req.session.username) {
			console.log("User is already logged in - redirecting...");
            if (target) {
                return res.redirect(target);
            } else {
                return res.redirect('feed');
            }
        }

        let user = createFromRequest(req);
		if (user) {
            req.session.username = user.username;
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

		console.log("Entering showLogin with username " + username + " and target " + target);

		res.locals.target = target
		res.locals.username = username;

		return res.render('login');
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json(err);
    }
}

async function processLogin(req, res) {

	console.log("Entering processLogin");

    const username = req.body.user
    const password = req.body.password
    const remember = req.body.remember
    const target = req.body.target

    try {
        // Determine eventual redirect. Do this here in case we're already logged in
		let nextView;
		if (target) {
			nextView = 'res.redirect(target)';
		} else {
			// default to user's feed
			nextView = 'res.redirect("feed")';
		}

		let connect = null;
		let sqlStatement = null;
		try {
			// Get the Database Connection
			console.log("Creating the Database connection");
			connect = await mariadb.createConnection(dbconnector.getConnectionParams());

			/* START BAD CODE */
			// Execute the query
			console.log("Creating the Statement");
			const sqlQuery = "select username, password, password_hint, created_at, last_login, real_name, blab_name from users where username='"
					+ username + "';";
			console.log("Execute the Statement");
			const result = await connect.query(sqlQuery);
			/* END BAD CODE */
			/* START GOOD CODE
			String sqlQuery = "select * from users where username=? and password=?;";
			console.log("Preparing the PreparedStatement");
			sqlStatement = connect.prepareStatement(sqlQuery);
			console.log("Setting parameters for the PreparedStatement");
			sqlStatement.setString(1, username);
			sqlStatement.setString(2, password);
			console.log("Executing the PreparedStatement");
			ResultSet result = sqlStatement.executeQuery();
			/* END GOOD CODE */

			// Did we find exactly 1 user that matched?
			if (result.length == 1 && crypto.createHash('md5').update(result[0]['password']).digest("hex")) {
				let user = result[0]
				console.log("User Found.");
				// Remember the username as a courtesy.
				res.cookie('username', result.username);

				// If the user wants us to auto-login, store the user details as a cookie.
				if (remember != null) {
					let currentUser = new User(user["username"], user["password_hint"],
							user["created_at"], user["last_login"],
							user["real_name"], user["blab_name"]);

					updateInResponse(currentUser, response);
				}

				req.session.username = user["username"];

				// Update last login timestamp
				let update = await connect.prepare("UPDATE users SET last_login=NOW() WHERE username=?;");
				await update.execute([user['username']]);
			} else {
				// Login failed...
				console.log("User Not Found");
				res.locals.error = "Login failed. Please try again.";
				res.locals.target = target;
				nextView = "res.render('login')";
			}
		// } catch (SQLException exceptSql) {
		// 	console.error(exceptSql);
		// 	model.addAttribute("error", exceptSql.getMessage() + "<br/>" + displayErrorForWeb(exceptSql));
		// 	model.addAttribute("target", target);
		// 	nextView = "login";
		} catch (err) {
			console.error(err.message);
			res.locals.error = err.message;
			res.locals.target = target;

		} finally {
		// 	try {
		// 		if (sqlStatement != null) {
		// 			sqlStatement.close();
		// 		}
		// 	} catch (SQLException exceptSql) {
		// 		console.error(exceptSql);
		// 		model.addAttribute("error", exceptSql.getMessage());
		// 		model.addAttribute("target", target);
		// 	}
			try {
				if (connect) {
					connect.close();
				}
			} catch (err) {
				console.error(err.message);
				res.locals.error = err;
				res.locals.target = target
			}
		}

		// Redirect to the appropriate place based on login actions above
		console.log("Redirecting to view: " + nextView);
		return eval(nextView);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json(err);
    }
}

async function showPasswordHint(req, res) {

}

async function processLogout(req, res) {

}

async function showRegister(req, res) {
	console.log("Entering showRegister");

    res.render('register', {});
}

async function processRegister(req, res)
{
	const username = req.query.user;
	req.session.username = username; // move this to the end of processRegisterFinish

	// console.log("Creating the Database connection");
	// try {
	// 	Class.forName("com.mysql.jdbc.Driver");
	// 	Connection connect = DriverManager.getConnection(Constants.create().getJdbcConnectionString());

	// 	String sql = "SELECT username FROM users WHERE username = '" + username + "'";
	// 	Statement statement = connect.createStatement();
	// 	ResultSet result = statement.executeQuery(sql);
	// 	if (result.first()) {
	// 		model.addAttribute("error", "Username '" + username + "' already exists!");
	// 		return "register";
	// 	} else {
	// 		return "register-finish";
	// 	}
	// } catch (SQLException | ClassNotFoundException ex) {
	// 	console.error(ex);
	// }

    res.render('register');
}

async function showRegisterFinish(req, res) {
	console.log("Entering showRegisterFinish");

	res.render('register-finish')
}

async function processRegisterFinish(req, res) {
	console.log("Entering processRegisterFinish");

	const username = req.body.username;
	const password = req.body.password;
	const cpassword = req.body.cpassword;
	const realName = req.body.realName;
	const blabName = req.body.blabName;
	let error;
	
	if (password !== cpassword) {
		console.log("Password and Confirm Password do not match");
		error = "The Password and Confirm Password values do not match. Please try again.";
	}

	let connect;
	let sqlStatement;

	// try {
	// 	// Get the Database Connection
	// 	console.log("Creating the Database connection");
	// 	Class.forName("com.mysql.jdbc.Driver");
	// 	connect = DriverManager.getConnection(Constants.create().getJdbcConnectionString());

	// 	/* START EXAMPLE VULNERABILITY */
	// 	// Execute the query
	// 	String mysqlCurrentDateTime = (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"))
	// 			.format(Calendar.getInstance().getTime());
	// 	StringBuilder query = new StringBuilder();
	// 	query.append("insert into users (username, password, created_at, real_name, blab_name) values(");
	// 	query.append("'" + username + "',");
	// 	query.append("'" + BCrypt.hashpw(password, BCrypt.gensalt()) + "',");
	// 	query.append("'" + mysqlCurrentDateTime + "',");
	// 	query.append("'" + realName + "',");
	// 	query.append("'" + blabName + "'");
	// 	query.append(");");

	// 	sqlStatement = connect.createStatement();
	// 	sqlStatement.execute(query.toString());
	// 	console.log(query.toString());
	// 	/* END EXAMPLE VULNERABILITY */

	// 	emailUser(username);
	// } catch (SQLException | ClassNotFoundException ex) {
	// 	console.error(ex);
	// } finally {
	// 	try {
	// 		if (sqlStatement != null) {
	// 			sqlStatement.close();
	// 		}
	// 	} catch (SQLException exceptSql) {
	// 		console.error(exceptSql);
	// 	}
	// 	try {
	// 		if (connect != null) {
	// 			connect.close();
	// 		}
	// 	} catch (SQLException exceptSql) {
	// 		console.error(exceptSql);
	// 	}
	// }

	return res.redirect("login?username=" + username);

    // const pool = mariadb.createPool({
    //     host: process.env.DB_HOST,
    //     user: process.env.DB_USER,
    //     password: process.env.DB_PASS,
    //     database: process.env.DB_NAME,
    //     connectionLimit: 5
    // })
}

function emailUser(username) {

}

async function showProfile(req, res) {
	res.render('profile');
}

async function processProfile(req, res) {
	console.log('processing');
}

async function testFunc(req, res)
{
    let conn;
    
    const pool = mariadb.createPool({
        
    });
    
    try {
        console.log("creating DB Connection");
        let conn = await mariadb.createConnection({
			host: process.env.MARIADB_HOST,
    		port: process.env.MARIADB_PORT,
        	user: process.env.MARIADB_USER,
        	password: process.env.MARIADB_PASSWORD,
        	database: process.env.MARIADB_DATABASE_NAME,
		});

        //conn = await mariadb.createConnection(connectionURI)
        // Use Connection to get contacts data
        console.log("sending query")
        //const rows = await conn.query("SHOW DATABASES;");
        const rows = await conn.query("SELECT username,password FROM blab.users;");
        //Print list of contacts
        for (i = 0; i < rows.length; i++) {
           console.log(rows[i] );
        }
        conn.close();
    } catch(err){
        // Manage Errors
        console.error(err.message);
    } finally {
        // Close Connection
        //if(conn) 
    }
    return res.render('reset',{})
    
}

function createFromRequest(req) {
	const cookie = req.cookies.user;
    if (!cookie) {
        return null;
    }
    const user = JSON.parse(atob(cookie));
    return user;
}

function updateInResponse(currentUser, res) {
    res.cookie('user', btoa(JSON.stringify(currentUser)));
    return res;
}

module.exports = { 	
	testFunc,
	showLogin,
	processLogin,
	showRegister, 
	processRegister, 
	showRegisterFinish, 
	processRegisterFinish,
	showProfile,
	processProfile,
};

