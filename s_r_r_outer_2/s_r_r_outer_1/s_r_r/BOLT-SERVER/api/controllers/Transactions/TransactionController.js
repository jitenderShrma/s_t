'use strict';
var mongoose = require('mongoose');
var Transaction = mongoose.model('Transaction');
var Approvals = mongoose.model('Approvals');
var Payments = mongoose.model('Payments');


// CREATE A transaction

exports.create_a_transaction = function(req,res,next){
    var str = undefined
    Approvals.findOne({ref_id:req.body.approvalCode}).exec(function(err,approval){
        if(req.file) {
            str = req.file.path;
            str = str.replace(/\\/g,"/");
        }
        if(approval){
            if(approval.status == "APPROVED" && approval.approval_amount_left[req.body.month] >= req.body.amount){
                Transaction.create({
                    company:req.session.company,
                    transaction_type : req.body.transaction_type,
                    user: req.session.subuser,
                    category : req.body.category,
                    department : req.body.department,
                    po_required: req.body.po_required,
                    po_raised : req.body.po_raised,
                    head:req.body.head,
                    month:req.body.month,
                    amount : req.body.amount,
                    vendor : req.body.vendor,
                    cash : req.body.cash,
                    quotes : req.body.quotes,
                    status : req.body.status,
                    bill_number : req.body.bill_number,
                    bill_file_path : str,
                    isApproved : req.body.isApproved,
                    approvalCode : req.body.approvalCode
                },function(err,transaction){
                    if(err){
                        res.send(err);
                    }else{
                        if(transaction){
                        var str = transaction.approvalCode;
                        var trans_id = transaction.trans_id.toString();
                        var pad = "00";
                        var trans_id_ans = pad.substring(0,pad.length - trans_id.length)+trans_id;
                        var transaction_id = str + '-' + trans_id_ans;
                        console.log(transaction_id);
                        Transaction.findOneAndUpdate({_id:transaction._id},{transaction_id:transaction_id},{new:true}).exec(function(err,final_transaction){
                            if(err){
                                console.log(err);
                            }else{
                            approval.approval_amount_left[req.body.month] = approval.approval_amount_left[req.body.month] - req.body.amount;
                            if(approval.approval_amount_left[req.body.month] == 0){
                                Approvals.findOneAndUpdate({ref_id:req.body.approvalCode},{status:"COMPLETED",$set:{approval_amount_left:approval.approval_amount_left}}).exec(function(err,app){
                                    if(err){
                                        res.send(err);
                                    }else{
                                        res.json(final_transaction);
                                    }
                                });
                            }else{
                                Approvals.findOneAndUpdate({ref_id:req.body.approvalCode},{$set:{approval_amount_left:approval.approval_amount_left}}).exec(function(err,app){
                                    if(err){
                                        res.send(err);
                                    }else{
                                        res.json(final_transaction);
                                    }
                                });
                            }

                            }
                        });     
                      }
                    }
                });
            }else{
                res.send({message:"Approval Not Approved yet or Amount already used"});            
            }

        }else{
            res.send({message:"Wrong Approval code"});
        }
    });
};


//GET Transactions with payments
exports.get_all_transactions_with_payments = function(req,res,next){
    var result = [];
    Transaction.find({company:req.session.company,vendor:req.params.vendorId}).populate({path:'department vendor head user bill',populate:{path:'vendor verified.by'}}).exec(function(err,transactions){
        if(err){
            res.send(err);
        }else{
            function AsyncLoop(i,cb){
                if(i<transactions.length){
                    Payments.find({transaction_id:transactions[i]._id}).exec(function(err,payments){
                        if(err){
                            console.log(err);
                            AsyncLoop(i+1,cb);
                        }else{
                            result[i] = {
                                transaction:transactions[i],
                                payments:payments
                            }
                            AsyncLoop(i+1,cb);
                        }
                    });
                }else{
                    cb();
                }
            }AsyncLoop(0,function(){
                res.json(result);
            });
        }
    });
};

// ********************************************************

// GET ALL TRANSACTION
exports.get_all_transactions_page  = function(req,res,next) {
    if(req.session.user){
        Transaction.paginate({company:req.session.company},{sort:{createdAt:"-1"},populate:'department vendor head user bill',page:req.params.pageNo,limit:50}).then(function(transactions) {
            res.json(transactions);
        });
    }else if(req.session.subuser){
        if(res.locals.add_read_all_permission == false){
            Transaction.paginate({company:req.session.company,user:req.session.subuser},{sort:{createdAt:"-1"},populate:'department vendor head user bill',page:req.params.pageNo,limit:50}).then(function(transactions) {
                res.json(transactions);
            });
        }else{
            Transaction.paginate({company:req.session.company},{sort:{createdAt:"-1"},populate:'department vendor head user bill',page:req.params.pageNo,limit:50}).then(function(transactions) {
                res.json(transactions);
            });
        }
    }
}

