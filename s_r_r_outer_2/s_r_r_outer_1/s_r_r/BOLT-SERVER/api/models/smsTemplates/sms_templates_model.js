'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const MessageTemplateModel = new Schema({
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
    context : {
            type : String,
            ref : 'Context'
    }, 
    sendername : String,
    message : String,
    labels : [
        {
            type : Schema.Types.ObjectId,
            ref:'Label'
        }
    ]
});

module.exports = mongoose.model('SMSTemplates',MessageTemplateModel);