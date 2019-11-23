'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var SubjectModel = new Schema({
    company:{
        type : Schema.Types.ObjectId,
        ref : 'Company', 
        required : "Comapany ID is required"
    },
    subject_name:{
        type:String,
        required: "Please Enter Subject name "
    },
    subject_code:{
        type:String,
        unique:true
    },
    speciality:[Schema.Types.ObjectId],
    subject_credits:{
        type:Number
    },
    max_marks:{
        type:Number
    },
    parent_subject:{
        type:Schema.Types.ObjectId
    },
    lft:{
        type:Number,
        default:0
    },
    rgt:{
        type:Number,
        default:1
    },
    subject_tree_id:{
        type:String
    },
    tags:[Schema.Types.ObjectId]
});

module.exports = mongoose.model('Subject',SubjectModel);
