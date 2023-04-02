// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
// var objectId = mongoose.Schema.Types.ObjectId;

// var attendanceSchema = new Schema({
//     employee: {
//         employeeId: {
//             type: objectId,
//             required: true
//         },
//         employeeEmail: {
//             type: String,
//             required: true
//         },
//         employeeName: {
//             type: String,
//             required: true
//         }
//     },
//     reportingTo: {
//         managerId: {
//             type: objectId,
//             required: false
//         },
//         managerName: {
//             type: String,
//             default: ""
//         },
//         managerEmail: {
//             type: String,
//             default: ""
//         }
//     },
//     branch: {
//         branchId: {
//             type: objectId,
//             required: false
//         },
//         branchName: {
//             type: String,
//             default: ""
//         },
//         branchCity: {
//             type: String,
//             default: ""
//         }
//     },
//     company: {
//         companyId: {
//             type: objectId,
//             required: false
//         },
//         companyName: {
//             type: String,
//             default: ""
//         }
//     },
//     present: {
//         date: {
//             type: Date,
//             required: false
//         },
//         timeIn: {
//             type: Date,
//             required: false
//         },
//         timeOut: {
//             type: Date,
//             required: false
//         },
//         hoursWorked: {
//             type: Number,
//             required: false
//         }
//     },
//     status: {
//         type: String,
//         enum: ["present", "half-day", "leave", "pending"],
//         default: "pending"
//     },
//     leave: {
//         leaveType: {
//             type: String,
//             enum: ["casual", "sick", "personal", "vacation", "emergency"],
//             required: false
//         },
//         leaveId: {
//             type: objectId,
//             required: false
//         },
//         date: {
//             type: Date,
//             required: false
//         },
//         comments: {
//             type: String, 
//             required: false
//         }
//         // startDate: {
//         //     type: Date,
//         //     required: false
//         // },
//         // endDate: {
//         //     type: Date,
//         //     required: false
//         // },
//         // duration: {
//         //     type: Number,
//         //     required: false
//         // },
//         // approvalStatus: {
//         //     type: String,
//         //     enum: ["approved", "rejected", "pending"],
//         //     required: false
//         // },
//         // comments: {
//         //     type: String,
//         //     required: false
//         // }
//     }
// },
//     {
//         timestamps: true
//     }
// );

// var Attendance = mongoose.model('attendance', attendanceSchema);

// module.exports = Attendance;