'use strict';
var mongoose = require('mongoose');
var Attendance = mongoose.model('Attendance');



exports.create_a_Attendance = function(req,res,next){
    Attendance.create({
        company:req.session.company,
        user_attendance:{
            user:req.body.user,
            attendance:req.body.attendance
        },
    },function(err,attendance){
        if(err)
            res.send(err);
         res.json(attendance);   
    });
};


exports.view_all_Attendance = function(req,res,next){
    Attendance.find({company:req.session.company},function(err,permission){
        if(err)
            res.send(err);
        res.json(permission);    
    });
};