var JWTStrategy = require('passport-jwt').Strategy;
var ExtractJWT = require('passport-jwt').ExtractJwt;
var Employee = require('../apis/employee-operations/employee.model');

module.exports = function (passport) {
    var params = {};
    params.secretOrKey = process.env.secretKey;
    params.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
    passport.use(new JWTStrategy(
        params,
        function (jwt_payload, cb) {
            // console.log(jwt_payload);
            // console.log('Inside passport jwt');
            Employee
                .findById({ _id: jwt_payload.id })
                .then(function (user) {
                    if (user) {
                        return cb(null, user);
                    } else {
                        return cb(null, false);
                    }
                })
                .catch(function (err) {
                    return cb(err, null);
                });
        }
    ))
};