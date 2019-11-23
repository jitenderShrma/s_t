'use strict';

var mongoose = require('mongoose');
const Schema = mongoose.Schema;


const LabelSchema = new Schema({
	company : {
        type : Schema.Types.ObjectId,
        ref : 'Company', 
        required : "Company ID is required"
    },
    label_name : {
    	type: String,
    	required:"Enter the name of the tag"
    },
    color: {
    	type : String,
    	required : "Select a Color"
    },
    context: {
    	type : String,
    },
    description : {
    	type : String,
    }
});

module.exports = mongoose.model('Label',LabelSchema);
