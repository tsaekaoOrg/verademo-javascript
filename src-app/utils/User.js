const crypto = require('crypto');
const moment = require('moment');

class User {
    constructor(username, password, dateCreated, lastLogin, blabName,realName) {
        this.username = username;
        this.password = crypto.createHash('md5').update(password).digest("hex");
        this.dateCreated = dateCreated;
        this.lastLogin = lastLogin;
        this.blabName = blabName;
        this.realName = realName;
    }

    create(userName, blabName, realName) {
        let password = userName;
        let dateCreated = moment().format("YYYY-MM-DD HH:mm:ss");
        let lastLogin = null;

        return new User(userName, password, dateCreated, lastLogin, blabName, realName)
    }
}

module.exports = User
