'use strict';
var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;


var NotificationSchema = new Schema({
    company : {
        type : Schema.Types.ObjectId,
        ref : 'Company', 
        required : "Comapany ID is required"
    },
    context:{
        type:String,
        ref:'Context'
    },
    notification:{
        type:String
    }


});