'use strict';


var mongoose = require('mongoose');
var Attribute = mongoose.model('add_Attribute');


//ADD  AN ATTRIBUTE
exports.add_an_attribute = function(req,res,next){
    Attribute.create({
        super_user:req.session.user,
        field_name:req.body.field_name,
        description:req.body.description,
        field_type:req.body.field_type,
        context:req.body.context,
    },function(err,attribute){
        if(err)
            res.send(err);
        res.json(attribute);    
    });
};


//VIEW ALL ATTRIBUTES
exports.view_all_attributes = function(req,res,next){
    Attribute.find({super_user:req.session.user},function(err,attribute){
        if(err)
            res.send(err);
        res.json(attribute);    
    });
};

// GET AN ATTRIBUTE

exports.get_an_attribute = function(req,res,next){
    Attribute.findOne({_id:req.params.attribId,context:req.params.context},function(err,attribute){
        if(err)
            res.send(err);
        res.json(attribute);    
    });
};

//DELETE AN ATTRIBUTE

exports.delete_an_attribute = function(req,res,next){
    Attribute.findOneAndDelete({_id:req.params.attribId,context:req.params.context},function(err,attribute){
        if(err)
            res.send(err);
        res.json({message:"Attribute Deleted"});    
    });
};

//UPDATE AN ATTRIBUTE

exports.update_an_attribute = function(req,res,next){
    Attribute.findOneAndUpdate({_id:req.params.attribId,context:req.params.context},req.body,{new: true, runValidators:true},function(err,attribute){
        if(err)
            res.send(err);
        res.json(attribute);
    });
};

