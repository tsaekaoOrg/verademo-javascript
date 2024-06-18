
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