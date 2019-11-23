var events = require('events');
var eventEmitter = new events.EventEmitter();
var mongoose = require('mongoose');
var Timeline = mongoose.model('Timeline');



var InitiateTimeline = function(company,approval_id){
    Timeline.create({
        company:company,
        approval_id:approval_id,
        log:[{
            date:Date.now(),
            event:"Request Received"
        }]
    },function(err,timeline){
        if(err){
            console.log("Error: "+err);
        }else{
            console.log("timeline initiated");
        }

    });

};

var UpdateTimeline = function(approval_id,event){
    Timeline.findOneAndUpdate({approval_id:approval_id},{$push:{log:{date:Date.now(),event:event}}},{new:true}).exec(function(err,timeline){
        if(err){
            console.log("err");
        }else{
            console.log("timeline updated");
            
        }

    });

};


eventEmitter.on('Initiate',InitiateTimeline);
eventEmitter.on('UpdateTimeline',UpdateTimeline);

module.exports = eventEmitter;

