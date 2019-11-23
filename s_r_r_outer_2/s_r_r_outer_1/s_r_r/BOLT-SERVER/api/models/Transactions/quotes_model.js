'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-type-url');

var QuotesSchema = new Schema({
    company:{
        type:Schema.Types.ObjectId,
        ref:'Company'
    },
    vendor : {
        type:Schema.Types.ObjectId,
        ref:'Vendor'
    },
    title:{
        type:String
    },
    description:{
        type:String
    },
    file : {
        type:String
    },
    price :{
        type:String
    },
    isPurchased : {
        type:Boolean
    }
});

module.exports = mongoose.model('Quote', QuotesSchema);
