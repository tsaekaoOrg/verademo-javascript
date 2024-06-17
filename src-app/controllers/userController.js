const showLogin = async (req, res, next) => {
    try {
        var target = req.query.target
        var username = req.query.username

        if (req.session.username) {
            if (req.query.target) {
                return res.redirect(target)
            } else {
                return res.redirect('feed')
            }
        }

        // User user = UserFactory.createFromRequest(httpRequest);
		// if (user != null) {
		// 	Utils.setSessionUserName(httpRequest, httpResponse, user.getUserName());
		// 	logger.info("User is remembered - redirecting...");
		// 	if (target != null && !target.isEmpty() && !target.equals("null")) {
		// 		return "redirect:" + target;
		// 	} else {
		// 		// default to user's feed
		// 		return Utils.redirect("feed");
		// 	}
		// } else {
		// 	logger.info("User is not remembered");
		// }

		if (!username) {
			username = "";
		}

		if (!target) {
			target = "";
		}

        return res.render('login', {username, target})
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}

const processLogin = async (req, res, next) => {
    try {
        
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}

module.exports = { showLogin, processLogin }

