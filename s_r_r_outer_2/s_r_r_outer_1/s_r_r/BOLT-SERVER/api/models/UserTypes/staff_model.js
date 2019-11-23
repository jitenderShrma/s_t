'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StaffSchema = new Schema({
    company : {
        type : Schema.Types.ObjectId,
        ref : 'Company', 
        required : "Comapany ID is required"
    },
    designation:{
        type:Schema.Types.ObjectId,
        ref:'Designation'
    },
    department:{
        type:Schema.Types.ObjectId,
        ref:'Department'
    },
    education:[{
        qualification:{
            type:String,
            enum:['Under Graduate','Graduate','Post Graduate','Doctorate','Other']
        },
        description:{
            type:String
        }
    }],
    user :{
        type:Schema.Types.ObjectId,
        ref:'User'
    }

});

module.exports = mongoose.model('Staff',StaffSchema);
