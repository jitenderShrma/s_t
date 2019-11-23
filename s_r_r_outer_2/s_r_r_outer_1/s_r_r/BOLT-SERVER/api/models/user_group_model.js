'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);



var UserGroupSchema = new Schema({
    company : {
        type : Schema.Types.ObjectId,
        ref : 'Company', 
        required : "Comapany ID is required"
    },
    user_type:{
        type:String,
    },
    parent_group:{
        type:Schema.Types.ObjectId
    },
    tree_id:{
        type:Number
    },
    user_group_name:{
        type:String
    },
    permissions:[
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
    labels : [
        {
            type : Schema.Types.ObjectId,
            ref:'Label'
        }
    ],
    lft:{
        type:Number,
        default:0
    },
    rgt:{
        type:Number,
        default:1
    }

},{strict: false});

// UserGroupSchema.index({ super_user: 1, user_group: 1}, { unique: true }); //NOT REQUIREDAS OF 29-06-19

UserGroupSchema.plugin(AutoIncrement,{inc_field: 'tree_id',disable_hooks: true});
module.exports = mongoose.model('UserGroup',UserGroupSchema);
