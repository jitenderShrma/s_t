'use strict';
var mongoose = require('mongoose');
var Payments = mongoose.model('Payments');

// Create a Payment Order

exports.create_a_payment_order = function(req,res,next){
    Payments.create({
        company:req.session.company,
        transaction_id:req.body.transaction_id,
        payment_method:req.body.payment_method,
        other_payment:req.body.other_payment,
        payment_date:req.body.payment_date,
        payment_ref_number:req.body.payment_ref_number,
        notes:req.body.notes
    },
    function(err,payment){
        if(err){
            res.send(err);
        }else{
            res.json(payment);
        }
    });
};

exports.get_all_payment_orders = function(req,res,next){
    Payments.find({company:req.session.company}).exec(function(err,payments){
        if(err)
            res.send(err);
        res.json(payments);    
    });
};

exports.view_a_payment = function(req,res,next){
    Payments.findOne({company:req.session.company,_id:req.params.paymentId}).exec(function(err,payments){
        if(err)
            res.send(err);
        res.json(payments);    
    });
};
