'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CarryOver = new Schema({
    company : {
        type : Schema.Types.ObjectId,
        ref : 'Company', 
        required : "Comapany ID is required"
    },
    from_month:{
        type:Number,
    },
    dest_month:{
        type:Number,
    },
    user:{
        type:Schema.Types.ObjectId,
        refPath:"user_type"
    },
    user_type:{
        type:String,
        enum:['User','Super_User'],
        default:"User"
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


module.exports = mongoose.model('CarryOverLog',CarryOver);
