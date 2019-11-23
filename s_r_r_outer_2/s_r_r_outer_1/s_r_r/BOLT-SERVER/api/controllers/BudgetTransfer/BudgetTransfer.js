'use strict';

var mongoose = require('mongoose');
var Heads = mongoose.model('Heads');
var BudgetTransfer = mongoose.model('BudgetTransfer');


//
var eventEmitter = require('../../Events/BudgetTransfer Events/Budget_Transfer_Events');
var timelineEmitter = require('../../Events/Approval Events/TimeLine_Events');

exports.transfer_a_budget = function(req,res,next){
    Heads.findOne({_id:req.body.source_head}).exec(function(err,source_head){
    if(source_head.amount_left[req.body.source_month] >= req.body.amount){
            var requester_model;
    if(req.session.user){
        requester_model = "Super_User";
    }else{
        requester_model = "User";
    }
    BudgetTransfer.create({
        company:req.session.company,
        source_head:req.body.source_head,
        destination_head:req.body.destination_head,
        amount:req.body.amount,
        source_month:req.body.source_month,
        destination_month:req.body.destination_month,
        requested_by:req.session.subuser || req.session.user,
        requester_model:requester_model,
        requester_designation: req.session.user_designation || undefined
    },function(err,BudgetTransfer){
        if(err){
            res.send(err);
        }else{
            if(BudgetTransfer){
                timelineEmitter.emit('Initiate',BudgetTransfer.company,BudgetTransfer._id);
                if(req.session.user){
                    res.json("super user approval");
                    eventEmitter.emit('TransferApproved',BudgetTransfer._id,"Auto");                
                }else{
                    res.locals.user_designation = BudgetTransfer.requester_designation;
                    res.locals.budtrans_id = BudgetTransfer._id;
                    next();
                }
            }   
        }
    });         
}else{
    res.json({message:"Budget Limit Exceeded"});
}

    });
    
};
// ###############################################

exports.manage_a_budget_transfer = function(req,res,next){
    var approval_matrix = res.locals.linemangers;
    var BudgetTransfer_id = res.locals.budtrans_id;
    var settings = res.locals.bud_settings;
    var user = req.session.subuser || req.session.user;
    var acceptor_designation = req.session.user_designation;
    var remarks = req.body.remarks;
    var partially_approved_amount = req.body.partially_approved_amount;
    BudgetTransfer.findByIdAndUpdate({_id:BudgetTransfer_id},{approval_matrix:{level1:approval_matrix[0],level2:approval_matrix[1],level3:approval_matrix[2],level4:approval_matrix[3],level5:approval_matrix[4]}},{new:true}).exec(function(err,BudTrans){
        if(err){
            console.log(err);
        }else{
            if(BudTrans.amount < settings.level1.amount && settings.level1.amount>0){
                eventEmitter.emit('TransferApproved',BudTrans._id,"Auto");         
         }else{
            if(BudTrans.approval_matrix.level1){
                eventEmitter.emit('Activate',BudTrans._id,"level1",user,acceptor_designation,remarks,partially_approved_amount,settings);
            }else{
                console.log("skip level 1");
                eventEmitter.emit('AcceptApproval',BudTrans._id,"level1",user,acceptor_designation,remarks,partially_approved_amount,settings);
            }
            if(settings.auto_cancel_time >0){
                setTimeout(function(){eventEmitter.emit('BudgetTransferAutoReject',BudTrans._id,BudTrans.request_by,BudTrans.company,BudTrans.amount);},res.locals.bud_settings.auto_cancel_time*60000);
            }
         }
         res.json({message:"budget Transfer request sent"});
      }
  });
}

