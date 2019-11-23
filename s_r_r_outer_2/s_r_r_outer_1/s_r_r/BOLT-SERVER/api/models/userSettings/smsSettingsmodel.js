'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var uniqueValidator = require('mongoose-unique-validator');


var SMSsettingSchema = new Schema({
    company : {
        type : Schema.Types.ObjectId,
        ref : 'Company', 
        required : "Comapany ID is required"
    },
    api_key:{
        type:String,
    },
    sender_name:{
        type:String,
    },
});

module.exports = mongoose.model('SMSsettings',SMSsettingSchema);


