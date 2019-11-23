'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-type-url');
const AutoIncrement = require('mongoose-sequence')(mongoose);
var mongoosePaginate = require('mongoose-paginate');

var TransactionSchema = new Schema({
    company: {
        type:Schema.Types.ObjectId,
        ref:'Company'
    },
    user : {
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    transaction_type : {
        type:String
    },
    trans_id:{
        type:Number
    },
    transaction_id:{
        type:String,
    },
    category : {
        type:String
    },
    department : {
        type:Schema.Types.ObjectId,
        ref:'Department'
    },
    po_required: {
        type:Boolean
    },
    po_raised : {
        type:String
    },
    head:{
        type:Schema.Types.ObjectId,
        ref:'Heads'
    },
    month:{
        type:String
    },
    amount : {
        type:String
    },
    quotes : [{
        type:Schema.Types.ObjectId,
        ref:'Quote'
    }],
    vendor :{
        type:Schema.Types.ObjectId,
        ref:'Vendor'
    },
    cash : {
        type:String
    },
    status : {
        type:String,
        default:"PENDING"
    },
    bill_number:{
        type:String
    },
    bill_file_path:{
        type:String
    },
    bill:[{
        type:Schema.Types.ObjectId,
        ref:'Bills'
    }],
    isApproved:{
        type:Boolean
    },
    approvalCode : {
        type:String
    },
    notes:{
        type:String
    },
    createdAt :{
        type:Date,
        default:Date.now
    }
});

TransactionSchema.plugin(mongoosePaginate);
TransactionSchema.plugin(AutoIncrement,{id:'trans_seq',inc_field: 'trans_id',reference_fields: ['approvalCode']});
module.exports = mongoose.model('Transaction', TransactionSchema);
