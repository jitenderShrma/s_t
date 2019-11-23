'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AddressSchema = Schema({
    id : {
        type : Schema.Types.ObjectId,
        ref : 'Company'
    },
    tags : {
        type : [String],
        required : "Enter atleast one Tag"
    },
    context : {
        type : String,
    },
    address : {
        country : {
            type : String,
        },
        state : {
            type : String,
        },
        zip : {
            type : String,
        },
        phone : {
            type : String,
        },
        email : {
            type : mongoose.SchemaTypes.Email
        }
    },
    labels : [
        {
            type : Schema.Types.ObjectId,
            ref:'Label'
        }
    ]
});


module.exports = mongoose.model('Address', AddressSchema);