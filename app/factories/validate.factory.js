///<reference path="../app.js" />

app.factory('validateFactory', [
    function () {
        var factory = {};

        factory.validateName = function (name) {
            var re = /^[a-zA-Z ]{3,30}$/;
            return re.test(name);
        };

        factory.validateEmail = function (email) {
            var re = /^([a-z A-Z 0-9 \. -]+)@([0-9 a-z A-Z -]+).([a-z]{2,8})$/;
            return re.test(email);
        };

        factory.validateNumber = function (number) {
            var re = /^[0-9]{10,10}$/;
            return re.test(number);
        };

        factory.validateAadhar = function (number) {
            var re = /^\d{12}$/;
            return re.test(number);
        };

        factory.validateCity = function (city) {
            var re = /^[a-zA-Z ]{2,30}$/;
            return re.test(city);
        };

        factory.validatePinCode = function (pincode) {
            var re = /^[1-9][0-9]{5}$/;
            return re.test(pincode);
        };

        factory.validateAddress = function (address) {
            var re = /^[a-zA-Z0-9\s,'-]*$/;
            return re.test(address);
        };

        return factory;
    }
]);