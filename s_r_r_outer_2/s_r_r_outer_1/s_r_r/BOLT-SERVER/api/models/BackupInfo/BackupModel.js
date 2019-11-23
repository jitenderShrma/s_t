'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Backup = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        refPath:"user_type"
    },
    user_type:{
        type:String,
        enum:['User','Super_User'],
        default:"User"
    },
    backup_name:{
        type:String
    },
    path:{
        type:String
    }

});

module.exports = mongoose.model('Backup',Backup);
