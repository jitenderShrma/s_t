'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MailTemplateSchema = Schema({
    super_user:{
        type : Schema.Types.ObjectId,
        ref : 'Super_User',
        required : 'Enter the User ID'
    },
    company : {
        type : Schema.Types.ObjectId,
        ref : 'Company', 
        required : "Comapany ID is required"
    },
    context:{
        type : String,
        ref : 'Context',
        required: 'Please Provide the Context',
        unique:true
    },
    subject:{
        type:String,
    },
    cc:{
        type:String,
    },
    bcc:{
        type:String,
    },
    html:{
        type:String,
    },
    labels : [
        {
            type : Schema.Types.ObjectId,
            ref:'Label'
        }
    ]
    
});

module.exports = mongoose.model('MailTemplates', MailTemplateSchema);
