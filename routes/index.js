var express = require('express');
var toolsController = require('../src-app/controllers/toolsController.js');
var homeController = require('../src-app/controllers/homeController.js');
var resetController = require('../src-app/controllers/resetController.js');
var blabberController = require('../src-app/controllers/blabberController.js');
var userController = require('../src-app/controllers/userController.js');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.get('/', homeController.renderGet);
//router.get('/reset', resetController.renderGet(req,res));
router.get('/test', userController.testFunc);
router.get('/login', userController.getLogin);

// router.post('/userlogin', function(req, res, next) {
  
//   //test
// } )
router.route('/login')
  .get(userController.showLogin)
  .post(userController.processLogin)

router.route('/tools')
  .get(toolsController.showTools)
  .post(toolsController.processTools)

module.exports = router;
