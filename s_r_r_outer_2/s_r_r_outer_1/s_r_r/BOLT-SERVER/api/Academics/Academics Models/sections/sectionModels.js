'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var SectionModel = new Schema({
    section_name:{
        type:String,
        required:"Please provide a section name"
    },
    max_strength:{
        type:Number
    },
    academic_term:{
        type:Schema.Types.ObjectId,
        required: "Please add an academic term"
    },
    programme:{
        type:Schema.Types.ObjectId,
        required:"Please Enter a Programme"
    }
});

SectionModel.index({ section_name: 1, academic_term: 1, programme: 1}, { unique: true });
module.exports = mongoose.model('Section',SectionModel);

