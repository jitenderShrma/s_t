'use strict';

 var mongoose = require('mongoose');
var Label = mongoose.model('Label');


// CREATE A LABEL

exports.add_a_label = function(req,res,next) {
    Label.create({
        company : req.session.company,
        label_name : req.body.label_name,
        color: req.body.color,
        context : req.body.context,
        description : req.body.description
    },function(err,label) {
        if(err)
            res.send(err)
        res.json(label)
    });
}

// GET A LABEL

exports.get_a_label = function(req,res,next) {
    Label.findOne({company:req.session.company,_id:req.params.labelId},function(err,label) {
        if(err)
            res.send(err)
        res.json(label)
    });
};

//EDIT A LABEL

exports.edit_a_label = function(req,res,next) {
    Label.findOneAndUpdate({company:req.session.company,_id:req.params.labelId},req.body,{new:true},function(err,label) {
        if(err)
            res.send(err)
        res.json(label)
    });
}

//GET All LABEL

exports.get_all_labels = function(req,res,next) {
    Label.find({company:req.session.company},function(err,labels) {
        if(err)
            res.send(err)
        res.json(labels)
    });
}


//DELETE A LABEL

exports.delete_a_label = function(req,res,next) {
    Label.findOneAndDelete({company:req.session.company,_id:req.params.labelId},function(err,label) {
        if(err)
            res.send(err)
        res.json(label)
    })
}

// FIND LABELS BY CONTEXT

exports.find_labels_by_context = function(req,res,next) {
    Label.find({company:req.session.company,context:req.params.context},function(err,labels) {
        if(err)
            res.send(err)
        res.json(labels)
    });
};