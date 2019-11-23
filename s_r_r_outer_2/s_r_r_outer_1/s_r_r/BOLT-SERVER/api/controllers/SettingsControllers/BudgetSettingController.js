'use strict';

var mongoose = require('mongoose');
var BudgetSettings = mongoose.model('BudgetSetting');


//create a Budget Setting

exports.create_a_budget_setting = function(req,res,next){
    BudgetSettings.create({
        company:req.session.company,
        fin_year_start_month:req.body.fin_year_start_month,
        fin_year:req.body.fin_year || new Date().getFullYear(),
        level1:{
            designation:req.body.designation1,
            designation_label:req.body.label1,
            amount:req.body.amount1,
            alert_time:req.body.alert_time1
        },
        level2:{
            designation:req.body.designation2,
            designation_label:req.body.label2,
            amount:req.body.amount2,
            alert_time:req.body.alert_time2
        },
        level3:{
            designation:req.body.designation3,
            designation_label:req.body.label3,
            amount:req.body.amount3,
            alert_time:req.body.alert_time3
        },
        level4:{
            designation:req.body.designation4,
            designation_label:req.body.label4,
            amount:req.body.amount4,
            alert_time:req.body.alert_time4
        },
        level5:{
            designation:req.body.designation5,
            designation_label:req.body.label5,
            amount:req.body.amount5,
            alert_time:req.body.alert_time5
        },
        auto_cancel_time:req.body.auto_cancel_time
    },function(err,setting){
        if(err)
            res.send(err);
         res.json(setting);   

    });
};


//get budget Setting

exports.get_a_budget_setting = function(req,res,next){
    BudgetSettings.findOne({company:req.session.company},function(err,setting){
        if(err)
            res.send(err);
        res.json(setting);    
    });
};


//fetch settings middleware

exports.fetch_a_budget_setting = function(req,res,next){
    BudgetSettings.findOne({company:req.session.company},function(err,setting){
        if(err){
            res.send(err);
        }
        else if(setting == null){
            res.json({message:"Please Update Settings before performing Any tasks"});
            
        }else{
            res.locals.bud_settings = setting;
            next();

        }

    });
};

// Update a budget setting

exports.update_a_budget_setting = function(req,res,next){
    BudgetSettings.findOneAndUpdate({company:req.session.company},req.body,{new:true},function(err,setting){
        if(err)
            res.send(err);
         res.json(setting);   

    });
};



