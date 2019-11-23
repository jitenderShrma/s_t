'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

const Heads = new Schema({
 	company : {
        type : Schema.Types.ObjectId,
        ref : 'Company', 
        required : "Comapany ID is required"
    },
    tree_id:{
        type:String
    },
    head_key:{
        type:String,
        unique: true
    },
    department : {
        type: Schema.Types.ObjectId,
        ref : 'Department'
    },
    permissible_values:{
      type: [Number],
      default:[0,0,0,0,0,0,0,0,0,0,0,0]
    },
    amount_left:{
        type:[Number],
        default:[0,0,0,0,0,0,0,0,0,0,0,0]
    },
    carry_over_amount:{
        type:[Number],
        default:[0,0,0,0,0,0,0,0,0,0,0,0]
    },
    accounting_head:{
        type:String
    },
    name:{
        type:String,
    },
    parent_head:{
        type:Schema.Types.ObjectId,
        ref:'Heads'
    },
    labels : [
        {
            type : Schema.Types.ObjectId,
            ref:'Label'
        }
    ],
    notes : {
        type:String
    },
    lft:{
        type:Number,
        default:0
    },
    rgt:{
        type:Number,
        default:1
    },
    level:{
        type:Number
    },
    year:{
        type:String
    }
    
});
 Heads.plugin(uniqueValidator);
 module.exports = mongoose.model('Heads',Heads);