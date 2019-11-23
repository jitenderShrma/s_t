'use strict';

var mongoose = require('mongoose');
var MailTemplates = mongoose.model('MailTemplates');


//ADD A MAIL TEMPLATE
exports.add_a_mail_template = function(req,res,next){
    MailTemplates.create({
        super_user:req.session.user,
        company:req.session.company,
        context:req.body.context,
        cc:req.body.cc,
        bcc:req.body.bcc,
        subject:req.body.subject,
        html:req.body.html,
        labels : req.body.labels
    },function(err,template){
        if(err)
            res.send(err);
        res.json(template);    
    });
};

//VIEW ALL MAIL TEMPLATE
exports.view_all_mail_templates = function(req,res,next){
    MailTemplates.find({super_user:req.session.user},function(err,template){
        if(err)
            res.send(err);
        res.json(template);    
    });
};

//VIEW A MAIL TEMPLATE

 exports.view_a_mail_template = function(req,res,next){
     MailTemplates.findOne({super_user:req.session.user,_id:req.params.mailId},function(err,template){
         if(err)
            res.send(err);
         res.send(template);   
     });
 };

//EDIT A MAIL TEMPLATE
exports.edit_a_mail_template  = function(req,res,next){
    MailTemplates.find({super_user:req.session.user,_id:req.params.mailId},req.body,{new:true},function(err,template){
        if(err)
            res.send(err);
        res.json(template);    

    });

};

//DELETE A MAIL TEMPLATE
exports.delete_a_mail_template = function(req,res,next){
    MailTemplates.findOneAndDelete({super_user:req.session.user,_id:req.params.mailId},function(err,template){
        if(err)
            res.send(err);
        res.json({message:"Template Deleted"});    
    });
};