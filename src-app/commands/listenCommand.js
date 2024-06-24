
class ListenCommand{

    constructor(connect, username) {
        console.log("Listen command");
        this.connect = connect;
        this.username = username;
    }

    async execute(blabberUsername) {
        let sqlQuery = "INSERT INTO listeners (blabber, listener, status) values (?, ?, 'Active');";
		console.log(sqlQuery);
		let action;
		try {
			action = await this.connect.prepare(sqlQuery);
			await action.execute([blabberUsername,this.username]);

			sqlQuery = "SELECT blab_name FROM users WHERE username = '" + blabberUsername + "'";
			console.log(sqlQuery);
			let result = await this.connect.query(sqlQuery);
			if (result.length > 0 )        
            {
                /* START EXAMPLE VULNERABILITY */
			    let event = this.username + " started listening to " + blabberUsername + " (" + result[0].blab_name + ")";
			    sqlQuery = "INSERT INTO users_history (blabber, event) VALUES (\"" + this.username + "\", \"" + event + "\")";
			    console.log(sqlQuery);
			    await this.connect.query(sqlQuery);
			    /* END EXAMPLE VULNERABILITY */
            }

			
		} catch (err) {
			// TODO Auto-generated catch block
			console.error(err);
		}
    }
}
module.exports = ListenCommand;