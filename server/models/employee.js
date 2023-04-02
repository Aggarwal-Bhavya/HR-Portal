var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var objectId = mongoose.Schema.Types.ObjectId;

var employeeSchema = new Schema({
    employeeCode: {
        type: objectId,
        auto: true,
        required: true,
        unique: true
    }, 
    firstName: {
        type: String,
        min: 3,
        required: true
    },
    lastName: {
        type: String,
        min: 3, 
        default: ""
    },
    reportingTo: {
        managerId: {
            type: objectId,
            required: false
        },
        managerName: {
            type: String,
            default: ""
        },
        role: {
            type: String, 
            default: ""
        }
    },
    designation: {
        type: String,
        default: ""
    }, 
    employeeEmail: {
        type: String,
        min: 5,
        required: true,
        unique: true
    }, 
    personalEmail: {
        type: String,
        min: 5,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dateOfLeaving: {
        type: Date
    },
    department: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date
    },
    bloodGroup: {
        type: String,
        min: 2,
        required: true
    }, 
    gender: {
        type: String,
        enum: ["male", "female", "other", "rda"],
        required: true
    },
    aadharNumber: {
        type: Number,
        min: 12,
        unique: true
    },
    panNumber: {
        type: String,
        min: 10,
        default: ""
    },
    visaType: {
        type: String,
        default: ""
    },
    maritalStatus: {
        type: String,
        enum: ["married", "single", "rda"]
    },
    currentAddress: {
        type: String,
        required: true
    },
    permanentAddress: {
        type: String,
        required: true
    },
    employeeRole: {
        type: String,
        enum: ["superadmin", "companyadmin", "branchadmin", "departmenthead", "hradmin", "employee"],
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    branch: {
        branchId: {
            type: objectId,
            required: false
        },
        branchName: {
            type: String,
            default: ""
        },
        branchCity: {
            type: String,
            default: ""
        }
    },
    company: {
        companyId: {
            type: objectId,
            required: false
        },
        companyName: {
            type: String,
            default: ""
        }
    }
}, 
{
    timestamps: true
});


var Employee = mongoose.model('employees', employeeSchema);

module.exports = Employee;