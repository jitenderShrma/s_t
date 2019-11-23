'use strict';

var mongoose = require('mongoose');
var TimeTable = mongoose.model('TimeTablePlanner');

//create a timeTablePlanner
exports.create_a_time_table_planner = function(req,res,next){
    const newTimeTablePlanner = {
        academic_term: req.body.academic_term,
        programme: req.body.programme,
        section: req.body.section,
        subjects: req.body.subjects
    };
    TimeTable.create(newTimeTablePlanner, function(err, data){
        if(err){
            res.send(err);
        } else {
            res.json(data);
        }
      });
};


//VIEW ALL
exports.view_all_subjects = function(req,res,next){
    Subject.find().exec(function(err,subjects){
        if(err){
            res.send(err);
        }else{
            res.json(subjects);
        }

    });
};

// // Remove a Subject
exports.remove_a_ttplan = function(req,res,next){
    TimeTable.findOneAndDelete({_id: req.params.document_id}, function(err,data){
        if(err){
            res.status(404).json(err);
        } else {
            res.status(200).json(data);
        }
    });
};


//UPDATE BY ID
exports.update_a_ttplan = function(req,res,next){
     const newTimeTablePlanner = {
        _id: req.params.document_id,
        academic_term: req.body.academic_term,
        programme: req.body.programme,
        section: req.body.section,
        subjects: req.body.subjects
    };
    TimeTable.findOneAndUpdate({_id: req.params.document_id}, newTimeTablePlanner, {new:true}).exec(function(err,data){
        if(err){
            res.send(err);
        }else{
            res.json(data);
        }
        console.log(err, data);

    });
};

// find a ttplan by id
exports.find_a_ttplan_by_id = function(req,res,next){
    TimeTable.findOne({_id: req.params.document_id}, function(err,data){
        if(err){
            res.status(404).json(err);
        } else {
            res.status(200).json(data);
        }
    });
};

// find all ttplan 
exports.find_all_ttplan = function(req,res,next){
    TimeTable.find({},function(err,data){
        if(err){
            res.status(404).json(err);
        } else {
            res.status(200).json(data);
        }
    });
};

