'use strict';

var mongoose = require('mongoose');
var CommunicationLog = mongoose.model('CommunicationLogModel');



//ADD A COMMUNICATION LOG

exports.add_a_communication_log = function(req,res,next){

    CommunicationLog.create({
        super_user:req.body.user,
        context : req.body.context,
        to:res.locals.to,
        from:res.locals.from,
        status:req.body.status,
        plugin:req.body.plugin,
        sent_date: req.body.sent_date,
        labels : req.body.labels
    },function(err,log){
        if(err){
            res.send(err);
            console.log(err);
        }else{
            if(log){
                res.locals.logId = log._id;    
                next();  
            }else{
                console.log("log not Updated");
                res.locals.logId = null;
                next();
            }
        }
            
        
    });
};


//READ LOGS

exports.view_all_logs = function(req,res,next){
        CommunicationLog.find({},function(err,log){
            if(err)
                res.send(err);
             res.json(log);   
        });
};


//UPDATE A COMMINICATION LOG

exports.edit_a_log = function(req,res,next){
    CommunicationLog.findOneAndUpdate({_id:req.params.logId},req.body,{new: true, runValidators:true},function(err,log){
        if(err)
            res.send(err);
        res.json(log);    

    });
};