'use strict';

var mongoose = require('mongoose');
var SMTPsettings = mongoose.model('SMTPsettings');


//ADD A SETTING

exports.add_a_setting = function(req,res,next){
    SMTPsettings.create({
        company:req.session.company,
        user_email:req.body.user_email,
        user_password:req.body.user_password
    },function(err,setting){
        if(err)
            res.send(err);
        res.json(setting);    

    });
};

exports.view_a_setting = function(req,res,next){
    SMTPsettings.findOne({company:req.session.company},function(err,setting){
        if(err)
            res.send(err);
         res.json(setting);   

    });
};

exports.update_a_setting = function(req,res){
    SMTPsettings.findOneAndUpdate({company:req.session.company}, req.body, {new: true, runValidators:true},function(err,setting){
        if(err)
            res.send(err);
         res.json(setting);   

    });
};