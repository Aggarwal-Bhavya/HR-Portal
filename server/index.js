require('dotenv').config();
var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');
var cors = require('cors');
var path = require('path');
var passport = require('passport');


var connection = require('./config/db');
var apiRoutes = require('./routes/api');

var app = express();

// middleware calls
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: true
    })
);

app.use(passport.initialize());

// configure our routes
app.use('/api', apiRoutes);


module.exports = app;