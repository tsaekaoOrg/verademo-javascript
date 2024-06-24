var express = require('express');

class Comment  {
    constructor() {
        this.commentID = null;
        this.blabID = null;
        this.blabber = null;
        this.content = null;
        this.timestamp = null;

        this.date_format = "%b %d %Y";
    }

    async getCommentID() {
        return this.commentID;
    }
    async setCommentID(newCommentID) {
        this.commentID = newCommentID;
    }
    async getBlabID() {
        return this.blabID;
    }
    async setBlabID(newBlabID) {
        this.blabID = newBlabID;
    }
    async getAuthor() {
        return this.blabber;
    }
    async setAuthor(newBlabber) {
        this.blabber = newBlabber;
    }
    async getContent() {
        return this.content;
    }
    async setContent(newContent) {
        this.content = newContent;
    }
    async getTimestamp() {
        return this.timestamp;
    }
    async setTimestamp(newTimestamp) {
        this.timestamp = newTimestamp;
    }
}

module.exports = Comment;