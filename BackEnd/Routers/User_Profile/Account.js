//folder paths
const folder_node = '../../Scripts/node_modules/';
//extensions
const path = require('path');
const express = require(path.join(folder_node, '/express'));
const session = require(path.join(folder_node, '/express-session'));
const bcrypt = require(path.join(folder_node, '/bcrypt'));
const jwt = require(path.join(folder_node, '/jsonwebtoken'));
const JWT_SECRET = '1234abcd!@#$';
//functions
const db = require('../../Server/Database');
const app = express();
const router = express.Router();
app.use(express.json(), session({ secret: 'secret', resave: true, saveUninitialized: true }));
//handle server get/post requests
router.post('/login', async function (req, res) {
    if (!req.body.username) { return res.send({ message: "Username can't be empty!" }); }
    if (!req.body.password) { return res.send({ message: "Password can't be empty!" }); }
    const username = req.body.username.toString();
    const password = req.body.password.toString();
    let sql = 'SELECT * FROM test.Users WHERE username =?;';
    db.sql_query(sql, username, async function (err, sql_data) {
        if (err) { return console.log(err.message); }
        if (!sql_data[0]) { return res.send({ message: "Your username is wrong!" }); }
        if (!(await bcrypt.compare(password, sql_data[0].password))) { return res.send({ message: "Your Password is wrong!" }); }
        req.session.logged = true;
        req.session.user_id = sql_data[0].user_id;
        req.session.username = username;
        const token = jwt.sign({ username: username }, JWT_SECRET);
        res.send({ message: 'ok', token: token });
    });
});
router.post('/signin', async function (req, res) {
    if (!req.body.username) { return res.send({ message: "Username can't be empty!" }); }
    if (!req.body.password) { return res.send({ message: "Password can't be empty!" }); }
    if (!req.body.confirm_password) { return res.send({ message: "Confirm password!" }); }
    const username = req.body.username.toString();
    const password = req.body.password.toString();
    const confirm_password = req.body.confirm_password.toString();
    const schar = "123456789!@#$%^&*()[]{}<>?";
    const contain = function (p, c) {
        for (i = 0; i < c.length; i++) {
            if (p.includes(c[i])) { return false; }
        }
        return true;
    }
    if (password.length < 6) { return res.send({ message: "Password must be at least 6 characters long!" }); }
    if (contain(password, schar)) { return res.send({ message: "Password must contain at least one special character(" + schar + ")!" }); }
    if (password != confirm_password) { return res.send({ message: "Passwords don't match!" }); }
    //all good
    const password_checked = await bcrypt.hash(password, 10);
    //check if username alerady in use
    const sql = 'SELECT * FROM test.Users WHERE username =?;';
    db.sql_query(sql, username, async function (err, sql_data) {
        if (err) { return console.log(err.message); }
        if (sql_data.length) { return res.send({ message: "Username already in use!" }); }
        //register new user
        const sql = 'INSERT INTO test.Users VALUES (default, ?, ?);';
        db.sql_query(sql, [username, password_checked], async function (err, sql_data) {
            if (err) { return console.log(err.message); }
            req.session.logged = true;
            req.session.user_id = sql_data.insertId;
            req.session.username = username;
            const token = jwt.sign({ username: username }, JWT_SECRET)
            res.send({ message: 'ok', token: token });
        });
    });
});
module.exports = router;