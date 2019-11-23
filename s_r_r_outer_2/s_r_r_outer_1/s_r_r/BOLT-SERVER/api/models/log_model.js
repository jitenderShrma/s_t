'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LogSchema = new Schema({
    date: {
        type:Date,
        default:Date.now,
    },
    by:{
        type: String,
        default: "System",
    },
    system_notes:{
        type:String,
    },
    context:{
        type:String,
    },
    user_notes:{
        type:String,
    },
    visibility:{
        type:[{
            type: String,
            enum: ['yes','no']
          }],
          default:['no']
    },
    labels : [
        {
            type : Schema.Types.ObjectId,
            ref:'Label'
        }
    ]
});

module.exports = mongoose.model('Log', LogSchema);

