'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var PermissionSchema = new Schema({
    super_user:{
        type : Schema.Types.ObjectId,
        ref : 'Super_User',
        required : 'Enter the User ID'
    },
    user_group: {
        type:String,
        required: "Please enter a user type",
        unique:true
    },
    parent_group:{
        type: [{
            type: String,
            enum: ['Super Admin','Student','Staff','Vendor','Guardian','Guest']            
          }],
    },
    modules:[{

        module_name:{
            type:String,
        },
        permission:{
            type: [String],
        },
    }],
   labels : [
        {
            type : Schema.Types.ObjectId,
            ref:'Label'
        }
    ]

});

PermissionSchema.index({ super_user: 1, user_group: 1}, { unique: true });


module.exports = mongoose.model('Permissions',PermissionSchema);
