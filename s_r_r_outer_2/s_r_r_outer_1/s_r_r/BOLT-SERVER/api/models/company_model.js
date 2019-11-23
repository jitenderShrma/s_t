'use strict'
var mongoose = require('mongoose');
require('mongoose-type-url');
require('mongoose-type-email');
var Schema = mongoose.Schema;


var CompanySchema = new Schema({
    super_user : {
        type : Schema.Types.ObjectId,
        ref : 'Super_User',
        required : 'Enter the User ID'
    },
    company_name : {
        type : String,
        required : "Please Enter the Company's Name"
    },
    company_type : {
        type : String,
        required : "Please Select the Type of Business",
    },
    add_attributes : [
        {
            type:Schema.Types.ObjectId,
            ref:'add_Attributes'
        }
    ],
    address : [
    {
        compAdd : {
            type : String,
        },
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
    }
    ],
    vendors : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Vendor'
        }
    ],
    labels : [
        {
            type : Schema.Types.ObjectId,
            ref:'Label'
        }
    ]
});

module.exports = mongoose.model('Company', CompanySchema);