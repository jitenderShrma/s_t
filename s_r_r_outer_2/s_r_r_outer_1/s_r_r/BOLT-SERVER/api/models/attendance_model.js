'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AttendanceSchema = new Schema({
    company:{
        type : Schema.Types.ObjectId,
        ref : 'Company', 
        required : "Comapany ID is required"

    },
    date:{
        type:Date,
        default:Date.now
    },
    user_attendance:[{
        user:{
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        attendance:{
            type: [{
                type: String,
                enum: ['Absent','Present']
              }],
              default:['Present']
        },
    }],
});


AttendanceSchema.index({ company: 1, user_attendance: 1}, { unique: true });



module.exports = mongoose.model('Attendance', AttendanceSchema);
