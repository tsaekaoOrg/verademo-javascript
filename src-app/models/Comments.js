var express = require('express');

class Comment  {
    constructor() {
        this.commentID = None;
        this.blabID = None;
        this.blabber = None;
        this.content = None;
        this.timestamp = None;

        this.date_format = "%b %d %Y";
    }

    async getCommentID() {
        return this.commentID;
    }
    async setCommentID(commentID, newCommentID) {
        this.commentID = newCommentID;
    }
    async getBlabID() {
        return this.blabID;
    }
    async setBlabID(blabID, newBlabID) {
        this.blabID = newBlabID;
    }
    async getAuthor() {
        return this.blabber;
    }
    async setAuthor(blabber, newBlabber) {
        this.blabber = newBlabber;
    }
    async getContent() {
        return this.content;
    }
    async setContent(content, newContent) {
        this.content = newContent;
    }
    async getTimestamp() {
        return this.timestamp;
    }
    async setTimestamp(timestamp, newTimestamp) {
        this.timestamp = newTimestamp;
    }
}

module.exports = Comment;