'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TimeTableSchema = new Schema({
    academic_term:{
        type : Schema.Types.ObjectId,
        ref : 'AcademicTerm'
    },
    programme:{
        type : Schema.Types.ObjectId,
        ref : 'Programme'
    },
    section: {
        type : Schema.Types.ObjectId,
        ref : 'Section'
      },
      subjects:[{
            subject: {
                type : Schema.Types.ObjectId,
                ref : 'Subject'
            },
            professor: {
                type : Schema.Types.ObjectId,
                ref : 'User'
            },
            lectures: [{
                day: {
                    type: String
                },
                number_of_lectures: {
                    type: Number
                }
            }]
        }]
});

module.exports = mongoose.model('TimeTablePlanner',TimeTableSchema);
