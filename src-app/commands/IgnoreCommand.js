const dbconnector = require('../utils/dbconnector.js');

class IgnoreCommand{
    // constructor(connect, username) {
    //     console.log("Ignore command");
    //     this.connect = connect;
    //     this.username = username;
    // }
	constructor(username) {
        console.log("Ignore command");
        this.username = username;
    }

    async execute(blabberUsername) 
    { 
        let sqlQuery = "DELETE FROM listeners WHERE blabber=? AND listener=?;";
		console.log(sqlQuery);
		let action;
		try {
			// action = await this.connect.prepare(sqlQuery);

			// await action.execute([blabberUsername,this.username]);

			await dbconnector.query(sqlQuery, [blabberUsername, this.username])

			sqlQuery = "SELECT blab_name FROM users WHERE username = '" + blabberUsername + "'";
			console.log(sqlQuery);
			let result = await dbconnector.query(sqlQuery);
			if (result.length > 0 )        
            {
                /* START EXAMPLE VULNERABILITY */
			    let event = this.username + " is now ignoring " + blabberUsername + " (" + result[0].blab_name + ")";
			    sqlQuery = "INSERT INTO users_history (blabber, event) VALUES (\"" + this.username + "\", \"" + event + "\")";
			    console.log(sqlQuery);
			    await dbconnector.query(sqlQuery);
                /* END EXAMPLE VULNERABILITY */
            }	
			
		} catch (err) {
			// TODO Auto-generated catch block
			console.error(err);
		}
    }
}
module.exports = IgnoreCommand;