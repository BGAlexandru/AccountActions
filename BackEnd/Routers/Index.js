//folder paths
const folder_node = '../Scripts/node_modules/';
//extensions
const path = require('path');
const express = require(path.join(folder_node, '/express'));
//req.originalUrl = req.baseUrl + req.url
const router = express.Router();
router.use('/server', require("./User_Profile/Index"));
router.use('/', require("./View"));
module.exports = router;