exports.get_all_transactions = function(req,res,next) {
    if(req.session.user){
        Transaction.find({company:req.session.company}).populate({path:'department vendor head user bill',populate:{path:'vendor verified.by'}}).exec(function(err,transactions) {
            if(err)
                res.send(err)
            res.json(transactions);
        });
    }else if(req.session.subuser){
        if(res.locals.add_read_all_permission == false){
            Transaction.find({company:req.session.company,user:req.session.subuser}).populate({path:'department vendor head user bill',populate:{path:'vendor verified.by'}}).exec(function(err,transactions) {
                if(err)
                    res.send(err)
                res.json(transactions);
            });
        }else{
            Transaction.find({company:req.session.company}).populate({path:'department vendor head user bill',populate:{path:'vendor verified.by'}}).exec(function(err,transactions) {
                if(err)
                    res.send(err)
                res.json(transactions);
            });
        }
    }
    
};

// GET A TRANSACTION

exports.view_a_transaction= function(req,res,next){
    Transaction.findOne({company:req.session.company,_id:req.params.transactionId},function(err,transaction){
        if(err)
            res.send(err);
        res.json(transaction);    
    });
};


//CANCEL A TRANSACTION
exports.cancel_a_transaction = function(req,res,next){
    Transaction.findOne({_id:req.params.transactionId}).exec(function(err,transaction){
        if(err){
            console.log(err);
        }else if(transaction){
            if(transaction.status != "PAID"){
                Approvals.findOne({ref_id:transaction.approvalCode}).exec(function(err,approval){
                    if(err){
                        console.log(err);
                    }else{
                        approval.approval_amount_left[transaction.month] = approval.approval_amount_left[transaction.month] + parseInt(transaction.amount);
                        Approvals.findOneAndUpdate({_id:approval._id},{$set:{approval_amount_left:approval.approval_amount_left}},{new:true}).exec(function(err,updated){
                            Transaction.findOneAndUpdate({_id:transaction._id},{status:"CANCELLED"},{new:true}).exec(function(err,transaction){
                                if(err){
                                    console.log(err);
                                }else if(transaction){
                                    res.json(transaction);
                                }
                            });
                        });
                    }
                });
            }
        }
    });
};
    

// EDIT A TRANSACTION

exports.edit_a_transaction = function(req,res,next) {
    var str = undefined
    var updatevalues = {}
    if(req.file) {
        str = req.file.path;
        str = str.replace(/\\/g,"/");
        updatevalues['bill_file_path'] = str;
    }
    if(req.body.po_raised) {
        updatevalues['po_raised'] = req.body.po_raised
    }
    if(req.body.status) {
        updatevalues['status'] = req.body.status
    }
    if(req.body.bill) {
        updatevalues['$push'] = {bill:req.body.bill}
    }
    Transaction.findOneAndUpdate({company:req.session.company,_id:req.params.transactionId},updatevalues,{new:true},function(err,transaction) {
        if(err)
            res.send(err)
        res.json(transaction);
    });
};

// DELETE A TRANSACTION

exports.delete_a_transaction = function(req,res,next) {
    Transaction.findOneAndDelete({company:req.session.company,_id:req.params.transactionId},function(err,transaction) {
        if(err)
            res.send(err)
        res.json(transaction);
    });
};


// PUSH A QUOTE

exports.push_a_quote = function(req,res,next) {
    Transaction.findOneAndUpdate({company:req.session.company,_id:req.params.transactionId},{$push:{quotes:req.body.quotes}},{new:true},function(err,transaction) {
        if(err)
            res.send(err)
        res.json(transaction);
    });
};


// POP A QUOTE 
exports.pop_a_quote = function(req,res,next) {
    Transaction.findOneAndUpdate({company:req.session.company,_id:req.params.transactionId},{$pull:{quotes:req.body.quotes}},{new:true},function(err,transaction) {
        if(err)
            res.send(err)
        res.json(transaction);
    });
};


// view all transactions against an approval

exports.view_all_transaction_for_an_approval = function(req,res,next){
    Transaction.find({approvalCode:req.params.uniqueId}).populate('user head department bill').populate('vendor').exec(function(err,transactions){
        if(err)
            res.send(err)
        res.json(transactions);    
    });
};

//Check for transactions for vendorId

exports.check_vendor_transaction = function(req,res,next) {
    Transaction.countDocuments({company:req.session.company,vendor:req.params.vendorId}).exec(function(err,count) {
        if(err)
            res.send(err);
        else
            res.json(count);
    });
};
//Transactions for vendorId

exports.vendor_transactions = function(req,res,next) {
    Transaction.find({company:req.session.company,vendor:req.params.vendorId}).exec(function(err,transactions) {
        if(err)
            res.send(err);
        else
            res.json(transactions);
    });
};

