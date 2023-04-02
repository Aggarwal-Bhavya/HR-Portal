var Employee = require('../../models/employee');

var checkUser = {
    checkUser: function (req, res) {
        Employee
            .findOne({
                $and: [
                    { isActive: true },
                    { employeeEmail: req.body.employeeEmail },
                    { password: req.body.password }
                ]
            })
            .then(function (item) {
                if (item) {
                    console.log('Found user');
                    res.status(201).json({
                        message: 'Found user',
                        userData: item
                    })
                } else {
                    console.log('Not found');
                    res.status(401).json({
                        message: 'Not found',
                        data: item
                    })
                }
            })
            .catch(function (err) {
                console.log('Login error fail     ', err);
                res.status(500).json({
                    message: 'Login failed',
                    data: err
                })
            })
    }
};

module.exports = checkUser;