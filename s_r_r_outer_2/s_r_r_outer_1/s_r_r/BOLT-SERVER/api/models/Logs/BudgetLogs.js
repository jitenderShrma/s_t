'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BudgetLog = new Schema({
    company : {
        type : Schema.Types.ObjectId,
        ref : 'Company', 
        required : "Comapany ID is required"
    },
    head_id:{
        type:Schema.Types.ObjectId,
        ref:'Heads',
        unique:true
    },
    log:[{
        date:{
            type:Date,
            default:Date.now
        },
        event:{
            type:String,
        }
    }]

});

module.exports = mongoose.model('BudgetLog',BudgetLog);