async function renderGet(req, res) {
    try {
        if (req.session.username) {
            return res.redirect('/feed')
        }

        res.locals.username = ""

        return res.render('login', {})
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}

module.exports = { renderGet }

