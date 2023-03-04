var express = require('express');
var router = express.Router();
var path = require('path');

var absPath = path.join(__dirname, "../../app");

// route to handle homepage
// router.get("/", function(req, res, next) {
//     // res.send("hello")
//     res.sendFile(absPath + "/login.html");
// });

// router.get("/superadmin", function(req, res, next) {
//     res.sendFile(absPath + "/views/superadmin/dashboard.html");
// })

module.exports = router;