//folder paths
const folder_node = '../Scripts/node_modules/';
//extensions
const path = require('path');
const express = require(path.join(folder_node, '/express'));
const session = require(path.join(folder_node, '/express-session'));
//functions
const db = require('../Server/Database');
const app = express();
const router = express.Router();
app.use(express.json(), session({ secret: 'secret', resave: true, saveUninitialized: true }));
//handle client get/post requests
router.get(['/', '/login', '/signin'], function (req, res) {
    return res.render("Index", {
        logged: req.session.logged,
        username: req.session.username,
        req_url: req.url
    });
})
router.get('/logout', function (req, res) {
    return req.session.destroy(function (err) {
        if (err) { console.log(err.message); }
        else { res.redirect('/'); }
    });
})
module.exports = router;