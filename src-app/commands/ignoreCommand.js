var BlabberCommand = require('./blabberCommand');

class IgnoreCommand extends BlabberCommand {
    constructor(cursor, username) {
        logger.info("Ignore command");
        super();
        this.cursor = cursor;
        this.username = username;
    }

    async execute(BlabberUsername) { 
        let sqlQuery = `DELETE FROM listeners WHERE blabber='${blabberUsername}' AND listener='${this.username}';`;
        this.logger.info(sqlQuery);

        try {
            await this.cursor.execute(sqlQuery);
            sqlQuery = `SELECT blab_name FROM users WHERE username = '${blabberUsername}'`;
            this.logger.info(sqlQuery);
            const result = await this.cursor.execute(sqlQuery);
            const blabName = result[0].blab_name;

            const event = `${this.username} is now ignoring ${blabberUsername} (${blabName})`;
            sqlQuery = `INSERT INTO users_history (blabber, event) VALUES ("${this.username}", "${event}")`;
            this.logger.info(sqlQuery);
            await this.cursor.execute(sqlQuery);
        } catch (e) {
            logger.error("Unexpected Error:", e);
        }
    }
}
module.exports = IgnoreCommand;