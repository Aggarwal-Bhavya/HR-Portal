var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var objectId = mongoose.Schema.Types.ObjectId;

var attendanceSchema = new Schema({
    employee: {
        employeeId: {
            type: objectId,
            required: true
        },
        employeeEmail: {
            type: String,
            required: true
        },
        employeeName: {
            type: String,
            required: true
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
        managerEmail: {
            type: String,
            default: ""
        }
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
    date: {
        // type: String
        type: Date
    },
    timeIn: {
        // type: String
        type: Date
    },
    timeOut: {
        type: Date,
        required: false,
        default: ""
    },
    hoursWorked: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["present", "absent", "half-day", "leave", "pending"],
        default: "pending"
    }
},
    {
        timestamps: true
    })

var Attendance = mongoose.model('attendance', attendanceSchema);

module.exports = Attendance;