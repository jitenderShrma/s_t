'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TypePermissionSchema = new Schema({
    company : {
        type : Schema.Types.ObjectId,
        ref : 'Company', 
        required : "Comapany ID is required"
    },
    user_type : {
        type: [{
            type: Schema.Types.ObjectId
          }],
         required:true,
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
    sub_groups:[{
        type : Schema.Types.ObjectId,
        ref : 'UserGroup'
    }],
    labels : [
        {
            type:String,
            ref:'Label'
        }
    ]
});
TypePermissionSchema.index({ company: 1, user_type: 1}, { unique: true });

module.exports = mongoose.model('TypePermissions', TypePermissionSchema);


