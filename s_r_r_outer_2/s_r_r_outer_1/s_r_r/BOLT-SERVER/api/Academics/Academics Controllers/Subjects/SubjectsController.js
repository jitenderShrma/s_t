'use strict';

var mongoose = require('mongoose');
var Subject = mongoose.model('Subject');

//create a subject
exports.create_a_subject = function(req,res,next){
    var left,right,tree_id;
    Subject.findOne({_id:req.body.parent_subject}).exec(function(err,parent_subject){
        if(err){
            res.send(err);
        }else if(parent_subject){
            left = parent_subject.rgt;
            right = parent_subject.rgt + 1;
            tree_id = parent_subject.subject_tree_id;
            Subject.updateMany({subject_tree_id:parent_subject.subject_tree_id,lft:{$gt:parent_subject.rgt}},{$inc:{lft:2}}).exec(function(err,querylft){
                Subject.updateMany({subject_tree_id:parent_subject.subject_tree_id,rgt:{$gte:parent_subject.rgt}},{$inc:{rgt:2}}).exec(function(err,queryrgt){
                    Subject.create({
                        company:req.session.company,
                        subject_name:req.body.subject_name,
                        subject_code:req.body.subject_code,
                        speciality:req.body.speciality,
                        subject_credits:req.body.subject_credits,
                        max_marks:req.body.max_marks,
                        parent_subject:req.body.parent_subject,
                        lft:left,
                        rgt:right,
                        subject_tree_id:tree_id
                    },function(err,subject){
                        if(err){
                            res.send(err);
                        }else{
                            res.json(subject);
                        }
                    });
                });
            });
        }else{
            Subject.create({
                company:req.session.company,
                subject_name:req.body.subject_name,
                subject_code:req.body.subject_code,
                speciality:req.body.speciality,
                subject_credits:req.body.subject_credits,
                max_marks:req.body.max_marks,
                subject_tree_id:req.body.subject_code
            },function(err,subject){
                if(err){
                    res.send(err);
                    console.log(err);
                }else{
                    res.json(subject);
                }
            });
        }
    });

};


//VIEW ALL
exports.view_all_subjects = function(req,res,next){
    Subject.find({company:req.session.company}).exec(function(err,subjects){
        if(err){
            res.send(err);
        }else{
            res.json(subjects);
        }

    });
};

//UPDATE SUBJECTS
exports.update_a_subject = function(req,res,next){
    Subject.findOne({_id:req.params.subId}).exec(function(err,subject){
        if(req.body.parent_subject == null && subject.lft == 0){
            Subject.findOneAndUpdate({company:req.session.company,_id:req.params.subId},req.body,{new:true}).exec(function(err,updatedsub){
                res.json({message:"subject updated"});
            });
        }else if(req.body.parent_subject == null && subject.lft != 0){
            var width = (subject.rgt-subject.lft)+1;
            var bound = subject.rgt;
            var sub_tree_id = req.body.subject_code || subject.subject_code;

            Subject.updateMany({subject_tree_id:subject.subject_tree_id,lft:{$gt:bound}},{$inc:{lft:-width}}).exec(function(err,querylft) {
                Subject.updateMany({subject_tree_id:subject.subject_tree_id,rgt:{$gt:bound}},{$inc:{rgt:-width}}).exec(function(err,queryrgt) {
                    Subject.updateMany({subject_tree_id:subject.subject_tree_id,lft:{$gte:subject.lft},rgt:{$lte:subject.rgt}},{$inc:{lft:-subject.lft,rgt:-subject.lft},subject_tree_id:sub_tree_id}).exec(function(err,updatedsub){
                        Subject.findOneAndUpdate({company:req.session.company,_id:req.params.subId},{parent_subject:null,subject_name:req.body.subject_name,subject_code:sub_tree_id},{new:true}).exec(function(err,updated){
                            res.json({message:"subject got independent"});
                                console.log("subject got independent");  
                        });
                    });
                });
            });
        }else if(req.body.parent_subject == subject.parent_subject){
            Subject.findOneAndUpdate({company:req.session.company,_id:req.params.subId},req.body,{new:true}).exec(function(err,updatedsub){
                res.json({message:"subject updated"});
            });
        }else if(req.body.parent_subject != subject.parent_subject){
            var width = (subject.rgt-subject.lft)+1;
            var bound = subject.rgt;
            Subject.updateMany({subject_tree_id:subject.subject_tree_id,lft:{$gt:bound}},{$inc:{lft:-width}}).exec(function(err,querylft) {
                Subject.updateMany({subject_tree_id:subject.subject_tree_id,rgt:{$gt:bound}},{$inc:{rgt:-width}}).exec(function(err,queryrgt) {
                    Subject.findOne({_id:req.body.parent_subject}).exec(function(err,parent){
                        var left = parent.rgt;
                        var right = parent.rgt+1;
                        var tree_id = parent.subject_tree_id;
                        Subject.updateMany({subject_tree_id:parent.subject_tree_id,lft:{$gt:parent.rgt}},{$inc:{lft:width}}).exec(function(err,left_update){
                            Subject.updateMany({subject_tree_id:parent.subject_tree_id,rgt:{$gte:parent.rgt}},{$inc:{rgt:width}}).exec(function(err,right_update){
                                Subject.updateMany({subject_tree_id:subject.subject_tree_id,lft:{$gte:subject.lft},rgt:{$lte:subject.rgt}},{$inc:{lft:parent.rgt-subject.lft,rgt:parent.rgt-subject.lft},subject_tree_id:tree_id}).exec(function(err,finalupdate){
                                    if(err)
                                        console.log(err);  
                                    Subject.findOneAndUpdate({company:req.session.company,_id:req.params.subId},{parent_subject:req.body.parent_subject,subject_name:req.body.subject_name},{new:true}).exec(function(err,updatedfinal){
                                        console.log("updated");
                                        res.json({message:"subject updated"});
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }
    });
};


// Remove a Subject

exports.remove_a_subject = function(req,res,next){
    Subject.findOne({company : req.session.company,_id:req.params.subId}).exec(function(err,subject){
        var width = (subject.rgt-subject.lft)+1;
        var bound = subject.rgt;
        Subject.deleteMany({subject_tree_id:subject.subject_tree_id,lft:{$gte:subject.lft},rgt:{$lte:subject.rgt}}).exec(function(err,deleteElem) {
            Subject.updateMany({subject_tree_id:subject.subject_tree_id,lft:{$gt:bound}},{$inc:{lft:-width}}).exec(function(err,querylft) {
                Subject.updateMany({subject_tree_id:subject.subject_tree_id,rgt:{$gt:bound}},{$inc:{rgt:-width}}).exec(function(err,queryrgt) {
                    res.json({deleted:deleteElem,lftupdate:queryrgt,rgtupdate:querylft});
                });
            });
        });
    });
};


