// importing modules
var express = require('express');
var cors = require('cors');
var path = require('path');
var bodyParser = require('body-parser');
// var routes = require('./server/routes/web');
var apiRoutes = require('./server/routes/api');
var connection = require('./server/config/db');
// creating express server
var app = express();

// middleware calls
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// setting static files location './app' for angular app and js
app.use(express.static(path.join(__dirname, 'app')));
// setting static files location './node_modules' for libs like angular, bootstrap
// app.use(express.static('node_modules'));

// configure our routes
// app.use('/', routes);
app.use('/api', apiRoutes);

// setting port number for running server
var port = process.env.port || 5000;

// starting express server
app.listen(port, function() {
    console.log(`Server is running at ${port}`);
});