var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var Employee = require('../employee-operations/employee.model');

var checkUser = {
    checkUser: function(req, res) {
        Employee
            .findOne({
                $and: [

                    {'employeeDetails.employeeEmail': req.body.employeeEmail},
                    {isActive: true}
                ]
            })
            .then(async function (result) {
                // console.log(res)
                var match = await bcrypt.compare(req.body.password, result.passwordHash);
                var privateKey = process.env.secretKey;
                // var match = req.body.password === result.password;
                // console.log(req.body.password);
                // console.log(result.password);
                if(match) {
                    var params = {
                        id: result._id,
                        email: result.employeeDetails.employeeEmail,
                    };

                    jwt.sign(params, privateKey, { expiresIn: "23h" }, function (err, token) {
                        if(err) {
                            console.log('Error generating token  ', err)
                        } else {
                            // console.log('Token   ', token);
                            res.status(201).json({
                                userData: result,
                                token: token
                            })
                        }
                    })
                } else {
                    res.status(500).json({
                        message: 'Incorrect password'
                    })
                }
            })
            .catch(function (err) {
                console.log('Login error   ', err);
                res.status(403).json({error: err});
            })
    }
};

module.exports = checkUser;