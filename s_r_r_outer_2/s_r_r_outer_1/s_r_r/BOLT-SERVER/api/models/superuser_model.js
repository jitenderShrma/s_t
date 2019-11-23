'use strict'

//define
var mongoose = require('mongoose');
require('mongoose-type-url');
require('mongoose-type-email');


var Schema = mongoose.Schema;

var SuperUserSchema = new Schema({
    user_name : {
        type : String,
        required : 'Please Enter the Username',
    },
    password : {
        type : String,
        required : 'Please Provide a Password',
    },
    email : {
        type : mongoose.SchemaTypes.Email,
        required: 'Please Provide a Email',
    },
    phone : {
        type : String,
    },
    communications:[String]
});

module.exports = mongoose.model('Super_User', SuperUserSchema);