'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommunicationSchema = new Schema({
    super_user:{
        type : Schema.Types.ObjectId,
        ref : 'Super_User',
    },
    module_name:{
        type:String,
        required:"Please Provide the Module Name",
    },
    global:{
        type:Boolean,
        default:true,
    },
    in_use:{
        type:Boolean,
        default:true,
    },
    labels : [
        {
            type : Schema.Types.ObjectId,
            ref:'Label'
        }
    ]

});

CommunicationSchema.index({ super_user: 1, module_name: 1}, { unique: true });

module.exports = mongoose.model('Communications', CommunicationSchema);