exports.budget_transfer_approval = function(req,res,next){
    var settings = res.locals.bud_settings;
    console.log(req.session.company)
    BudgetTransfer.findOne({company:req.session.company,_id:req.params.budtransId}).exec(function(err,budtrans){
        if(err){
            res.json(err);
        }else{
            if(budtrans.atLevel == 0){
                var user = req.session.user || req.session.subuser;
                var acceptor_designation = req.session.user_designation;
                var remarks = req.body.remarks;
                var partially_approved_amount = req.body.partially_approved_amount;
                eventEmitter.emit('AcceptApproval',budtrans._id,"level1",user,acceptor_designation,remarks,partially_approved_amount,settings);
                res.json({message:"budtrans Accepted"});                
            }else if(budtrans.atLevel == 1){
                var user = req.session.user || req.session.subuser;
                var acceptor_designation = req.session.user_designation;
                var remarks = req.body.remarks;
                var partially_approved_amount = req.body.partially_approved_amount;
                eventEmitter.emit('AcceptApproval',budtrans._id,"level2",user,acceptor_designation,remarks,partially_approved_amount,settings);
                res.json({message:"budtrans Accepted"}); 
            }else if(budtrans.atLevel == 2){
                var user = req.session.user || req.session.subuser;
                var acceptor_designation = req.session.user_designation;
                var remarks = req.body.remarks;
                var partially_approved_amount = req.body.partially_approved_amount;
                eventEmitter.emit('AcceptApproval',budtrans._id,"level3",user,acceptor_designation,remarks,partially_approved_amount,settings);
                res.json({message:"budtrans Accepted"}); 
            }else if(budtrans.atLevel == 3){
                var user = req.session.user || req.session.subuser;
                var acceptor_designation = req.session.user_designation;
                var remarks = req.body.remarks;
                var partially_approved_amount = req.body.partially_approved_amount;
                eventEmitter.emit('AcceptApproval',budtrans._id,"level4",user,acceptor_designation,remarks,partially_approved_amount,settings);
                res.json({message:"budtrans Accepted"}); 
            }else if(budtrans.atLevel == 4){
                var user = req.session.user || req.session.subuser;
                var acceptor_designation = req.session.user_designation;
                var remarks = req.body.remarks;
                var partially_approved_amount = req.body.partially_approved_amount;
                eventEmitter.emit('AcceptApproval',budtrans._id,"level5",user,acceptor_designation,remarks,partially_approved_amount,settings);
                res.json({message:"budtrans Accepted"}); 

            }
        }

    });

};
// ##############################################

//REJECT REQUEST

exports.budget_transfer_rejection = function(req,res,next){
    BudgetTransfer.findOneAndUpdate({company:req.session.company,_id:req.params.budtransId},{last_updated:Date.now(),status:"DECLINED",assigned_to_designation:null,rejected_by:req.session.subuser || req.session.user},{new:true}).exec(function(err,budtrans){
        if(err)
            res.send(err);
        res.json({message:"Approval Rejected"});    

    });
}




// #######################################################
// get all Budget Transfer Requests

exports.get_all_budget_transfer_requests = function(req,res,next){
    if(req.session.user) {
        BudgetTransfer.find({company:req.session.company}).populate({path:'requested_by source_head destination_head level1approved.by level2approved.by level3approved.by level4approved.by level5approved.by',populate:{path:'user_type',populate:{path:'designation department'}}}).exec(function(err,budtrans){
            if(err)
                res.send(err);
            res.json(budtrans);   
        });
    }
    else{
        BudgetTransfer.find({company:req.session.company,$or:[{'level1approved.by':req.session.subuser},{'level2approved.by':req.session.subuser},{'level3approved.by':req.session.subuser},{'level4approved.by':req.session.subuser},{'level5approved.by':req.session.subuser},{'assigned_to_designation':req.session.user_designation},{'accepted_by':req.session.subuser},{'rejected_by':req.session.subuser},{'requested_by':req.session.subuser}]}).populate({path:'requested_by source_head destination_head level1approved.by level2approved.by level3approved.by level4approved.by level5approved.by',populate:{path:'user_type',populate:{path:'designation department'}}}).exec(function(err,budtrans){
            if(err)
                res.send(err);
            res.json(budtrans);   
        });
    }
};


exports.get_pending_budget_transfer_requests = function(req,res,next){
    if(req.session.subuser){
        BudgetTransfer.find({company:req.session.company,status:"PENDING",assigned_to:req.session.user_designation}).populate('requested_by').exec(function(err,budtrans){
            if(err)
                res.send(err);
            res.json(budtrans);  
        });

    }
};


// Send Pending Count

exports.send_pending_approval_count = function(req,res,next){
    if(req.session.user){
        BudgetTransfer.countDocuments({company:req.session.company,status:"PENDING"}).exec(function(err,count){
            if(err){
                res.send(err);
            }else{
                res.json(count);  
            }   
        });
    }
    else{
        BudgetTransfer.countDocuments({company:req.session.company,assigned_to_designation:req.session.user_designation,status:"PENDING"}).exec(function(err,count){
            if(err){
                res.send(err);
            }else{
                res.json(count);
            }
        });
    }
};
