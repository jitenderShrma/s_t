'use strict';
var mongoose = require('mongoose');
var Designation = mongoose.model('Designation');
var Department = mongoose.model('Department');
var Heads = mongoose.model('Heads');



exports.get_designation_with_no_department = function(req,res,next){
    Designation.find({department:undefined},function(err,designation){
        if(err){
            res.send(err);
        }else{
            res.json(designation);
        }
    });

};

exports.get_heads_with_no_department = function(req,res,next){
    Heads.find({department:undefined},function(err,heads){
        if(err)
            res.send(err);
        res.json(heads);    
    });
};


exports.get_all_departments = function(req,res,next){
    Department.find({company:req.session.company}).populate('labels').exec(function(err,departments) {
        if(err) res.send(err);
        res.json(departments);
    });
};