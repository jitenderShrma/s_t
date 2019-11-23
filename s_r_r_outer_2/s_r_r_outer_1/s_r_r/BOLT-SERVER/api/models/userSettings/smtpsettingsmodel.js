'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-type-email');

var uniqueValidator = require('mongoose-unique-validator');



var SMTPSettingsSchema = new Schema({
    company : {
        type : Schema.Types.ObjectId,
        ref : 'Company', 
        required : "Comapany ID is required"
    },
    user_email:{
        type : mongoose.SchemaTypes.Email,
    },
    user_password:{
        type:String,
    },
    connection:{
        type:String,

    }

});

// SMTPSettingsSchema.plugin(uniqueValidator);

module.exports = mongoose.model('SMTPsettings',SMTPSettingsSchema);


