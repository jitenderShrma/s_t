'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const counter = new Schema({
    id:{
        type:String,
    },
    reference_value:{
        month:{
            type:String
        },
        year:{
            type:String
        }

    },
    seq:{
        type:Number
    }

});


module.exports = mongoose.model('counter',counter);