'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TimeLineSchema = new Schema({
    company : {
        type : Schema.Types.ObjectId,
        ref : 'Company', 
        required : "Comapany ID is required"
    },
    approval_id:{
        type:Schema.Types.ObjectId,
        ref : 'Approvals',
    },
    log:[{
        date:{
            type:Date,
            default:Date.now
        },
        event:{
            type:String,
        }
    }]

});

module.exports = mongoose.model('Timeline',TimeLineSchema);
