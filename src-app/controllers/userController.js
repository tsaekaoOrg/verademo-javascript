const mariadb = require('mariadb');
const crypto = require('crypto');
const dbconnector = require('../utils/dbconnector.js');
const moment = require('moment')
const Blabber = require('../models/Blabber.js');
const fs = require('fs');
const path = require('path');
const image_dir = path.join(__dirname, '../../resources/images/');
const User = require('../utils/User.js')


async function showLogin(req, res) {
    try {
        let target = req.query.target;
        let username = req.query.username;
		
        // if (req.session.username) {
		// 	console.log("User is already logged in - redirecting...");
        //     if (target) {
        //         return res.redirect(target);
        //     } else {
        //         return res.redirect('feed');
        //     }
        // }

        let user = await createFromRequest(req);
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
			/* START GOOD CODE TODO
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
				let user = result[0];
				console.log("User Found.");
				// Remember the username as a courtesy.
				res.cookie('username', result.username);

				// If the user wants us to auto-login, store the user details as a cookie.
				if (remember != null) {
					let currentUser = new User.User(user["username"], user["password_hint"],
							user["created_at"], user["last_login"],
							user["real_name"], user["blab_name"]);

					await updateInResponse(currentUser, res);
				}

				req.session.username = user["username"];

				// Update last login timestamp
				sqlStatement = await connect.prepare("UPDATE users SET last_login=NOW() WHERE username=?;");
				await sqlStatement.execute([user['username']]);
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
			try {
				if (sqlStatement) {
					sqlStatement.close();
				}
			} catch (err) {
				console.error(err);
				res.locals.error = err;
				res.locals.target = target
			}
			try {
				if (connect) {
					connect.close();
				}
			} catch (err) {
				console.error(err);
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
	console.log("Entering password-hitn wtih username: " + username);
	
	if (!username) {
		return "No username provided, please type in your username first";
	}

	// TODO: Continue
}

async function processLogout(req, res) {
	console.log("Entering processLogout");

	let type = req.query.type;

	req.session.username = null;

	let currentUser = null;
	await updateInResponse(currentUser, res);

	return res.redirect('login')
}

async function showRegister(req, res) {
	console.log("Entering showRegister");

    res.render('register');
}

async function processRegister(req, res)
{
	const username = req.body.user;
	res.locals.username = username;

	console.log("Creating the Database connection");
	try {
		let connect = await mariadb.createConnection(dbconnector.getConnectionParams());

		let sql = "SELECT username FROM users WHERE username = '" + username + "'";
		let result = await connect.query(sql);
		if (result.length != 0) {
			res.locals.error = "Username '" + username + "' already exists!"
			return res.render('register');
		} else {
			return res.render('register-finish');
		}
	} catch (err) {
		console.error(err);
	}

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
	
	if (password !== cpassword) {
		console.log("Password and Confirm Password do not match");
		res.locals.error = "The Password and Confirm Password values do not match. Please try again.";
		return res.render('register')
	}

	let connect;
	let sqlStatement;

	try {
		// Get the Database Connection
		console.log("Creating the Database connection");
		connect = await mariadb.createConnection(dbconnector.getConnectionParams());

		// /* START EXAMPLE VULNERABILITY */
		// // Execute the query
		mysqlCurrentDateTime = moment().format("YYYY-MM-DD HH:mm:ss")

		let query = "insert into users (username, password, created_at, real_name, blab_name) values(";
		query += "'" + username + "',";
		query += "'" + crypto.createHash('md5').update(password).digest("hex") + "',";
		query += "'" + mysqlCurrentDateTime + "',";
		query += "'" + realName + "',";
		query += "'" + blabName + "'";
		query += ");";

		console.log(query);
		connect.query(query);

		req.session.username = username;
		
		// /* END EXAMPLE VULNERABILITY */

		// emailUser(username);
	} catch (err) {
		console.error(err);
	} finally {
		// try {
		// 	if (sqlStatement != null) {
		// 		sqlStatement.close();
		// 	}
		// } catch (SQLException exceptSql) {
		// 	console.error(exceptSql);
		// }
		try {
			if (connect) {
				connect.close();
			}
		} catch (err) {
			console.error(err);
		}
	}

	return res.redirect("login?username=" + username);
}

function emailUser(username) {

}

