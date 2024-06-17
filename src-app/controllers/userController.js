const mariadb = require('mariadb');

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
    const pool = mariadb.createPool({
        host: process.env.MARIADB_HOST,
        port: process.env.MARIADB_PORT,
        user: process.env.MARIADB_USER,
        password: process.env.MARIADB_PASSWORD,
        database: process.env.MARIADB_DATABASE_NAME,
    });
    try {
        console.log("creating DB Connection");
        let conn = await pool.getConnection();
        // Use Connection to get contacts data
        console.log("sending query")
        const rows = await conn.query("SELECT username,password FROM blab.users");
        //Print list of contacts
        for (i = 0; i < rows.length; i++) {
           console.log(`${rows[i].username} ${rows[i].password}` );
        }
        conn.close();
    } catch(err){
        // Manage Errors
        console.log(err);
    } finally {
        // Close Connection
        //if(conn) 
    }
    return res.render('reset',{})
    
}

const showLogin = async (req, res, next) => {
    try {
        var target = req.query.target
        var username = req.query.username

        if (req.session.username) {
            if (req.query.target) {
                return res.redirect(target)
            } else {
                return res.redirect('feed')
            }
        }

        // User user = UserFactory.createFromRequest(httpRequest);
		// if (user != null) {
		// 	Utils.setSessionUserName(httpRequest, httpResponse, user.getUserName());
		// 	logger.info("User is remembered - redirecting...");
		// 	if (target != null && !target.isEmpty() && !target.equals("null")) {
		// 		return "redirect:" + target;
		// 	} else {
		// 		// default to user's feed
		// 		return Utils.redirect("feed");
		// 	}
		// } else {
		// 	logger.info("User is not remembered");
		// }

		if (!username) {
			username = "";
		}

		if (!target) {
			target = "";
		}

        return res.render('login', {username, target})
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}

const processLogin = async (req, res, next) => {
    try {
        
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}

module.exports = { showLogin, processLogin, testFunc}
