'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-type-url');

var RFQSchema = new Schema({
    company: {
        type:Schema.Types.ObjectId,
        ref:'Company'
    },
    title:{
        type:String
    },
    exp_date : {
        type:Date
    },
    description : {
        type:String
    },
    quotes :[{
        type:Schema.Types.ObjectId,
        ref:'Quote'
    }]
});

module.exports = mongoose.model('RFQ', RFQSchema);