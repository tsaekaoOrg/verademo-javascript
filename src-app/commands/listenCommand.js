var BlabberCommand = require('./blabberCommand');

class ListenCommand extends BlabberCommand {
    constructor(cursor, username) {
        logger.info("Listen command");
        super();
        this.cursor = cursor;
        this.username = username;
    }

    async execute(BlabberUsername) {
        let sqlQuery = `INSERT INTO listeners (blabber, listener) VALUES ('${BlabberUsername}', '${this.username}');`;
        this.logger.info(sqlQuery);

        try {
            await this.cursor.execute(sqlQuery);
            this.logger.info(sqlQuery);
            const result = await this.cursor.execute(sqlQuery);
            
            const event = `${this.username} started listening to ${BlabberUsername}`;
            let sqlQuery = `INSERT INTO listeners (blabber, event) VALUES ('${BlabberUsername}', '${this.event}');`;
            this.logger.info(sqlQuery);
            await this.cursor.execute(sqlQuery);

        } catch (e) {
            logger.error("Unexpected Error:", e);
        }
    }
}
module.exports = ListenCommand;