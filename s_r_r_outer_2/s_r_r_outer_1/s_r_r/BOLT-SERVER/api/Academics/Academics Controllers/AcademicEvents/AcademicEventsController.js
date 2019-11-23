'use strict';
var mongoose = require('mongoose');
var AcademicEvents = mongoose.model('AcademicEvent');


//Create a Event

exports.create_acad_event = function(req,res,next){
    AcademicEvents.create({
        company:req.session.company,
        programme:req.body.programme,
        academic_term:req.body.academic_term,
        section:req.body.section,
        students:req.body.students,
        event_name:req.body.event_name,
        event_type:req.body.event_type,
        start_date:req.body.start_date,
        end_date:req.body.end_date,
        venue:req.body.venue
    },function(err,acadEvent){
        if(err){
            res.send(err);
        }else{
            res.json(acadEvent);
        }
    });
};

//view all events

exports.view_all_events = function(req,res,next){
    AcademicEvents.find({}).exec(function(err,acadEvents){
        if(err){
            res.send(err);
        }else{
            res.json(acadEvents);
        }

    });
};


//delete an Event

exports.delete_an_event = function(req,res,next){
    AcademicEvents.deleteOne({_id:req.params.eventId}).exec(function(err,event){
        if(err){
            res.send(err);
        }else{
            res.json({message:"Event Successfully Deleted"});
        }

    });
};