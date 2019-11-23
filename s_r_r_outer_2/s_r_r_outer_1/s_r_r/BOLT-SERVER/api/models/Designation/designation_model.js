'use strict';

var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AutoIncrement = require('mongoose-sequence')(mongoose);



const Designation = new Schema({
    company : {
        type : Schema.Types.ObjectId,
        ref : 'Company', 
        required : "Comapany ID is required"
    },
    department : {
        type: Schema.Types.ObjectId,
        ref : 'Department'
    },
    name :{
        type:String,
    },
    designation_tree_id:{
        type:Number,
    },
    parent_designation_id:{
        type:Schema.Types.ObjectId,
    },
    lft:{
        type:Number,
        default:0
    },
    rgt:{
        type:Number,
        default:1

    },
    labels : [
        {
            type : Schema.Types.ObjectId,
            ref:'Label'
        }
    ]
});


Designation.plugin(AutoIncrement,{inc_field: 'designation_tree_id',disable_hooks: true});


module.exports = mongoose.model('Designation',Designation);