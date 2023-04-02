var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var objectId = mongoose.Schema.Types.ObjectId;

var companySchema = new Schema({
    companyName: {
        type: String,
        min: 3,
        required: true,
        unique: true
    },
    companyLogo: {
        type: String,
        unique: true
    },
    email: {
        type: Array,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Array,
        required: true
    },
    dateOfLeaving: {
        type: Date,
        default: ""
    },
    companyWebsite: {
        type: String,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
});

var Company = mongoose.model('companies', companySchema);

module.exports = Company;