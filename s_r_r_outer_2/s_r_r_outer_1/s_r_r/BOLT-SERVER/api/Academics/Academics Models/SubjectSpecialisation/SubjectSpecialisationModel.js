'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SpecialisationSchema = new Schema({
    company:{
        type : Schema.Types.ObjectId,
        ref : 'Company', 
        required : "Comapany ID is required"
    },
    specialisation_name:{
        type:String
    },
    subject:{
        type:Schema.Types.ObjectId
    }

});

module.exports = mongoose.model('Specialisation',SpecialisationSchema);
