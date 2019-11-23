'use strict';


const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const Department = new Schema({
  company : {
      type : Schema.Types.ObjectId,
      ref : 'Company', 
      required : "Comapany ID is required"
  },
  department_name : {
    type : String
  },
  tree_id:{
    type:String
  },
  parent_department:{
    type:Schema.Types.ObjectId,
    ref:'Department'
  },
  lft : {
    type:Number,
    default:0
  },
  rgt : {
    type:Number,
    default:1
  },
  level : {
    type:Number
  },
  labels : [
        {
            type : Schema.Types.ObjectId,
            ref:'Label'
        }
    ]
});

// Department.index({ tree_id: 1, lft: 1, rgt:1, _id:1}, { unique: true });
module.exports = mongoose.model('Department', Department);