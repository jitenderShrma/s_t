'use strict';

var mongoose = require('mongoose');
var AcademicTerm = mongoose.model('AcademicTerm');

//create an Academic Term
exports.create_an_academic_term = function(req,res,next){
    console.log(req.body);
    AcademicTerm.create({
        company:req.session.company,
        academic_term_name:req.body.academic_term_name,
        months:req.body.months,
        programme:req.body.programme,
        subjects:req.body.subjects,
        start_month: req.body.start_month,
        additional_subjects_group: req.body.additional_subjects_group,


    },function(err,term){
        if(err){
            res.send(err);
        }else{
            res.json(term);
        }
    });
};

//view all academic terms
exports.view_all_academic_terms = function(req,res,next){
    AcademicTerm.find({programme:req.params.progId}).exec(function(err,terms){
        if(err){
            res.send(err);
        }else{
            res.json(terms);
        }
    });
};

//delete an Academic term
exports.delete_academic_terms = function(req,res,next){
    if(req.params.deleteOption == "one"){
        AcademicTerm.findOneAndDelete({_id:req.params.filterId}).exec(function(err,term){
            if(err){
                res.send(err);
            }else{
                res.json({message:"Academic term deleted"});
            }
        });
    }else if(req.params.deleteOption == "all"){
        AcademicTerm.deleteMany({programme:req.params.filterId}).exec(function(err,term){
            if(err){
                res.send(err);
            }else{
                res.json({message:"All Academic terms deleted"});
            }
        });
    }else{
        res.send({message:"Bad option for deletion"});
    }
    
};

//Update an Academic Term
exports.update_a_term = function(req,res,next){
    AcademicTerm.findOneAndUpdate({_id:req.params.termId},req.body,{new:true}).exec(function(err,term){
        if(err){
            res.send(err);
        }else{
            res.json(term);
        }
    });
};

// view One Academic Term
exports.view_one_term = function(req,res,next){
    AcademicTerm.findOne({_id:req.params.termId}).exec(function(err,term){
        if(err){
            res.send(err);
        }else{
            res.json(term);
        }
    });
};
