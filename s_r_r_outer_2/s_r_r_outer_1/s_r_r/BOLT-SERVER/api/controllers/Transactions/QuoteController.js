'use strict';
var mongoose = require('mongoose');
var Quote = mongoose.model('Quote');


// CREATE A QUOTE

exports.create_a_quote = function(req,res,next){
    if(req.file!=null) {
        Quote.create({
            company:req.session.company,
            vendor : req.body.vendor,
            title: req.body.title,
            description: req.body.description,
            file : req.file.path,
            price :req.body.price,
            isPurchased : req.body.isPurchased,
            purchase_order : req.body.purchase_order
        },function(err,quote){
            if(err)
                res.send(err);
             res.json(quote);   
        });
    }
    else {
        Quote.create({
            company:req.session.company,
            vendor : req.body.vendor,
            title: req.body.title,
            description: req.body.description,
            price :req.body.price,
            isPurchased : req.body.isPurchased,
            purchase_order : req.body.purchase_order
        },function(err,quote){
            if(err)
                res.send(err);
             res.json(quote);   
        });
    }
};

// GET ALL QUOTE

exports.get_all_quotes = function(req,res,next) {
    Quote.find({company:req.session.company},function(err,quotes) {
        if(err)
            res.send(err)
        res.json(quotes)
    });
};

// GET A QUOTE

exports.view_a_quote = function(req,res,next){
    Quote.findOne({company:req.session.company,_id:req.params.quoteId},function(err,quote){
        if(err)
            res.send(err);
        res.json(quote);    
    });
};

// EDIT A QUOTE

exports.edit_a_quote = function(req,res,next) {
    Quote.findOneAndUpdate({company:req.session.company,_id:req.params.quoteId},{company:req.session.company, vendor : req.body.vendor, title: req.body.title, description: req.body.description, file : req.file.path, price :req.body.price, isPurchased : req.body.isPurchased, purchase_order : req.body.purchase_order},{new:true},function(err,quote) {if(err)
            res.send(err)
        res.json(quote);
    });
};

// DELETE A QUOTE

exports.delete_a_quote = function(req,res,next) {
    Quote.findOneAndDelete({company:req.session.company,_id:req.params.quoteId},function(err,Quote) {
        if(err)
            res.send(err)
        res.json(Quote);
    });
};