async function showProfile(req, res) {
	let type = req.query.type;
	console.log("Entering showProfile");
	let username = req.session.username;

	if (!username) {
		console.log("User is not Logged In - redirecting...");
		return res.redirect("login?target=profile");
	}

	let connect = null;
	let myHecklers = null;
	let myInfo = null;
	let sqlMyHecklers = "SELECT users.username, users.blab_name, users.created_at "
				+ "FROM users LEFT JOIN listeners ON users.username = listeners.listener "
				+ "WHERE listeners.blabber=? AND listeners.status='Active';";

	try {
		console.log("Getting Database connection");
		connect = await mariadb.createConnection(dbconnector.getConnectionParams());
		
		console.log(sqlMyHecklers);
		myHecklers = await connect.prepare(sqlMyHecklers);
		let myHecklersResults = await myHecklers.execute([username]);

		let hecklers = [];
		myHecklersResults.forEach((heckler) => {
			let blabber = new Blabber();
			blabber.setUsername(heckler[0]);
			blabber.setBlabName(heckler[1]);
			blabber.setCreatedDate(heckler[2]);
			hecklers.push(blabber);
		})
		
		let events = [];
		let sqlMyEvents = "select event from users_history where blabber=\"" + username
				+ "\" ORDER BY eventid DESC; ";
		console.log(sqlMyEvents);
		userHistoryResult = await connect.query(sqlMyEvents);

		userHistoryResult.forEach((event) => {
			events.push(event[0]);
		})

		let sql = "SELECT username, real_name, blab_name FROM users WHERE username = '" + username + "'";
		console.log(sql);
		myInfo = await connect.prepare(sql);
		let myInfoResults = await myInfo.execute();

		res.locals.hecklers = hecklers;
		res.locals.events = events;
		res.locals.username = myInfoResults[0]['username'];
		res.locals.image = await getProfileImageFromUsername(myInfoResults[0]['username']);
		res.locals.realName = myInfoResults[0]['real_name'];
		res.locals.blabName = myInfoResults[0]['blab_name'];

	} catch (err) {
		console.error(err)
	} finally {
		try {
			if (myHecklers) {
				myHecklers.close();
			}
		} catch (err) {
			console.error(err);
		}
		try {
			if (connect) {
				connect.close();
			}
		} catch (err) {
			console.error(err);
		}
	}

	res.render('profile');
}

