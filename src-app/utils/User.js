class User {
    constructor(username, password, dateCreated, lastLogin, blabName,realName) {
        this.username = username;
        this.password = password;
        this.dateCreated = dateCreated;
        this.lastLogin = lastLogin;
        this.blabName = blabName;
        this.realName = realName;
    }
}

function create(username, blabName,realName)
{
    password = username
    dateCreated = null //moment.now().format("YYYY-MM-DD hh:mm:ss")
    lastLogin = null;
    return new User(username, password/*hashlib.md5(password.encode('utf-8')).hexdigest()*/, username, dateCreated, lastLogin, blabName, realName);
}

module.exports = {
    create,
    User,
}