'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const CommunicationLog = new Schema({

    super_user:{
        type : Schema.Types.ObjectId,
        ref : 'Super_User',
    },
    context : {
        type : String,
        ref : 'Context',
    }, 
    to : {
        type:String,
    },
    from : {
      type:String,
    },
    status : {
      type: String,
      default:"Pending",
    },
    plugin:{
      type:String,
    },
    created_date: {
      type:Date,
      default:Date.now,
    },
    sent_date:{
        type:Date,
        default:Date.now,
    },
    labels : [
        {
            type : Schema.Types.ObjectId,
            ref:'Label'
        }
    ]


});

module.exports = mongoose.model('CommunicationLogModel', CommunicationLog);