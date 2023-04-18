// importing modules
var app = require('./server/index');
require('dotenv').config();

// creating socket
var socketIO = require('socket.io');
var server = require('http').createServer({
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"]
    }
});
var io = socketIO(server);

// setting port number for running server
var port = process.env.port || 5000;

// starting express server
app.listen(port, function () {
    console.log(`Server is running at ${port}`);
});