const axios = require('axios')
const userController = require('./userController')

async function renderGet(req, res) {
    try {
        console.log('check if user is logged in')
        if (req.session.username) {
            console.log('user logged in, redirecting to feed')
            host_ip = req.get('host').split(':')[0]
            axios.request({
                method: 'get',
                url: 'http://' + host_ip + ':' + req.socket.localPort + '/feed',
                maxContentLength: 5000,
            })
        }
        return userController.showLogin(req, res)
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}

module.exports = { renderGet }

