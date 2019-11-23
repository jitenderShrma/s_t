'use strict';


var mongoose = require('mongoose');
var Vendor = mongoose.model('Vendor');

// CREATE A VENDOR

exports.create_a_vendor = function(req,res,next) {
	var pan,gst;
	if(req.files!=null && req.files['pan_copy'] !=null && req.files['gst_certi'] !=null) {
		pan = req.files['pan_copy'][0].path
		gst = req.files['gst_certi'][0].path
	}
	Vendor.create({
	    company : req.session.company,
	    name : req.body.name,
	    pan : req.body.pan,
	    vendor_company : req.body.vendor_company,
	    address:{
	    	compAdd :req.body.compAdd, 
	    	email:req.body.email,
	    	country:req.body.country,
	    	phone:req.body.phone,
	    	state:req.body.state,
	    	zip:req.body.zip,
	    },
	    gst : req.body.gst,
	    payment :{
	    	acc_name : req.body.acc_name,
	    	bank_name : req.body.bank_name,
	    	acc_no : req.body.acc_no,
	    	ifsc : req.body.ifsc
	    },
	    turnover : req.body.turnover,
	    kcp : {
	    	kcp_name : req.body.kcp_name,
	    	kcp_phone : req.body.kcp_phone
	    },
	    pan_copy : pan,
	    gst_certi : gst
	},function(err,vendor) {
		if(err)
			res.send(err)
		res.json(vendor)
	});
}

//DELETE A VENDOR

exports.delete_a_vendor = function(req,res,next) {
	Vendor.findOneAndDelete({company:req.session.company,_id:req.params.vendorId},function(err, vendor) {
		if(err)
			res.send(err)
		res.json(vendor)
	});
}

// UPDATE A VENDOR

exports.edit_a_vendor = function(req,res,next) {
	Vendor.findOneAndUpdate({company:req.session.company,_id:req.params.vendorId},req.body,{new:true},function(err,vendor) {
		if(err)
			res.send(err)
		res.json(vendor)
	});
}

//GET A VENDOR

exports.get_a_vendor = function(req,res,next) {
	Vendor.findOne({company:req.session.company,_id:req.params.vendorId},function(err,vendor) {
		if(err)
			res.send(err)
		res.json(vendor)
	});
}


//GET ALL VENDORS

exports.get_all_vendors = function(req,res,next) {
	Vendor.find({company:req.session.company},function(err,vendors) {
		if(err)
			res.send(err)
		res.json(vendors)
	});
}


