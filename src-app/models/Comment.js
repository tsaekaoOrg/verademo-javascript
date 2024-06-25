const moment = require('moment')

class Comment  {
    constructor() {
        this.commentID = null;
        this.blabID = null;
        this.blabber = null;
        this.content = null;
        this.timestamp = null;

        this.date_format = "MMM D, YYYY";
    }

    getCommentID() {
        return this.commentID;
    }
    
    setCommentID(newCommentID) {
        this.commentID = newCommentID;
    }

    getBlabID() {
        return this.blabID;
    }

    setBlabID(newBlabID) {
        this.blabID = newBlabID;
    }

    getAuthor() {
        return this.blabber;
    }

    setAuthor(newBlabber) {
        this.blabber = newBlabber;
    }

    getContent() {
        return this.content;
    }

    setContent(newContent) {
        this.content = newContent;
    }

    getTimestamp() {
        return this.timestamp;
    }

    getTimestampString() {
        return moment(this.timestamp,'YYYY/MM/DD HH:mm:ss').format(this.date_format)
    }

    setTimestamp(newTimestamp) {
        this.timestamp = newTimestamp;
    }
}

module.exports = Comment;