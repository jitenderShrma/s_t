'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VendorLedgerSchema = new Schema({
    company : {
        type : Schema.Types.ObjectId,
        ref : 'Company', 
        required : "Company ID is required"
    },
    credit:{
        type:String
    },
    debit:{
        type:String
    },
    transaction_id:{
        type : Schema.Types.ObjectId,
        ref : 'Transaction'
    },
    discount:{
        type:String
    }


});