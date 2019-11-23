'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CalendarSchema = new Schema({

    date:{
        type:Date,
        default: Date.now,
    },
    events:[{

    }],



});