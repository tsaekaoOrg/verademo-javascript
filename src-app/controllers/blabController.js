
const mariadb = require('mariadb')
// const pyformat = require('pyformat')
//require('../models/Blab.js')


const sqlBlabsByMe = "SELECT blabs.content, blabs.timestamp, COUNT(comments.blabber), blabs.blabid "
        + "FROM blabs LEFT JOIN comments ON blabs.blabid = comments.blabid "
        + "WHERE blabs.blabber = ? GROUP BY blabs.blabid ORDER BY blabs.timestamp DESC;";

const sqlBlabsForMe = "SELECT users.username, users.blab_name, blabs.content, blabs.timestamp, COUNT(comments.blabber), blabs.blabid "
        + "FROM blabs INNER JOIN users ON blabs.blabber = users.username INNER JOIN listeners ON blabs.blabber = listeners.blabber "
        + "LEFT JOIN comments ON blabs.blabid = comments.blabid WHERE listeners.listener = ? "
        + "GROUP BY blabs.blabid ORDER BY blabs.timestamp DESC LIMIT {} OFFSET {};";

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
    var blabsByMe = null;
    var blabsForMe = null;
    
    try {
        console.log("Getting Database connection");
        connect = await mariadb.createConnection(dbconnector.getConnectionParams());
        

        // Find the Blabs that this user listens to
        logger.info("Preparing the BlabsForMe Prepared Statement");
        blabsForMe = pyformat(sqlBlabsForMe, [10, 0]);
        logger.info("Executing the BlabsForMe Prepared Statement");
        await connect.query(blabsForMe, [username],(err,res) => {
            if (err) {
                throw err
            }
            blabsForMeResults = res;
        });

        // Store them in the Model
        feedBlabs = [];
        for (item in blabsForMeResults) {
            author = new Blabber();
            author.setUsername(item[1]);
            author.setBlabName(item[2]);

            post = new Blab();
            post.setId(item[6]);
            post.setContent(item[3]);
            post.setPostDate(item[4]);
            post.setCommentCount(item[5]);
            post.setAuthor(author);

            feedBlabs.push(post);
        }
        res.local.blabsByOthers = feedBlabs;
        res.local.currentUser = username;

        // Find the Blabs by this user
        blabsByMe = sqlBlabsByMe;
        logger.info("Executing the BlabsByMe Prepared Statement");
        await connect.query(blabsByMe,[username],(err,res) => {
            if (err) {
                throw err
            }
            blabsByMeResults = res;
        })

        // Store them in the model
        myBlabs = [];
        for (item in blabsByMeResults) {
            post = new Blab();
            post.setId(item[4]);
            post.setContent(item[1]);
            post.setPostDate(item[2]);
            post.setCommentCount(item[3]);

            myBlabs.push(post);
        }
        res.local.blabsByMe = myBlabs;
    } catch (err) {
        console.error("Error connecting to database and querying data: ", err);
    } finally {
        if (conn) conn.end(err => {
            if(err) {
               console.log("SQL error in closing connection: ", err);
            }
         })
    }
    return res.render('feed',{});
}
async function getMoreFeed(req,res){
    return null;
}
async function processFeed(req, res){
    console.log();
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
    processFeed,
}