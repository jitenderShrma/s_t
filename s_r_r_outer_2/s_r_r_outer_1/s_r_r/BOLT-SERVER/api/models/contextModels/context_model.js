'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var uniqueValidator = require('mongoose-unique-validator');
const ContextSchema = new Schema({
  
  _id:{
    type:String,
    auto:true
  },
  context_name :{
    type:String,
    unique:true,
  },
  short_codes:[{
    name:{
      type:String,
    },
    description:{
      type:String,
    }
  }],
});


ContextSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Context',ContextSchema);