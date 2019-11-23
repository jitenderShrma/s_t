'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var BillSchema = mongoose.Schema({
    company: {
        type:Schema.Types.ObjectId,
        ref:'Company'
    },
    bill_number : {
        type:String
    },
    bill_date:{
        type:Date,
        default:Date.now
    },
    bill_amount:{
        type:Number
    },
    bill_upload_path:{
        type:String
    },
    vendor:{
        type:Schema.Types.ObjectId,
        ref:'Vendor'
    },
    status:{
        type:String
    },
    verified:{
        by:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        isVerified  : {
            type:Boolean,
            default:false
        }
    }
});

module.exports = mongoose.model('Bills',BillSchema);
