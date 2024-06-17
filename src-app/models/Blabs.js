var express = require('express');


class Blabber {
    constructor () {
        var id = none;
        var username = none;
        var realName = none;
        var BlabName = none;
        var createdDate = none;
        var numberListeners = none;
        var numberListenings = none;

        const date_format = "%b %d %Y";
    }

    async getId() {
        return this.id;
    }
    async setID(id, newID) {
        this.id = newID;
    }
    async getUsername() {
        return this.username;
    }
    async setUsername(username, newUsername) {
        this.username = newUsername;
    }
    async getRealName() {
        return this.realName;
    }
    async setRealName(realName, newRealName) {
        this.realName = newRealName;
    }
    async getBlabName() {
        return this.BlabName;
    }
    async setBlabName(BlabName, newBlabName) {
        this.BlabName = newBlabName;
    }
    async getCreatedDate() {
        return this.createdDate;
    }
    async setCreatedDate(createdDate, newCreatedDate) {
        this.createdDate = newCreatedDate;
    }
    async getNumberListeners() {
        return this.numberListeners;
    }
    async setNumberListeners(numberListeners, newNumberListeners) {
        this.numberListeners = newNumberListeners;
    }
    async getNumberListenings() {
        return this.numberListenings;
    }
    async setNumberListenings(numberListenings, newNumberListenings) {
        this.numberListenings = newNumberListenings;
    }
}

module.exports = Blabber;