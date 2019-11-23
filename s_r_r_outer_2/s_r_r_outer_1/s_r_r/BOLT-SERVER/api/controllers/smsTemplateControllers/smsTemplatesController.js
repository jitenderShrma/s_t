'use strict';

var mongoose = require('mongoose');

var SMSTemplates = mongoose.model('SMSTemplates');

//ADD A SMS TEMPLATE

exports.add_a_sms_template = function(req,res,next){

    SMSTemplates.create({
        super_user:req.session.user,
        company:req.session.company,
        context : req.body.context,
        sendername : req.body.sendername,
        message : req.body.message,
        labels : req.body.labels
    },function(err,message){
        if(err) 
            res.send(err);
        res.json(message);
    });
};

//VIEW ALL SMS TEMPLATE

exports.view_all_sms_templates = function(req,res,next){
   SMSTemplates.find({},function(err,template){
       if(err)
        res.send(err);
       res.json(template); 
   }) ;
};

//VIEW A SMS TEMPLATE

exports.view_a_sms_template = function(req,res,next){
    SMSTemplates.findOne({super_user:req.session.user,_id:req.params.smsId},function(err,template){
        if(err)
            res.send(err);
        res.json(template);    

    });
};


//EDIT A SMS TEMPLATE

exports.edit_a_sms_template = function(req,res,next){
    SMSTemplates.findOneAndUpdate({super_user:req.session.user,_id:req.params.smsId},req.body,{new:true},function(err,template){
        if(err)
            res.send(err);
         res.json(template);   

    });
};

//DELETE A SMS TEMPLATE
exports.delete_a_sms_template = function(req,res,next){
    SMSTemplates.findOneAndDelete({super_user:req.session.user,_id:req.params.smsId},function(err,template){
        if(err)
            res.send(err);
        res.json({message:"Template Deleted"});    
    });
};
