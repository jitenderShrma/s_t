'use strict';
var mongoose = require('mongoose');
var RFQ = mongoose.model('RFQ');


// CREATE A RFQ

exports.create_a_rfq = function(req,res,next){
    RFQ.create({
        company:req.session.company,
        title : req.body.title,
        exp_date : req.body.exp_date,
        description: req.body.description,
        quotes : req.body.quotes
    },function(err,rfq){
        if(err)
            res.send(err);
         res.json(rfq);   
    });
};

// GET ALL RFQ

exports.get_all_rfqs = function(req,res,next) {
    RFQ.find({company:req.session.company},function(err,rfqs) {
        if(err)
            res.send(err)
        res.json(rfqs)
    });
};

// GET A RFQ

exports.view_a_rfq= function(req,res,next){
    RFQ.findOne({company:req.session.company,_id:req.params.rfqId},function(err,rfq){
        if(err)
            res.send(err);
        res.json(rfq);    
    });
};

// EDIT A RFQ

exports.edit_a_rfq = function(req,res,next) {
    RFQ.findOneAndUpdate({company:req.session.company,_id:req.params.rfqId},req.body,{new:true},function(err,rfq) {
        if(err)
            res.send(err)
        res.json(rfq);
    });
};

// DELETE A RFQ

exports.delete_a_rfq = function(req,res,next) {
    RFQ.findOneAndDelete({company:req.session.company,_id:req.params.rfqId},function(err,rfq) {
        if(err)
            res.send(err)
        res.json(rfq);
    });
};


// PUSH A QUOTE

exports.push_a_quote = function(req,res,next) {
    RFQ.findOneAndUpdate({company:req.session.company,_id:req.params.rfqId},{$push:{quotes:req.body.quotes}},{new:true},function(err,rfq) {
        if(err)
            res.send(err)
        res.json(rfq)
    });
};


// POP A QUOTE 
exports.pop_a_quote = function(req,res,next) {
    RFQ.findOneAndUpdate({company:req.session.company,_id:req.params.rfqId},{$pull:{quotes:req.body.quotes}},{new:true},function(err,rfq) {
        if(err)
            res.send(err)
        res.json(rfq)
    });
};