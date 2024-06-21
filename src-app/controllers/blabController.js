
const mariadb = require('mariadb');
const pyformat = require('pyformat');
const dbconnector = require('../utils/dbconnector.js');
var Blab = require('../models/Blab');
var Blabber = require('../models/Blabber');

//require('../models/Blab.js')


const sqlBlabsByMe = "SELECT blabs.content, blabs.timestamp, COUNT(comments.blabber), blabs.blabid "
        + "FROM blabs LEFT JOIN comments ON blabs.blabid = comments.blabid "
        + "WHERE blabs.blabber = ? GROUP BY blabs.blabid ORDER BY blabs.timestamp DESC;";

const sqlBlabsForMe = "SELECT users.username, users.blab_name, blabs.content, blabs.timestamp, COUNT(comments.blabber), blabs.blabid "
        + "FROM blabs INNER JOIN users ON blabs.blabber = users.username INNER JOIN listeners ON blabs.blabber = listeners.blabber "
        + "LEFT JOIN comments ON blabs.blabid = comments.blabid WHERE listeners.listener = ? "
        + "GROUP BY blabs.blabid ORDER BY blabs.timestamp DESC LIMIT {} OFFSET {};";

/*
*   TODO: Fix setCommentCount() to contain comment count. Currently does not work.
*/
async function showFeed(req, res){
    
    console.log("Entering showFeed");

    let username = req.session.username;
    // Ensure user is logged in
    if (!username) 
    {
        console.log("User is not Logged In - redirecting...");
        return res.redirect("login?target=profile");
    }

    console.log("User is Logged In - continuing... UA=", req.headers['user-agent'], " U=", username);
    let connect = null;
    
    try {
        console.log("Getting Database connection");
        connect = await mariadb.createConnection(dbconnector.getConnectionParams());
        

        // Find the Blabs that this user listens to
        console.log("Preparing the BlabsForMe Prepared Statement");
        blabsForMe = await connect.prepare(pyformat(sqlBlabsForMe, [10, 0]));
        console.log("Executing the BlabsForMe Prepared Statement");
        let blabsForMeResults = await blabsForMe.execute(username);

        // Store them in the Model
        feedBlabs = [];
        for (item of blabsForMeResults) {
            let author = new Blabber();
            author.setUsername(item['username']);
            author.setBlabName(item['blab_name']);

            let post = new Blab();
            post.setId(item['blabid']);
            post.setContent(item['content']);
            post.setPostDate(item['timestamp']);
            post.setCommentCount(item['COUNT']);
            post.setAuthor(author);

            feedBlabs.push(post);
        }
        res.locals['blabsByOthers'] = feedBlabs;
        res.locals['currentUser'] = username;

        // Find the Blabs by this user
        blabsByMe = await connect.prepare(sqlBlabsByMe);
        console.log("Executing the BlabsByMe Prepared Statement");
        let blabsByMeResults = await blabsByMe.execute(username);

        // Store them in the model
        myBlabs = [];
        for (item of blabsByMeResults) {
            post = new Blab();
            post.setId(item['blabid']);
            post.setContent(item['content']);
            post.setPostDate(item['timestamp']);
            post.setCommentCount(item['COUNT']);

            myBlabs.push(post);
        }
        res.locals['blabsByMe'] = myBlabs;
    } catch (err) {
        console.error("Error connecting to database and querying data: ", err);
    } finally {
        if (connect) connect.end(err => {
            if(err) {
               console.log("SQL error in closing connection: ", err);
            }
         })
    }
    return res.render('feed',{});
}
async function getMoreFeed(req,res){
    const count = req.query.count;
    const length = req.query.len;
    // const template = "<li><div>" + "\t<div class=\"commenterImage\">" + "\t\t<img src=\"/images/{username}.png\">"
	// 			+ "\t</div>" + "\t<div class=\"commentText\">" + "\t\t<p>{content}</p>"
	// 			+ "\t\t<span class=\"date sub-text\">by {blab_name} on {timestamp}</span><br>"
	// 			+ "\t\t<span class=\"date sub-text\"><a href=\"blab?blabid={blabid}\">{count} Comments</a></span>" + "\t</div>"
	// 			+ "</div></li>";

    const template = "<li><div>" + "\t<div class=\"commenterImage\">" + "\t\t<img src=\"/images/{username}.png\">"
				+ "\t</div>" + "\t<div class=\"commentText\">" + "\t\t<p>THE PROBLEM IS HERE</p>"
				+ "\t\t<span class=\"date sub-text\">by {blab_name} on {timestamp}</span><br>"
				+ "\t\t<span class=\"date sub-text\"><a href=\"#\">{count} Comments</a></span>" + "\t</div>"
				+ "</div></li>";

    let cnt = null;
    let len = null;
                
    try {
        // Convert input to integers
        cnt = Number(count);
        len = Number(length);
    } catch (err) {
        console.error(err);
        return ""
    }
    username = req.session.username;

    // Get the Database Connection
    let connect;
    let feedSql;
    let ret = [];
    try {
        console.log("Creating database connection");
        connect = await mariadb.createConnection(dbconnector.getConnectionParams());
        console.log("Creating prepared statement");
        feedSql = await connect.prepare(pyformat(sqlBlabsForMe, [len,cnt]));

        let results = await feedSql.execute(username);
        for (item of results)
        {
            blab = new Blab();
            blab.setPostDate(item['timestamp']);
            formatter = {
                username: item['username'],
                blab_name: item['blab_name'],
                //content: item['content'],
                timestamp: blab['timestamp'],
                blabid: item['blabid'],
                count: item['commentCount']
            }
            ret += pyformat(template,[],formatter)
        }        
    } catch (ex) {
        console.error(ex);
    }
    return res.send(ret)

}
async function processFeed(req, res){
    blab = req.body['blab']
    nextView = "feed";
    console.log("Entering processBlab");

    username = req.session.username;
    // Ensure user is logged in
    if (username == null) {
        console.log("User is not Logged In - redirecting...");
        return res.redirect("login?target=profile");
    }
    console.log("User is Logged In - continuing... UA=" + req.headers["User-Agent"] + " U=" + username);

    let connect = null;
    let addBlab = null;
    addBlabSql = "INSERT INTO blabs (blabber, content, timestamp) values (?, ?, ?);";

    try {
        console.log("Getting Database connection");
        // Get the Database Connection
        connect = await mariadb.createConnection(dbconnector.getConnectionParams());

        let now = new Date();
        console.log("Preparing the addBlab Prepared Statement");
        addBlab = await connect.prepare(addBlabSql);
        
        //addBlab.setTimestamp(3, new Timestamp(now.getTime()));
        console.log("Executing the addBlab Prepared Statement");
        let addBlabResult = addBlab.execute([username, blab, now]); //Need to implement Timestamps

        // If there is a record...
        if (addBlabResult) {
            // failure
            res.locals['error'] = "Failed to add blab";
        }
        nextView = "feed";
    } catch (ex) {
        console.error(ex);
    } finally {
        try {
            if (addBlab != null) {
                addBlab.close();
            }
        } catch (exceptSql) {
            console.error(exceptSql);
        }
        try {
            if (connect != null) {
                connect.close();
            }
        } catch (exceptSql) {
            console.error(exceptSql);
        }
    }

    return res.redirect(nextView);
}

async function showBlab(req,res){

}

async function processBlab(req,res){

}

async function showBlabbers(req,res){
    res.render('blabbers');
}

async function processBlabbers(req,res){
    console.log();
}

module.exports = {
    showBlabbers,
    processBlabbers,
    showFeed,
    getMoreFeed,
    processFeed,
    showBlab,
    processBlab,
}