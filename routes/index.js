const express = require('express');
const toolsController = require('../src-app/controllers/toolsController.js');
const homeController = require('../src-app/controllers/homeController.js');
const resetController = require('../src-app/controllers/resetController.js');
const blabController = require('../src-app/controllers/blabController.js');
const userController = require('../src-app/controllers/userController.js');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../resources/images'));
  },
  filename: (req, file, cb) => {
    cb(null, 'temp_' + file.originalname);
  },
});
const upload = multer({ storage : storage });

router.get('/', homeController.renderGet);
//router.get('/reset', resetController.renderGet(req,res));

router.route('/login')
  .get(userController.showLogin)
  .post(userController.processLogin)

router.get('/logout', userController.processLogout)

router.route('/register')
  .get(userController.showRegister)
  .post(userController.processRegister)

router.route('/feed')
  .get(blabController.showFeed)
  .post(blabController.processFeed)

router.route('/morefeed')
  .get(blabController.getMoreFeed)

router.route('/blab')
  .get(blabController.showBlab)
  .post(blabController.processBlab)

router.route('/blabbers')
  .get(blabController.showBlabbers)
  .post(blabController.processBlabbers)

router.route('/profile')
  .get(userController.showProfile)
  .post(upload.any(), userController.processProfile)

router.get('/downloadprofileimage', userController.downloadImage);

router.route('/register-finish')
  .get(userController.showRegisterFinish)
  .post(userController.processRegisterFinish)

router.get('/password-hint', userController.showPasswordHint);

router.route('/tools')
  .get(toolsController.showTools)
  .post(toolsController.processTools)

router.route('/reset')
  .get(resetController.showReset)
  .post(resetController.processReset)

router.route('/totp')
  .get(userController.showTOTP)
  .post(userController.processTOTP)
  
module.exports = router;
