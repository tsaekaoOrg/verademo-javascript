var express = require('express');
var toolsController = require('src-app/controllers/tools.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
  console.log("hello, world");
});
router.post('/userlogin', function(req, res, next) {
  
  //test
} )

router.get('/tools', toolsController.getTools);
router.post('/tools', toolsController.postTools)

module.exports = router;
