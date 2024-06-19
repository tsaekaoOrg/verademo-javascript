
async function feed(req, res) {
    if (req.method === 'GET') {
        username = request.session.get('username');
        if (!username) {
            loggers.info("User is not Logged In - redirecting...");
            return res.redirect('/login?target=feed');
        }
        loggers.info("User is logged in");
    }
}

async function showFeed(req, res){
    res.render('feed');
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