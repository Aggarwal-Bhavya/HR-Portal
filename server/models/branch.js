// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
// var objectId = mongoose.Schema.Types.ObjectId;

// var branchSchema = new Schema({
//     branchName: {
//         type: String,
//         required: true
//     },
//     departments: {
//         type: Array
//     }, 
//     address: {
//         type: String, 
//         required: true
//     },
//     city: {
//         type: String,
//         required: true
//     },
//     contactNumber: {
//         type: Array
//     },
//     isActive: {
//         type: Boolean,
//         default: true
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
//     }
// }, 
// {
//     timestamps: true
// });

// var Branch = mongoose.model('branches', branchSchema);

// module.exports = Branch;