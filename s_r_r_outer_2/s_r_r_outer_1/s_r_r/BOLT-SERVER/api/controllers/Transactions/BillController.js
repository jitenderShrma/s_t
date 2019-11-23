'use strict';

var mongoose = require('mongoose');
var Bills = mongoose.model('Bills');
var Transaction = mongoose.model('Transaction');



//Create a bill
exports.create_a_bill = function(req,res,next){
    var str;
    if(req.file) {
        str = req.file.path;
        str = str.replace(/\\/g,"/");
    }
    Bills.create({
        company:req.session.company,
        bill_number:req.body.bill_number,
        bill_date:req.body.bill_date,
        bill_amount:req.body.bill_amount,
        bill_upload_path:str,
        status : req.body.status,
        vendor:req.body.vendor,
        verified:{
            by:req.session.user || req.session.subuser,
            isVerified:req.body.verified
        }
    },function(err,bill){
        if(err){
            res.send(err);
        }else {
            res.json(bill)
        }
    });

};


//Update a Bill
exports.update_a_bill = function(req,res,next){
    Transaction.findOne({_id: req.body.transaction_id}).populate('bill', []).exec(function(err, data){
        console.log(req.body);
            if(err){
                res.send(err);
            } else {
                if(req.body.verified){
                    let calculated_amount = req.body.bill_amount;
                    data.bill.forEach(bil => {
                        if(bil.verified.isVerified){
                            calculated_amount += bil.bill_amount;
                        }
                    });
                    if(data.amount < calculated_amount){
                        let update = {};
                        update['verified'] = {
                            isVerified : false
                        }
                        Bills.findOneAndUpdate({_id:req.params.billId},update,{new:true}).exec(function(err, data){
                            res.json(false);
                       });
                    } else if(data.amount > calculated_amount){
                        let update = {};
                        update['verified'] = {
                            isVerified : true
                        }
                        Bills.findOneAndUpdate({_id:req.params.billId},update,{new:true}).exec(function(err, data){
                            res.json(true);
                       });
                    } else {
                        let update = {};
                        update['verified'] = {
                            isVerified : true
                        }
                        update['status'] = 'Completed';
                        Bills.findOneAndUpdate({_id:req.params.billId},update,{new:true}).exec(function(err, data){
                            res.json(true);
                       });
                    }
                } else {
                    let update = {};
                    update['verified'] = {
                            isVerified : false
                        }
                        update['status'] = 'Inompleted';
                        Bills.findOneAndUpdate({_id:req.params.billId},update,{new:true}).exec(function(err, data){
                            console.log("data", data);
                            res.json(false);
                    });
                }
            }
        });
};

//manage bill
exports.manage_transition_bill = function(req,res,next){
    Transaction.find().populate('bill', []).exec(function(err, data){
      data.forEach(trans => {
        let vendor = trans.vendor ? trans.vendor : null;
        let bill_upload_path = trans.bill_file_path ? trans.bill_file_path : "";
        const newBill = {
            bill_number: trans.bill_number,
            bill_amount: trans.amount,
            bill_upload_path,
            vendor,
            status: trans.status
        }
        Bills.create(newBill, (err, data) => {
            trans.bill = data._id;
            Transaction.create(trans, (err, data) => {
                console.log(data);
            })
        });
      });   
    });
};

//delete  bills
exports.delete_bills = function(req,res,next){
    Bills.remove().exec(function(err, data){
        if(err){
            console.log(err);
        } else {
            console.log(data);
        }
    });
};

//delete  bills from trans
exports.remove_bills_from_trans = function(req,res,next){
    console.log('jdsklajklasjdkljkljaksjk')
    Transaction.find().exec(function(err, trans){
        if(err){
            res.json(err);
        } else {
            trans.forEach(tran => {
                tran.bill = null;
                Transaction.create(tran, (err, res) => {
                    if(err){
                        console.log(err);
                    } else {
                        console.log(res);
                    }
                });
            });
        }
    });
};

//view all bills

exports.view_all_bills = function(req,res,next){
    Bills.find({company:req.session.company}).exec(function(err,bills){
        if(err){
            res.send(err);
        }else{
            res.json(bills);
        }
    });
};
