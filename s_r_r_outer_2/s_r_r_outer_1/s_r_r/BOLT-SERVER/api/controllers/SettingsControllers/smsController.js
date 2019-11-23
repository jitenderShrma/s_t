'use strict';

var mongoose = require('mongoose');
var SMSsettings = mongoose.model('SMSsettings');


//SMS SETTING

exports.add_a_setting = function(req,res,next){
    SMSsettings.create({
        company:req.session.company,
        api_key:req.body.api_key,
        sender_name:req.body.sender_name,
    },
    function(err,setting){
        if(err)
            res.send(err);
        res.json(setting);    

    });
};

// VIEW SETTING
exports.view_a_setting = function(req,res){
    SMSsettings.findOne({company:req.session.company},function(err,setting){
        if(err)
            res.send(err);
        res.json(setting);    

    });
};

//Update SMS Settings
exports.update_a_setting = function(req,res){
    SMSsettings.findOneAndUpdate({company:req.session.company}, req.body, {new: true, runValidators:true},function(err,setting){
        if(err)
            res.send(err);
         res.json(setting);   

    });
};


