var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var objectId = mongoose.Schema.Types.ObjectId;

var employeeSchema = new Schema({
    firstName: {
        type: String,
        minlength: 3,
        required: true
    },
    lastName: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        minlength: 8,
        // select: false
    },
    passwordHash: {
        type: String,
        required: true,
        // select: false
    },
    passwordSalt: {
        type: String,
        required: true,
        select: false
    },
    personalDetails: {
        contact: {
            personalEmail: {
                type: String,
                required: true,
                unique: true,
                minlength: 5
            },
            phoneNumber: {
                type: Number,
                min: 10
            }
        },
        dateOfBirth: {
            type: Date
        },
        bloodGroup: {
            type: String
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            lowercase: true,
            required: true
        },
        aadharNumber: {
            type: Number,
            min: 12,
            unique: true
        },
        panNumber: {
            type: String,
            minlength: 10,
            required: false
        },
        currentAddress: {
            street: {
                type: String
            },
            city: {
                type: String
            },
            pincode: {
                type: Number,
                min: 6
            }
        },
        permanentAddress: {
            street: {
                type: String
            },
            city: {
                type: String
            },
            pincode: {
                type: Number,
                min: 6
            }
        },
    },
    employeeDetails: {
        employeeEmail: {
            type: String,
            minlength: 5,
            required: true,
            unique: true
        },
        designation: {
            type: String
        },
        department: {
            type: String
        },
        dateOfLeaving: {
            type: Date
        },
    },
    employeeRole: {
        type: String,
        enum: ["superadmin", "companyadmin", "branchadmin", "departmenthead", "hradmin", "employee"],
        lowercase: true,
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
},
    {
        timestamps: true
    });


var Employee = mongoose.model('employees', employeeSchema);

module.exports = Employee;