'use strict';

var mongoose = require('mongoose');
var Specialisation = mongoose.model('Specialisation');

//create a specialisation

exports.create_a_specialisation = function(req,res,next){
    Specialisation.create({
        company:req.session.company,
        specialisation_name:req.body.specialisation_name,
        subject:req.body.specialisation
    },function(err,specialisation){
        if(err){
            res.send(err);
        }else{
            res.json(specialisation);
        }

    });
};

//view a specialisation

exports.view_all_specialisations = function(req,res,next){
    Specialisation.find({company:req.session.company}).exec(function(err,specialisations){
        if(err){
            res.send(err);
        }else{
            res.json(specialisations);
        }
    });

};