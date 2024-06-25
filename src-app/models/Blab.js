const moment = require('moment')

class Blab
{
    constructor()
    {
        this.id;
	    this.content;
	    this.postDate;
	    this.commentCount;
	    this.author;

        this.date_format = "MMM D, YYYY";
    }

	getId()
	{
		return this.id;
	}

	setId(id)
	{
		this.id = id;
	}

	getContent()
	{
		return this.content;
	}

	setContent(content)
	{
		this.content = content;
	}

	getPostDate()
	{
		return this.postDate;
	}

	getPostDateString()
	{
		return moment(this.postDate,'YYYY/MM/DD HH:mm:ss').format(this.date_format)
	}

	setPostDate(postDate)
	{
		this.postDate = postDate;
	}

	getAuthor()
	{
		return this.author;
	}

	setAuthor(author)
	{
		this.author = author;
	}

	getCommentCount()
	{
		return this.commentCount;
	}

	setCommentCount(commentCount)
	{
		this.commentCount = commentCount;
	}
}

module.exports = Blab;