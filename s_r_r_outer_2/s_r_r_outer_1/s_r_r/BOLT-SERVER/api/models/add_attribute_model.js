'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AddAttributeSchema = Schema({

    super_user:{
        type : Schema.Types.ObjectId,
        ref : 'Super_User',
        required : 'Enter the User ID'
    },
    field_name : {
        type : String,
        required : "Enter the Field Name"
    },
    description : {
        type : String
    },
    field_type:{
        type:String,
    },
    context:{
        type:String,
    },
});

module.exports = mongoose.model('add_Attribute', AddAttributeSchema);