exports.filter_transactions_user = function(req,res,next) {
    var regexp = new RegExp("")
    if(req.session.user){
        var query = {company:req.session.company}
        if( req.body.field !== "" ) {
            if(req.body.field == "user.user_name") {
                regexp = new RegExp(req.body.value)
                console.log(regexp)
            }
            else{
                query[req.body.field] = req.body.value;
            }
        }
        Transaction.find(query).populate({path:'department vendor head user bill',populate:{path:'vendor verified.by'},match: { user_name: {$regex: regexp}}}).exec(function(err,transactions) {
            if(err)
                res.send(err)
            else {
                
                        transactions = transactions.filter(function (trans) {
                            return trans.user != null
                        })
                    
                res.json(transactions)
            }
        });
    }else if(req.session.subuser){
        if(res.locals.add_read_all_permission == false){
            var query = {company:req.session.company,user:req.session.subuser}
            if( req.body.field !== "" ) {
                if(req.body.field == "user.user_name") {
                regexp = new RegExp(req.body.value)
                console.log(regexp)
            }
            else{
                query[req.body.field] = req.body.value;
            }
            }
            Transaction.find(query).populate({path:'department vendor head user bill',populate:{path:'vendor verified.by'},match: { user_name: {$regex: regexp}}}).exec(function(err,transactions) {
                if(err)
                    res.send(err)
                else {
                    
                        transactions = transactions.filter(function (trans) {
                            return trans.user != null
                        })
                    
                res.json(transactions)
            }
            });
        }else{
            var query = {company:req.session.company}
            if( req.body.field !== "" ) {
                if(req.body.field == "user.user_name") {
                regexp = new RegExp(req.body.value)
                console.log(regexp)
            }
            else{
                query[req.body.field] = req.body.value;
            }
            }
            Transaction.find(query).populate({path:'department vendor head user bill',populate:{path:'vendor verified.by'},match: { user_name: {$regex: regexp,$options:'i'}}}).exec(function(err,transactions) {
                if(err)
                    res.send(err)
                else {
                
                        transactions = transactions.filter(function (trans) {
                            return trans.user != null
                        })
                res.json(transactions)
            }
            });
        }
    }
};

exports.filter_transactions = function(req,res,next) {
    if(req.session.user){
        var query = {company:req.session.company}
        if( req.body.field !== "" ) {
                if( req.body.field == "createdAt" ) {
                    query[`$and`] = [{createdAt:{$gte:req.body.value.startDate}},{createdAt:{$lte:req.body.value.endDate}}];
                }
                else{
                    query[req.body.field] = req.body.value;
                }
        }
        Transaction.find(query).populate({path:'department vendor head user bill',populate:{path:'vendor verified.by'}}).exec(function(err,transactions) {
            if(err)
                res.send(err)
            else {
                res.json(transactions)
            }
        });
    }else if(req.session.subuser){
        if(res.locals.add_read_all_permission == false){
            var query = {company:req.session.company,user:req.session.subuser}
            if( req.body.field !== "" ) {
                if( req.body.field == "createdAt" ) {
                    query[`$and`] = [{createdAt:{$gte:req.body.value.startDate}},{createdAt:{$lte:req.body.value.endDate}}];
                }
                else{
                    query[req.body.field] = req.body.value;
                }
            }
            Transaction.find(query).populate({path:'department vendor head user bill',populate:{path:'vendor verified.by'}}).exec(function(err,transactions) {
                if(err)
                    res.send(err)
                else {
                res.json(transactions)
            }
            });
        }else{
            var query = {company:req.session.company}
            if( req.body.field !== "" ) {
                if( req.body.field == "createdAt" ) {
                    query[`$and`] = [{createdAt:{$gte:req.body.value.startDate}},{createdAt:{$lte:req.body.value.endDate}}];
                }
                else{
                    query[req.body.field] = req.body.value;
                }
            }
            Transaction.find(query).populate({path:'department vendor head user bill',populate:{path:'vendor verified.by'}}).exec(function(err,transactions) {
                if(err)
                    res.send(err)
                else {
                res.json(transactions)
            }
            });
        }
    }
};


// GET superuser transactions 

exports.filter_superuser_transactions = function(req,res,next) {
    if(req.session.user){
        Transaction.find({company:req.session.company}).populate({path:'department vendor head user bill',populate:{path:'vendor verified.by'}}).exec(function(err,transactions) {
            if(err)
                res.send(err)
            else{
                transactions = transactions.filter(function(trans) {
                    return trans.user == null
                })
                res.json(transactions);
            }
        });
    }else if(req.session.subuser){
        if(res.locals.add_read_all_permission == false){
            Transaction.find({company:req.session.company,user:req.session.subuser}).populate({path:'department vendor head user bill',populate:{path:'vendor verified.by'}}).exec(function(err,transactions) {
                if(err)
                    res.send(err)
                else{
                    transactions = transactions.filter(function(trans) {
                    return trans.user == null
                })
                    res.json(transactions);
                }
            });
        }else{
            Transaction.find({company:req.session.company}).populate({path:'department vendor head user bill',populate:{path:'vendor verified.by'}}).exec(function(err,transactions) {
                if(err)
                    res.send(err)
                else{
                    transactions = transactions.filter(function(trans) {
                    return trans.user == null
                })
                    res.json(transactions);
                }
            });
        }
    }
};