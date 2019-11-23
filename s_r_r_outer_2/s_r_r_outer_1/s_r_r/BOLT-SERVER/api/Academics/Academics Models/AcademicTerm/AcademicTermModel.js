'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AcademicTermModel = new Schema({
    company:{
        type : Schema.Types.ObjectId,
        ref : 'Company', 
        required : "Comapany ID is required"
    },
    academic_term_name:{
        type:String
    },
    months:{
        type:Number
    },
    programme:{
        type:Schema.Types.ObjectId
    },
    isActive:{
        type:Boolean,
        default:true
    },
    subjects:[{
        subject_id:{
            type:Schema.Types.ObjectId
        },
        credit:{
            type:Number
        },
        subject_type:{
            type:String
        },
        total_lectures: {
        type: Number
        },
        time_frame: {
            type: Number
        },
    }],
    start_month: {
        type: Number
    },
    additional_subjects_group:[{
        subjects: [{
            type: String
        }
        ],
        min_credits: {
            type: Number
        },
        min_subjects_group: {
            type: Number
        },
        min_subjects: {
            type: Number
        }
    }]
});

module.exports = mongoose.model('AcademicTerm',AcademicTermModel);
