const renderGet = async (req, res, next) => {
    if (req.session.username) {
        return res.redirect('/feed')
    }

    res.locals.username = ""

    return res.render('views/login', {})
}

module.exports = renderGet;