//folder paths
const folder_node = '../Scripts/node_modules/';
//extensions
const path = require('path')
const express = require(path.join(folder_node, '/express'));
const session = require(path.join(folder_node, '/express-session'));
//functions
const app = express();
app.set('views', path.join(__dirname, '../../FrontEnd/UI/View'));
app.set('view engine', 'ejs');
app.use(express.json(), session({ secret: 'secret', resave: true, saveUninitialized: true }));
//middleware
app.use(express.static(path.join(__dirname, '../../FrontEnd/')));
app.use(express.static(path.join(__dirname, '../../DataBase/')));
//routes
app.use('/', require("../Routers/Index"));
//listen to 'localhost:port'
app.listen(8080, function (err) {
    if (err) { console.log(err.message); }
    else { console.log("Server connected"); }
})