'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({

    date:{
        type:Date,
        default:Date.now,
    },
    assigned_to:{
        type:String,
        default:"System",
    },
    assigned_by:{
        type : Schema.Types.ObjectId,
        ref : 'Super_User',
        required : 'Enter the User ID'
    },
    task_context:{
        type:String,
        required:"Please Enter the task Assigned",
    },
    alert_by:{
        type: [{
            type: String,
            enum: ['EMail','Message','None','EandM']
          }],
          default:['None']
    },
    labels : [
        {
            type : Schema.Types.ObjectId,
            ref:'Label'
        }
    ]
});


module.exports = mongoose.model('Tasks',TaskSchema);
