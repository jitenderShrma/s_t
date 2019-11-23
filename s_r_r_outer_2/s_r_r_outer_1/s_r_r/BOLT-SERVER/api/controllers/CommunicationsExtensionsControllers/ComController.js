'use strict';

var mongoose = require('mongoose');
var SMSsettings = mongoose.model('SMSsettings');
var SMTPsettings = mongoose.model('SMTPsettings');
var eventEmitter = require('../../../coms/coms_extensions');
var MailTemplates = mongoose.model('MailTemplates');
var SMSTemplates = mongoose.model('SMSTemplates');
var mustache = require('mustache');
var Handlebars = require('handlebars');
var User = mongoose.model('User');
var SuperUser = mongoose.model('Super_User');





//SMS SETTINGS FETCH

exports.get_SMS_Settings = function(req,res,next){
    SMSsettings.findOne({$or:[{super_user:req.session.user},{super_user:req.body.user}]},function(err,setting){
        if(err)
            res.send(err);
        if(setting == null){
            res.send({message:"settings not found"});
            console.log("sms settings not found")
        }else{
            res.locals.sms_settings = ({api_key:setting.api_key,sender_name:setting.sender_name});
            res.locals.from = res.locals.sms_settings.sender_name;
            // console.log(res.locals.sms_settings);
            console.log("sms settings found");
            next();  

        }   
         
    });
};

//SMTP SETTINGS FETCH

exports.get_SMTP_Settings = function(req,res,next){
    SMTPsettings.findOne({$or:[{company:req.session.company},{company:req.body.company}]},function(err,setting){
        if(err)
            res.send(err);
        if(setting == null){
            res.send({settings:"settings not found"});
            console.log("settings not found");
        } else{
            res.locals.settings = ({email:setting.user_email,password:setting.user_password});
            res.locals.from = res.locals.settings.email;
            console.log("mail settings found");
            next();
        }    
    });
};


//FETCH A MAIL TEMPLATE

exports.view_a_mail_template = function(req,res,next){
    var user_name;
    MailTemplates.findOne({company:req.body.company,context:req.body.context}).exec(function(err,template){
        if(err)
            res.send(err); 
        if(template == null){
            res.send({message:"template not found"});
            console.log("mail template not found");
        }    
        else{
            // res.json(template);
            User.findOne({_id:req.body.user}).exec(function(err,user){
                if(user == null){
                        SuperUser.findOne({_id:req.body.user}).exec(function(err,super_user){
                            if(super_user == null){
                                res.locals.to = "kaidranzer7011@gmail.com";    //DEFAULT FALLBCK MAIL
                            }else{

                                res.locals.to = super_user.email;
                                user_name = super_user.user_name;
                            }
                        });                    
                }else{
                    res.locals.to = user.personal_details.email;
                    var requester_name = req.body.requester_name || user.personal_details.name;
                    user_name = user.user_name;

                }
                res.locals.content = Handlebars.compile(template.html);
                var data = {
                    "user_name": user_name,
                    "requester_name":requester_name,
                    "amount":req.body.amount,
                    "acceptor_name":req.body.acceptor_name
                };
                // res.locals.to = "kaidranzer7011@gmail.com";
                res.locals.mail_body = res.locals.content(data);
                res.locals.subject = template.subject;
                next();

            });    
        }
    });
};

//FETCH A SMS TEMPLATE

exports.view_a_sms_template = function(req,res,next){
    SMSTemplates.findOne({company:req.body.company,context:req.body.context},function(err,template){
        if(err)
            res.send(err);
        if(template == null){
            res.send({message:"template not found", user:res.locals.response});
        }  
        else{
            User.findOne({_id:req.body.user}).exec(function(err,user){
                if(user){
                    res.locals.to = user.personal_details.mobile;
                    res.locals.content = mustache.render(template.message,{user_name:user.user_name});
                    next();
                }else{
                    SuperUser.findOne({_id:req.body.user}).exec(function(err,super_user){
                        if(super_user){
                            res.locals.to = 9818311267; //Default Fallback
                            res.locals.content = mustache.render(template.message,{user_name:super_user.user_name});
                            next();
                        }else{
                            res.locals.to = 9818311267;
                            res.locals.content = mustache.render(template.message,{user_name:super_user.user_name});
                            next();
                        }
                    });
                }
            });
        } 

    });
};




//SEND A MAIL (SMTP)

exports.send_a_mail_smtp = function(req,res,next){

    var to = res.locals.to;

    console.log("Log ID: "+res.locals.logId);
    eventEmitter.emit('mailSMTP',res.locals.settings.email,res.locals.settings.password,to,res.locals.subject,res.locals.mail_body,res.locals.logId);

    
};

//SEND A TEXT (SMS)

exports.send_a_text_sms = function(req,res,next){

    
    eventEmitter.emit('sendSMS',res.locals.sms_settings.api_key,res.locals.sms_settings.sender_name,res.locals.to,res.locals.content,res.locals.logId);
};