var Company = require('../company-operations/company.model');

var superadminStats = {
    getCompanyCount: function (req, res) {
        Company
            .aggregate([
                {
                    $group:
                    {
                        _id: '$isActive',
                        count: {$sum : 1}
                    }
                }
            ])
            .then(function(item) {
                // console.log(item)
                res.status(201).json({
                    message: 'Company count is as',
                    countData: item
                })
            })
            .catch(function(err) {
                console.log('Error getting company count   ', err);
                res.status(500).json({
                    message: 'Error getting company count',
                    data: err
                })
            })
    }
};

module.exports = superadminStats;