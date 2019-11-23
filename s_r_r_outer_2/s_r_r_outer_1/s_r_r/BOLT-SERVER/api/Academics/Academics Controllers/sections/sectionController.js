'use strict';

var mongoose = require('mongoose');
var Section = mongoose.model('Section');


//Create a Section
exports.create_a_section = function(req,res,next){
    Section.create({
        section_name:req.body.section_name,
        max_strength:req.body.max_strength,
        academic_term:req.body.academic_term,
        programme:req.body.programme,
    },function(err,section){
        if(err){
            res.send(err);
        }else{
            res.json(section);
        }
    });
};

//view a Section
exports.view_all_section = function(req,res,next){
    var filter = [];
    if(req.params.filter == "programme"){
        Section.find({programme:req.params.filterId}).exec(function(err,sections){
            if(err){
                res.send(err);
            }else{
                res.json(sections);
            }
        });
    }else if(req.params.filter == "academic"){
        Section.find({academic_term:req.params.filterId}).exec(function(err,sections){
            if(err){
                res.send(err);
            }else{
                res.json(sections);
            }
        });
    }
  
};


// update 
