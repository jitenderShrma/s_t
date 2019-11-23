'use strict';

var mongoose = require('mongoose');
var Programme = mongoose.model('Programme');

//Create a Programme
exports.create_a_Programme = function(req,res,next){
    Programme.create({
        company:req.session.company,
        programme_name:req.body.programme_name,
        programme_department:req.body.programme_department,
        programme_duration:req.body.programme_duration,
        programme_credits:req.body.programme_credits,
        vaild_from:req.body.vaild_from,
        valid_to:req.body.valid_to
    },function(err,prog){
        if(err){
            console.log(err);
            res.send(err);
        }else{
            res.json(prog);
        }
    });
};

//View all Programmes
exports.view_all_programme = function(req,res,next){
    Programme.find({}).exec(function(err,programmes){
        if(err){
            res.send(err);
        }else{
            res.json(programmes);
        }
    });
};

//View One Programme
exports.view_one_programme = function(req,res,next){
    Programme.findOne({_id:req.params.progId}).exec(function(err,programme){
        if(err){
            res.send(err);
        }else{
            res.json(programme);
        }
    });
};


//Delete A Programme

exports.delete_a_programme = function(req,res,next){
    Programme.findOneAndDelete({_id:req.params.progId}).exec(function(err,programme){
        if(err){
            res.send(err);
        }else{
            res.json({message:"Programme Deleted"});
        }

    });
};


//Update a Programme

exports.update_a_programme = function(req,res,next){
    Programme.findOneAndUpdate({_id:req.params.progId},req.body,{new:true}).exec(function(err,programme){
        if(err){
            res.send(err);
        }else{
            res.json({message:"Programme updated"});
        }

    });
};