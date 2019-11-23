'use strict'
var mongoose = require('mongoose');
require('mongoose-type-url');
require('mongoose-type-email');

var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    company : {
        type : Schema.Types.ObjectId,
        ref : 'Company', 
        required : "Company ID is required"
    },
    user_name : {
        type : String,
        required : 'Please Enter the Username',
        unique: true,
        dropDups: true
    },
    password : {
        type : String,
        required : 'Password is required'
    },
    personal_details:{
        name:{
            type:String
        },
        profile_picture:{
            type:String,
        },
        fathers_name:{
            type:String
        },
        mothers_name:{
            type:String
        },
        email : {
            type : mongoose.SchemaTypes.Email
        },
        mobile:{
            type:String,
        },
        address : [{
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
                }
                
            }],
         blood_group:{
             type:String,
         },
         identification:[{
             id_type:{
                type:String
             },
             id_number:{
                 type:String
             },
             upload:{
                 type:String
             },
         }]   
    },
    user_type : {
        type: Schema.Types.ObjectId,
        refPath:"onType",
        required: "Select a Usertype"
    },
    onType:{
        type:String,
        enum: ['Vendor','Staff']
    },
    user_permissions:[
        {
            module_name:String,
            read:{
                type:Boolean,
                default:false,
            },
            write:{
                type:Boolean,
                default:false,
            },
            edit:{
                type:Boolean,
                default:false,
            },
            delete:{
                type:Boolean,
                default:false,
            }

        }
    ],
    additional_permissions:[
        {
            module_name:String,
            read_all:{
                type:Boolean,
                default:false
            },
            read_own:{
                type:Boolean,
                default:true
            },
            edit_own:{
                type:Boolean,
                default:true
            },
            delete_own:{
                type:Boolean,
                default:true
            }
        }

    ],
    approval_permissions:{
        by_department:{
            status:{
                type:Boolean,
                default:true,
            }
        },
        by_heads:{
            status:{
                type:Boolean,
                default:false,
            },
            allowed_heads:[Schema.Types.ObjectId]
        
        }

    },
    user_group:{
        type:Schema.Types.ObjectId
    },
    add_attributes : [
        {
            type:Schema.Types.ObjectId,
            ref:'add_Attributes'
        }
    ],
    labels : [
        {
            type : Schema.Types.ObjectId,
            ref:'Label'
        }
    ],
    bank_account_details:{
        account_holder_name:{
            type:String
        },
        account_number:{
            type:String
        },
        bank_name:{
            type:String
        },
        branch:{
            type:String
        },
        ifsc_code:{
            type:String
        }
    },
    pan_details:{
        pan_number:{
            type:String
        },
        pan_upload:{
            type:String,
        }
    },
    created_date : {
        type:String,
        default:new Date()
    },
    isProfessor : {
        type:Boolean,
        default:false
    },
    substitution_details : [
        {
            subject : {
                type:Schema.Types.ObjectId,
                ref:'Subject'
            },
            substitutions : [
                {
                    type:Schema.Types.ObjectId,
                    ref:'User'
                }
            ]
        }
    ]

},{strict: false});


UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema);