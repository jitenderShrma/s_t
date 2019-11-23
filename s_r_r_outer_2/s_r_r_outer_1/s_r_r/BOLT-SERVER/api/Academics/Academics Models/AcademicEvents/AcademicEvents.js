'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
    company:{
        type : Schema.Types.ObjectId,
        ref : 'Company', 
        required : "Comapany ID is required"
    },
    programme:{
        type:Schema.Types.ObjectId
    },
    academic_term:{
        type:Schema.Types.ObjectId
    },
    section:{
        type:Schema.Types.ObjectId
    },
    students:[Schema.Types.ObjectId],
    event_name:{
        type:String
    },
    event_type:{
        type:String
    },
    start_date:{
        type:Date,
        default:Date.now
    },
    end_date:{
        type:Date,
        default:Date.now
    },
    venue:{
        type:String
    }



});

module.exports = mongoose.model('AcademicEvent',EventSchema);
