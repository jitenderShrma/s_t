'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProgrammeModel = new Schema({
    company:{
        type : Schema.Types.ObjectId,
        ref : 'Company', 
        required : "Comapany ID is required"
    },
    programme_name:{
        type:String
    },
    programme_department:{
        type:Schema.Types.ObjectId

    },
    isActive:{
        type:Boolean,
        default:true
    },
    programme_duration:{
        type:String
    },
    programme_credits:{
        type:Number
    },
    valid_from:{
        type:String
    },
    valid_to:{
        type:String
    }

});


module.exports = mongoose.model('Programme',ProgrammeModel);
