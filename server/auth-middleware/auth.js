module.exports = {
    isSuperAdmin: function (req, res, next) {
        // console.log('middleware ', req.user);
        if (req.user.employeeRole === 'superadmin') {
            next();
        } else {
            return res.status(401).send({ err: 'unauthorized user' });
        }
    },

    isCompanyAdmin: function (req, res, next) {
        if (req.user.employeeRole === 'companyadmin') {
            next();
        } else {
            return res.status(401).send({ err: 'unauthorized user' });
        }
    },

    isBranchAdmin: function (req, res, next) {
        if (req.user.employeeRole === 'branchadmin') {
            next();
        } else {
            return res.status(401).send({ err: 'unauthorized user' });
        }
    },

    isHrAdmin: function (req, res, next) {
        if (req.user.employeeRole === 'hradmin') {
            next();
        } else {
            return res.status(401).send({ err: 'unauthorized user' });
        }
    },

    isEmployee: function (req, res, next) {
        if (req.user.employeeRole === 'departmenthead' || req.user.employeeRole === 'employee') {
            next();
        } else {
            return res.status(401).send({ err: 'unauthorized user' });
        }
    }
}