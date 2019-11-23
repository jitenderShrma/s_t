'use strict';
var mongoose = require('mongoose');
var PurchaseOrder = mongoose.model('PurchaseOrder');


// CREATE A PO

exports.create_a_po = function(req,res,next){
    PurchaseOrder.create({
        company:req.session.company,
        purchase_id : req.body.purchase_id,
        amount:req.body.amount,
        po_file:req.files
    },function(err,purchaseorder){
        if(err)
            res.send(err);
         res.json(purchaseorder);   
    });
};

// GET ALL PO

exports.get_all_pos = function(req,res,next) {
    PurchaseOrder.find({company:req.session.company},function(err,purchaseorder) {
        if(err)
            res.send(err)
        res.json(purchaseorder)
    });
};

// GET A PO

exports.view_a_po = function(req,res,next){
    PurchaseOrder.findOne({company:req.session.company,purchase_id:req.params.poId},function(err,purchaseorder){
        if(err)
            res.send(err);
        res.json(purchaseorder);    
    });
};

// EDIT A PO

exports.edit_a_po = function(req,res,next) {
    PurchaseOrder.findOneAndUpdate({company:req.session.company,purchase_id:req.params.poId},req.body,{new:true},function(err,purchaseorder) {
        if(err)
            res.send(err)
        res.json(purchaseorder);
    });
};

// DELETE A PO

exports.delete_a_po = function(req,res,next) {
    PurchaseOrder.findOneAndDelete({company:req.session.company,purchase_id:req.params.poId},function(err,purchaseorder) {
        if(err)
            res.send(err)
        res.json(purchaseorder);
    });
};