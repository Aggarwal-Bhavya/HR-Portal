var bodyParser = require('body-parser');
var express = require('express');
var cors = require('cors');
var path = require('path');

var connection = require('./config/db');
var apiRoutes = require('./routes/api');

var app = express();


// middleware calls
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// configure our routes
app.use('/api', apiRoutes);


module.exports = app;