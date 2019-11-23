'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Payments = new Schema({
    company:{
        type:Schema.Types.ObjectId,
        ref:'Company'
    },
    transaction_id:{
        type:Schema.Types.ObjectId,
        ref:'Transaction'
    },
    payment_method:{
        type:String,
        enum: ['Cash','Cheque','NEFT','RTGS','IMPS','E-Wallet','UPI','Other']
    },
    other_payment:{
        type:String
    },
    payment_date:{
        type:Date,
        default:Date.now
    },
    payment_ref_number:{
        type:String,
    },
    notes:{
        type:String,
    }

});


module.exports = mongoose.model('Payments',Payments);
