const moment = require('moment')

class Blabber {
    constructor () {
        this.id = null;
        this.username = null;
        this.realName = null;
        this.BlabName = null;
        this.createdDate = null;
        this.numberListeners = null;
        this.numberListening = null;

        this.date_format = "MMM d, YYYY";
    }

    getId() {
        return this.id;
    }

    setID(newID) {
        this.id = newID;
    }

    getUsername() {
        return this.username;
    }

    setUsername(newUsername) {
        this.username = newUsername;
    }

    getRealName() {
        return this.realName;
    }

    setRealName(newRealName) {
        this.realName = newRealName;
    }

    getBlabName() {
        return this.BlabName;
    }

    setBlabName(newBlabName) {
        this.BlabName = newBlabName;
    }

    getCreatedDate() {
        return this.createdDate;
    }

    getCreatedDateString() {
        return moment(this.createdDate,'YYYY/MM/DD HH:mm:ss').format(this.date_format)
    }

    setCreatedDate(newCreatedDate) {
        this.createdDate = newCreatedDate;
    }

    getNumberListeners() {
        return this.numberListeners;
    }

    setNumberListeners(newNumberListeners) {
        this.numberListeners = newNumberListeners;
    }

    getNumberListening() {
        return this.numberListening;
    }

    setNumberListening(newNumberListening) {
        this.numberListening = newNumberListening;
    }
}

module.exports = Blabber;