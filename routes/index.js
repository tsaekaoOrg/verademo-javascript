var express = require('express');
var toolsController = require('../src-app/controllers/toolsController.js');
var homeController = require('../src-app/controllers/homeController.js');
var resetController = require('../src-app/controllers/resetController.js');
var blabController = require('../src-app/controllers/blabController.js');
var userController = require('../src-app/controllers/userController.js');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.get('/', homeController.renderGet);

// router.get('/login', function(req, res, next) {
//   res.render('login', { title: 'Express' });
//   console.log("hello, world");
// });

// router.post('/userlogin', function(req, res, next) {
  
//   //test
// } )

router.route('/tools')
  .get(toolsController.showTools)
  .post(toolsController.processTools)

module.exports = router;
