var express = require('express');
var toolsController = require('../controllers/tools.js');
var toolsRoutes = express.Router();

toolsRoutes.get('/tools', toolsController.getTools);
toolsRoutes.post('/tools', toolsController.postTools)

module.exports = toolsRoutes;