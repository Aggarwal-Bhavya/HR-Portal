var express = require('express');
var router = express.Router();
var Employee = require('../models/employee');

router
    .post('/check-superadmin-info', function (req, res) {
        console.log(req.body)
        Employee
            .findOne({
                $and: [
                    { employeeRole: "superadmin" },
                    { isActive: true },
                    { employeeEmail: req.body.employeeEmail },
                    { password: req.body.password }
                ]
            })
            .then(function(item) {
                console.log('Superadmin found');
                res.status(201).json({
                    message: 'Found superadmin',
                    data: item
                })
            })
            .catch(function(err) {
                console.log('Login error fail     ', err);
                res.status(500).json({
                    message: 'Login failed',
                    data: err
                })
            })
    });

module.exports = router;