async function processProfile(req, res) {
	console.log("Entering processProfile");

	const realName = req.body.realName;
	const blabName = req.body.blabName;
	const username = req.body.username;
	const file = req.files[0];

	let sessionUsername = req.session.username;
	if (!sessionUsername) {
		console.log("User is not Logged In - redirecting...");
		return res.redirect("login?target=profile");
	}

	console.log("User is Logged In - continuing... UA=" + req.get("user-agent") + " U=" + sessionUsername);

	let oldUsername = sessionUsername;
	let connect = null;
	let update = null;
	try {
		console.log("Getting Database connection");
		connect = await mariadb.createConnection(dbconnector.getConnectionParams());

		console.log("Preparing the update Prepared Statement");
		update = await connect.prepare("UPDATE users SET real_name=?, blab_name=? WHERE username=?;");
		
		console.log("Executing the update Prepared Statement");
		let updateResult = await update.execute([realName, blabName, sessionUsername]);
		
		if (updateResult.affectedRows != 1) {
			await res.set('content-type', 'application/json');
			return res.status(500).send("{\"message\": \"<script>alert('An error occurred, please try again.');</script>\"}");
		}
	} catch (err) {
		console.error(err);
	} finally {
		try {
			if (update) {
				update.close();
			}
		} catch (err) {
			console.log(err);
		}
		try {
			if (connect) {
				connect.close();
			}
		} catch (err) {
			console.log(err);
		}
	}

	// Rename profile image if username changes
	if (!(username == oldUsername)) {
		// Check if username exists
		let exists = false;
		newUsername = username.toLowerCase();
		try {
			console.log("Getting Database connection");
			connect = await mariadb.createConnection(dbconnector.getConnectionParams());

			console.log("Preparing the duplicate username check Prepared Statement");
			sqlStatement = await connect.prepare("SELECT username FROM users WHERE username=?");
			let result = await sqlStatement.execute([newUsername]);
			if (result.length != 0) {
				console.info("Username: " + username + " already exists. Try again.");
				exists = true;
			}
		} catch (err) {
			console.error(err);
		} finally {
			try {
				if (sqlStatement) {
					sqlStatement.close();
				}
			} catch (err) {
				console.error(err);
			}
			try {
				if (connect) {
					connect.close();
				} 
			} catch (err) {
				console.error(err);	
			}
		}
		if (exists) {
			await res.set('content-type', 'application/json');
			return res.status(409).send("{\"message\": \"<script>alert('That username already exists. Please try another.');</script>\"}");
		}

		// Attempt to update username
		oldUsername = oldUsername.toLowerCase();
		let sqlUpdateQueries = [];
		let renamed = false;
		try {
			console.log("Getting Database connection");
			connect = await mariadb.createConnection(dbconnector.getConnectionParams());

			let sqlStrQueries = ["UPDATE users SET username=? WHERE username=?",
								 "UPDATE blabs SET blabber=? WHERE blabber=?",
								 "UPDATE comments SET blabber=? WHERE blabber=?",
								 "UPDATE listeners SET blabber=? WHERE blabber=?",
								 "UPDATE listeners SET listener=? WHERE listener=?",
							  	 "UPDATE users_history SET blabber=? WHERE blabber=?"];
			
			try {
				await connect.beginTransaction();
				try {
					for (query of sqlStrQueries) {
						console.log("Preparing the Prepared Statement: " + query)
						sqlUpdateQueries.push(await connect.prepare(query));
					}

					for (statement of sqlUpdateQueries) {
						await statement.execute([newUsername, oldUsername]);
					}

					await connect.commit();
				} catch (err) {
					console.error("Error loading data, reverting changes: ", err);
         			await connect.rollback();
				}
			} catch (err) {
				console.error("Error starting a transaction: ", err);
			}

			oldImage = await getProfileImageFromUsername(oldUsername);
			if (oldImage) {
				extension = oldImage.substring(oldImage.lastIndexOf("."));

				console.log ("Renaming profile image from " + oldImage + " to " + newUsername + extension);
				oldName = image_dir + oldImage;
				newName = image_dir + newUsername + extension;

				fs.rename(oldName, newName, (err) => { if (err) throw err; });
			}
			renamed = true;
		} catch (err) {
			console.error(err);
		} finally {
			try {
				if (sqlUpdateQueries) {
					for (statement of sqlUpdateQueries) {
						statement.close();
					}
				}
			} catch (err) {
				console.error(err);
			}
			try {
				if (connect) {
					connect.close();
				}
			} catch (err) {
				console.error(err);
			}
		}
		if (!renamed) {
			await res.set('content-type', 'application/json');
			return res.status(500).send("{\"message\": \"<script>alert('An error occurred, please try again.');</script>\"}");
		}

		// Update all session and cookie logic
		req.session.username = username;
		res.cookie('username', username);

		// Update remember me functionality
		let currentUser = await createFromRequest(req);
		if (currentUser) {
			currentUser.username = username;
			await updateInResponse(currentUser, res);
		}
	}

	// Update user profile image
	if (file) {
		let oldImage = await getProfileImageFromUsername(username);
		if (oldImage) {
			fs.unlink(image_dir + oldImage, (err) => { if (err) throw err; });
		}

		try {
			let extension = await file.filename.substring(file.filename.lastIndexOf("."));
			let filepath = image_dir + username + extension;

			console.log("Saving new profile image: " + filepath);

			fs.rename(file.path, filepath, (err) => { if (err) throw err; })
		} catch (err) {
			console.error(err);
		}

	}

	let msg = `Successfully changed values!\\\\nusername: ${username.toLowerCase()}\\\\nReal Name: ${realName}\\\\nBlab Name: ${blabName}`;
	let response = `{\"values\": {\"username\": \"${username.toLowerCase()}\", \"realName\": \"${realName}\", \"blabName\": \"${blabName}\"}, \"message\": \"<script>alert('`
			+ msg + `');</script>\"}`;

	await res.set('content-type', 'application/json');
	return res.status(200).send(response);

}

async function testFunc(req, res)
{
    let conn;
    
    
    try {
        console.log("creating DB Connection");
        conn = await mariadb.createConnection(/*{
			host: process.env.MARIADB_HOST,
    		port: process.env.MARIADB_PORT,
        	user: process.env.MARIADB_USER,
        	password: process.env.MARIADB_PASSWORD,
        	database: process.env.MARIADB_DATABASE_NAME,
		}*/dbconnector.getConnectionParams());

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

async function createFromRequest(req) {
	const cookie = req.cookies.user;
    if (!cookie) {
        return null;
    }
    const user = JSON.parse(atob(cookie));
    return user;
}

async function updateInResponse(currentUser, res) {
    res.cookie('user', btoa(JSON.stringify(currentUser)));
    return res;
}

async function getProfileImageFromUsername(username) {
	let files = fs.readdirSync(image_dir);
	for (const filename of files) {
		if (filename.startsWith(username + '.')) {
			return filename;
		}
	}
	return null;
}

module.exports = { 	
	testFunc,
	showLogin,
	processLogin,
	processLogout,
	showRegister, 
	processRegister, 
	showRegisterFinish, 
	processRegisterFinish,
	showProfile,
	processProfile,
};

