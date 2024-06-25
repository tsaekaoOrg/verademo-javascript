const crypto = require('crypto');
const moment = require('moment');

const crypto = require('crypto');

class User {
    constructor(username, password, dateCreated, lastLogin, blabName,realName) {
        this.username = username;
        this.password = crypto.createHash('md5').update(password).digest("hex");
        this.dateCreated = dateCreated;
        this.lastLogin = lastLogin;
        this.blabName = blabName;
        this.realName = realName;
    }

    getUserName() { return this.username; }

    getPassword() { return this.password; }

    getPasswordHint() { return this.password_hint; }

    getLastLogin() { return this.lastLogin; }

    getDateCreated() { return this.dateCreated; }

    getRealName() { return this.realName; }

    getBlabName() { return this.blabName; }




    setTimestamp(index, date) {
        if (!(date instanceof Date)) {
            throw new Error('Invalid date object');
        }
        this.params[index - 1] = date.toISOString();
    }

}

function create(username, blabName,realName)
{
    let password = username;
    let dateCreated = new Date()
    let lastLogin = null;

    return new User(username, password, dateCreated, lastLogin, blabName,realName);

    create(userName, blabName, realName) {
        let password = userName;
        let dateCreated = moment().format("YYYY-MM-DD HH:mm:ss");
        let lastLogin = null;

        return new User(userName, password, dateCreated, lastLogin, blabName, realName)
    }
}

module.exports = User
