
class Blab
{
    constructor()
    {
        this.id;
	    this.content;
	    this.postDate;
	    this.commentCount;
	    this.author;
        this.sdf = new SimpleDateFormat("MMM d, yyyy");
    }
	
	get id()
	{
		return this.id;
	}

	async setId(id)
	{
		this.id = id;
	}

	get content()
	{
		return this.content;
	}

	async setContent(content)
	{
		this.content = content;
	}

	get postDate()
	{
		return this.postDate;
	}
    //TODO: Fix this method
	get PostDateString()
	{
		return sdf.format(postDate);
	}

	async setPostDate(postDate)
	{
		this.postDate = postDate;
	}

	get author()
	{
		return this.author;
	}

	async setAuthor(author)
	{
		this.author = author;
	}

	get commentCount()
	{
		return this.commentCount;
	}

	async setCommentCount(commentCount)
	{
		this.commentCount = commentCount;
	}
}
