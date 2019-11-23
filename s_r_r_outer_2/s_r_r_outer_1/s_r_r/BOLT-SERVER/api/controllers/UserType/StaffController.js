'use strict';
var mongoose = require('mongoose');
var Staff = mongoose.model('Staff');

//create a Staff

exports.create_a_staff = function(req,res,next){
    Staff.create({
       company:req.session.company,
       designation:req.body.designation,
       department:req.body.department,
       education:req.body.education
    },function(err,staff){
        if(err)
            res.send(err);
         res.json(staff);   
    });
};

// find all Staff in a company

exports.find_all_staff = function(req,res,next){
    Staff.find({company:req.session.company}).populate('user').exec(function(err,staff){
        if(err)
            res.send(err);
        res.json(staff);   
    });
};


// Find One
exports.find_a_staff = function(req,res,next){
    Staff.findOne({_id:req.params.staffId}).exec(function(err,staff){
        if(err)
            res.send(err);
         res.json(staff);   
    });
};


// update a staff

exports.update_a_staff = function(req,res,next){
    Staff.findOneAndUpdate({_id:req.params.staffId},req.body,{new:true}).exec(function(err,staff){
        if(err)
            res.send(err);
         res.json(staff);   
    });
};

// delete a staff

exports.delete_a_staff = function(req,res,next){
    Staff.findOneAndDelete({_id:req.params.staffId},function(err,staff){
        if(err)
            res.send(err);
         res.json({message:"Staff Deleted"});   
    });
};

