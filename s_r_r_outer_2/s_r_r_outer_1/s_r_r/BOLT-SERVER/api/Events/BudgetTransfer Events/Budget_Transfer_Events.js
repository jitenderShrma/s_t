var mongoose = require('mongoose');
var events = require('events');
var eventEmitter = new events.EventEmitter();

//Models
var Heads = mongoose.model('Heads');
var BudgetTransfer = mongoose.model('BudgetTransfer');
var Designation = mongoose.model('Designation');
var User = mongoose.model('User');


//timeline Emitter

var timelineEmitter = require('../Approval Events/TimeLine_Events');

var AcceptApproval = function(BudgetTransfer_id,atLevel,user,approved_by_designation,remarks,partially_approved_amount,settings){
    if(atLevel == "level1"){
        BudgetTransfer.findOneAndUpdate({_id:BudgetTransfer_id},{last_updated:Date.now(),atLevel:1,level1approved:{by:user,status:true,designation:approved_by_designation,remarks:remarks,partially_approved_amount:partially_approved_amount}},{new:true}).exec(function(err,budtrans){
            if(err){
                console.log(err);
            }else{
                console.log("level 1 approved");
                var ofAmount = partially_approved_amount || budtrans.amount;
                var user_remarks = remarks || " ";
                User.findOne({_id:user}).exec(function(err,User){
                    if(User){
                        timelineEmitter.emit('UpdateTimeline',BudgetTransfer_id,"Level 1 approved by "+ `${User.personal_details.name}`+ " of Amount "+ `${ofAmount}`+" INR ,Remarks: "+`${user_remarks}`); 
                        if(settings.level2.amount < budtrans.amount && settings.level2.amount >= settings.level1.amount && settings.level2.amount>0){
                            if(budtrans.approval_matrix.level2){
                                console.log("activate level 2");
                                eventEmitter.emit('Activate',budtrans._id,"level2",user,approved_by_designation,remarks,partially_approved_amount,settings);
                            }else{
                                console.log("skip level 2");
                                eventEmitter.emit('AcceptApproval',budtrans._id,"level2",user,approved_by_designation,remarks,partially_approved_amount,settings);

                            }         
                        }else{
                            eventEmitter.emit('TransferApproved',BudgetTransfer_id,"level1",user,approved_by_designation,remarks,partially_approved_amount);
                        }
                    }
                });
            }
        });
    }else if(atLevel == "level2"){
       BudgetTransfer.findOneAndUpdate({_id:BudgetTransfer_id},{last_updated:Date.now(),atLevel:2,level2approved:{by:user,status:true,designation:approved_by_designation,remarks:remarks,partially_approved_amount:partially_approved_amount}},{new:true}).exec(function(err,budtrans){
            if(err){
                console.log(err);
            }else{
                console.log("level 2 approved");
                var ofAmount = partially_approved_amount || budtrans.amount;
                var user_remarks = remarks || " ";
                User.findOne({_id:user}).exec(function(err,User){
                    if(User){
                        timelineEmitter.emit('UpdateTimeline',BudgetTransfer_id,"Level 2 approved by "+ `${User.personal_details.name}`+ " of Amount "+ `${ofAmount}`+" INR ,Remarks: "+`${user_remarks}`);       
                        if(settings.level3.amount < budtrans.amount && settings.level3.amount >= settings.level2.amount && settings.level3.amount>0){
                            if(budtrans.approval_matrix.level3){
                                eventEmitter.emit('Activate',budtrans._id,"level3",user,approved_by_designation,remarks,partially_approved_amount);
                            }else{
                                console.log("skip level 3");
                                eventEmitter.emit('AcceptApproval',budtrans._id,"level3",user,approved_by_designation,remarks,partially_approved_amount,settings);

                            }         
                        }else{
                            eventEmitter.emit('TransferApproved',BudgetTransfer_id,"level2",user,approved_by_designation,remarks,partially_approved_amount);
                        }                  
                    }

                });
            }

        });
    }else if(atLevel == "level3"){
       BudgetTransfer.findOneAndUpdate({_id:BudgetTransfer_id},{last_updated:Date.now(),atLevel:3,level3approved:{by:user,status:true,designation:approved_by_designation,remarks:remarks,partially_approved_amount:partially_approved_amount}},{new:true}).exec(function(err,budtrans){
            if(err){
                console.log(err);
            }else{
                console.log("level 3 approved");
                var ofAmount = partially_approved_amount || budtrans.amount;
                var user_remarks = remarks || " ";
                User.findOne({_id:user}).exec(function(err,User){
                    if(User){
                        timelineEmitter.emit('UpdateTimeline',BudgetTransfer_id,"Level 3 approved by "+ `${User.personal_details.name}`+ " of Amount "+ `${ofAmount}`+" INR ,Remarks: "+`${user_remarks}`);  
                        if(settings.level4.amount < budtrans.amount && settings.level4.amount >= settings.level3.amount && settings.level4.amount>0){
                            if(budtrans.approval_matrix.level4){
                                eventEmitter.emit('Activate',budtrans._id,"level4",user,approved_by_designation,remarks,partially_approved_amount,settings);
                            }else{
                                console.log("skip level 4");
                                eventEmitter.emit('AcceptApproval',budtrans._id,"level4",user,approved_by_designation,remarks,partially_approved_amount,settings);
                            }         
                        }else{
                            eventEmitter.emit('TransferApproved',BudgetTransfer_id,"level3",user,approved_by_designation,remarks,partially_approved_amount);
                        }      
                    }
                });
            }
        });
    }else if(atLevel == "level4"){
       BudgetTransfer.findOneAndUpdate({_id:BudgetTransfer_id},{last_updated:Date.now(),atLevel:4,level4approved:{by:user,status:true,designation:approved_by_designation,remarks:remarks,partially_approved_amount:partially_approved_amount}},{new:true}).exec(function(err,budtrans){
            if(err){
                console.log(err);
            }else{
                console.log("level 4 approved");
                var ofAmount = partially_approved_amount || budtrans.amount;
                var user_remarks = remarks || " ";
                User.findOne({_id:user}).exec(function(err,User){
                    if(User){
                        timelineEmitter.emit('UpdateTimeline',BudgetTransfer_id,"Level 4 approved by "+ `${User.personal_details.name}`+ " of Amount "+ `${ofAmount}`+" INR ,Remarks: "+`${user_remarks}`);
                        if(settings.level5.amount < budtrans.amount && settings.level5.amount >= settings.level4.amount && settings.level5.amount>0){
                            if(budtrans.approval_matrix.level5){
                                eventEmitter.emit('Activate',budtrans._id,"level5",user,approved_by_designation,remarks,partially_approved_amount,settings);
                            }else{
                                console.log("skip level 4");
                                eventEmitter.emit('AcceptApproval',budtrans._id,"level5",user,approved_by_designation,remarks,partially_approved_amount,settings);
                            }         
                        }else{
                            eventEmitter.emit('TransferApproved',BudgetTransfer_id,"level4",user,approved_by_designation,remarks,partially_approved_amount);
                        }
                    }
                });
            }
        });
    }else if(atLevel == "level5"){
       BudgetTransfer.findOneAndUpdate({_id:BudgetTransfer_id},{last_updated:Date.now(),atLevel:5,level5approved:{by:user,status:true,designation:approved_by_designation,remarks:remarks,partially_approved_amount:partially_approved_amount}},{new:true}).exec(function(err,budtrans){
            if(err){
                console.log(err);
            }else{
                console.log("level 5 approved");
                var ofAmount = partially_approved_amount || budtrans.amount;
                var user_remarks = remarks || " ";
                User.findOne({_id:user}).exec(function(err,User){
                    if(User){
                        timelineEmitter.emit('UpdateTimeline',BudgetTransfer_id,"Level 5 approved by "+ `${User.personal_details.name}`+ " of Amount "+ `${ofAmount}`+" INR ,Remarks: "+`${user_remarks}`);
                        eventEmitter.emit('TransferApproved',BudgetTransfer_id,"level5",user,approved_by_designation,remarks,partially_approved_amount);                        
                    }
                });
            }

        });
    }

};


var BudgetTransferActivate = function(BudgetTransfer_id,atLevel,user,approved_by_designation,remarks,partially_approved_amount,settings){
    if(atLevel == "level1"){
        BudgetTransfer.findOne({_id:BudgetTransfer_id}).exec(function(err,butrans){
            if(butrans){
                BudgetTransfer.findOneAndUpdate({_id:BudgetTransfer_id},{assigned_to_designation:butrans.approval_matrix.level1,last_updated:Date.now()},{new:true}).exec(function(err,butrans2){
                  console.log("level 1 budget Transfer Request sent");  
                  Designation.findOne({_id:butrans2.assigned_to_designation}).exec(function(err,designation){
                      if(designation){
                          timelineEmitter.emit('UpdateTimeline',BudgetTransfer_id,"Level 1 Budget Transfer Request sent to "+designation.name);                                            
                      }
                  });

                });
            }

        });
    }else if(atLevel == "level2"){
        BudgetTransfer.findOne({_id:BudgetTransfer_id}).exec(function(err,budtrans){
            if(budtrans){
                var level1_id = JSON.stringify(budtrans.level1approved.designation);
                var level2_id = JSON.stringify(budtrans.approval_matrix.level2);
                if(level2_id == level1_id){
                    console.log("skip level 2");
                    eventEmitter.emit('AcceptApproval',budtrans._id,"level2",user,approved_by_designation,remarks,partially_approved_amount,settings);
                }else{
                    BudgetTransfer.findOneAndUpdate({_id:BudgetTransfer_id},{assigned_to_designation:budtrans.approval_matrix.level2,last_updated:Date.now()},{new:true}).exec(function(err,budtrans2){
                        console.log("level 2 budtrans sent");
                        Designation.findOne({_id:budtrans2.assigned_to_designation}).exec(function(err,designation){
                            if(designation){
                                timelineEmitter.emit('UpdateTimeline',BudgetTransfer_id,"Level 2 Budget Transfer Request sent to "+designation.name);                                            
                            }
                        });
                    });
                }
            }
        });
    }else if(atLevel == "level3"){
        console.log("Activate level 3");
        BudgetTransfer.findOne({_id:BudgetTransfer_id}).exec(function(err,budtrans){
            if(budtrans){
                var level1_id = JSON.stringify(budtrans.level1approved.designation);
                var level2_id = JSON.stringify(budtrans.level2approved.designation);
                var level3_id = JSON.stringify(budtrans.approval_matrix.level3);
                if(level3_id == level2_id || level3_id == level1_id){
                    console.log("skip level 3");
                    eventEmitter.emit('AcceptApproval',budtrans._id,"level3",user,approved_by_designation,remarks,partially_approved_amount,settings);
                }else{
                    BudgetTransfer.findOneAndUpdate({_id:BudgetTransfer_id},{assigned_to_designation:budtrans.approval_matrix.level3,last_updated:Date.now()},{new:true}).exec(function(err,budtrans2){
                        console.log("level 3 budtrans sent");
                        Designation.findOne({_id:budtrans2.assigned_to_designation}).exec(function(err,designation){
                            if(designation){
                                timelineEmitter.emit('UpdateTimeline',BudgetTransfer_id,"Level 3 budtrans sent to "+designation.name);                                            
                            }
                        });
                    });
                }
            }
        });
    }else if(atLevel == "level4"){
        console.log("Activate level 4");
        BudgetTransfer.findOne({_id:BudgetTransfer_id}).exec(function(err,budtrans){
            if(budtrans){
                var level1_id = JSON.stringify(budtrans.level1approved.designation);
                var level2_id = JSON.stringify(budtrans.level2approved.designation);
                var level3_id = JSON.stringify(budtrans.level3approved.designation);
                var level4_id = JSON.stringify(budtrans.approval_matrix.level4);
                if(level4_id == level3_id || level4_id == level2_id || level4_id == level1_id){
                    console.log("skip level 4");
                    eventEmitter.emit('AcceptApproval',budtrans._id,"level4",user,approved_by_designation,remarks,partially_approved_amount,settings);
                }else{
                    BudgetTransfer.findOneAndUpdate({_id:BudgetTransfer_id},{assigned_to_designation:budtrans.approval_matrix.level4,last_updated:Date.now()},{new:true}).exec(function(err,budtrans2){
                        console.log("level 4 budtrans sent");
                        Designation.findOne({_id:budtrans2.assigned_to_designation}).exec(function(err,designation){
                            if(designation){
                                timelineEmitter.emit('UpdateTimeline',BudgetTransfer_id,"Level 4 budtrans sent to "+designation.name);                                            
                            }
                        });
                    });
                }
            }
        });
    }else if(atLevel == "level5"){
        console.log("Activate level 5");
        BudgetTransfer.findOne({_id:BudgetTransfer_id}).exec(function(err,budtrans){
            if(budtrans){
                var level1_id = JSON.stringify(budtrans.level1approved.designation);
                var level2_id = JSON.stringify(budtrans.level2approved.designation);
                var level3_id = JSON.stringify(budtrans.level3approved.designation);
                var level4_id = JSON.stringify(budtrans.level4approved.designation);
                var level5_id = JSON.stringify(budtrans.approval_matrix.level5);
                if(level5_id == level4_id || level5_id == level3_id || level5_id == level2_id || level5_id == level1_id){
                    console.log("skip level 5");
                    eventEmitter.emit('AcceptApproval',budtrans._id,"level5",user,approved_by_designation,remarks,partially_approved_amount,settings);
                }else{
                    BudgetTransfer.findOneAndUpdate({_id:BudgetTransfer_id},{assigned_to_designation:budtrans.approval_matrix.level5,last_updated:Date.now()},{new:true}).exec(function(err,budtrans2){
                        console.log("level 5 budtrans sent");
                        Designation.findOne({_id:budtrans2.assigned_to_designation}).exec(function(err,designation){
                            if(designation){
                                timelineEmitter.emit('UpdateTimeline',BudgetTransfer_id,"Level 5 budtrans sent to "+designation.name);                                            
                            }
                        });
                    });
                }
            }
        });
    }
};

var TransferApprovalAccept = function(BudgetTransfer_id,approved_by,user){
    BudgetTransfer.findOne({_id:BudgetTransfer_id}).exec(function(err,budgetrequest){
        if(err){
            res.send(err);
        }else{
            if(budgetrequest){
                var source_month = budgetrequest.source_month;
                var destination_month = budgetrequest.destination_month;
                var amount = budgetrequest.amount;
                Heads.findOne({_id:budgetrequest.source_head}).exec(function(err,head1){
                    if(head1.amount_left[source_month] >=amount ){
                        head1.permissible_values[source_month] = head1.permissible_values[source_month] - amount;
                        head1.amount_left[source_month] = head1.amount_left[source_month] - amount;
                        Heads.findOneAndUpdate({_id:head1._id},{$set:{amount_left:head1.amount_left,permissible_values:head1.permissible_values}},{new:true}).exec(function(err,head1_updated){
                            Heads.findOne({_id:budgetrequest.destination_head}).exec(function(err,head2){
                                head2.permissible_values[destination_month] = head2.permissible_values[destination_month] + amount;
                                head2.amount_left[destination_month] = head2.amount_left[destination_month] + amount;
                                Heads.findOneAndUpdate({_id:head2._id},{$set:{amount_left:head2.amount_left,permissible_values:head2.permissible_values}},{new:true}).exec(function(err,head2_updated){
                                    console.log("Budget Transferred");
                                    if(approved_by == "Auto"){
                                        BudgetTransfer.findOneAndUpdate({_id:BudgetTransfer_id},{status:"APPROVED",accepted_by:"System",last_updated:Date.now()},{new:true}).exec(function(err,updated_budget){
                                            if(err){
                                                res.send(err);
                                            }else if(updated_budget){
                                                console.log("Auto approved");
                                            }
                                        });
                                    }else if(approved_by == "level1"){
                                        BudgetTransfer.findOneAndUpdate({_id:BudgetTransfer_id},{status:"APPROVED",atLevel:1,accepted_by:user,last_updated:Date.now()},{new:true}).exec(function(err,updated_budget){
                                            if(err){
                                                res.send(err);
                                            }else if(updated_budget){
                                                console.log("Level 1 approved");
                                            }
                                        });

                                    }else if(approved_by == "level2"){
                                        BudgetTransfer.findOneAndUpdate({_id:BudgetTransfer_id},{status:"APPROVED",atLevel:2,accepted_by:user,last_updated:Date.now()},{new:true}).exec(function(err,updated_budget){
                                            if(err){
                                                res.send(err);
                                            }else if(updated_budget){
                                                console.log("Level 2 approved");
                                            }
                                        });
                                    
                                    }else if(approved_by == "level3"){
                                        BudgetTransfer.findOneAndUpdate({_id:BudgetTransfer_id},{status:"APPROVED",atLevel:3,accepted_by:user,last_updated:Date.now()},{new:true}).exec(function(err,updated_budget){
                                            if(err){
                                                res.send(err);
                                            }else if(updated_budget){
                                                console.log("Level 3 approved");
                                            }
                                        });
                                    }else if(approved_by == "level4"){
                                        BudgetTransfer.findOneAndUpdate({_id:BudgetTransfer_id},{status:"APPROVED",atLevel:4,accepted_by:user,last_updated:Date.now()},{new:true}).exec(function(err,updated_budget){
                                            if(err){
                                                res.send(err);
                                            }else if(updated_budget){
                                                console.log("Level 4 approved");
                                            }
                                        });
                                    }else if(approved_by == "level5"){
                                        BudgetTransfer.findOneAndUpdate({_id:BudgetTransfer_id},{status:"APPROVED",atLevel:5,accepted_by:user,last_updated:Date.now()},{new:true}).exec(function(err,updated_budget){
                                            if(err){
                                                res.send(err);
                                            }else if(updated_budget){
                                                console.log("Level 5 approved");
                                            }
                                        });
                                    }
                                });
                            });
                        });
                    }
                });
                
            }
        }

    });
};

var BudgetTransferApprovalAutoReject = function(BudgetTransfer_id,user,company,amount){
    BudgetTransfer.findOne({_id:BudgetTransfer_id}).exec(function(err,budreq){
        if(err){
            console.log(err);
        }else{
            if(budreq.status == "PENDING"){
                BudgetTransfer.findByIdAndUpdate({_id:BudgetTransfer_id},{status:"AUTO-REJECTED/REQUEST TIME OUT",assigned_to:undefined},{new:true}).exec(function(err,update){
                    if(err){
                        console.log(err);
                    }
                    else{
                        // mailEmitter.emit('SendMail_approvals',user,company,'AutoReject',amount,"DeadBot");
                        console.log("Auto-Rejected");        
                    }
            
                });
                
            }else{
                if(budreq.status == "APPROVED"){
                    console.log("already approved");
                }else{
                    console.log("already Rejected");
                }
            }
        }

    });
   

    // console.log("OK after 10");

};




eventEmitter.on('TransferApproved',TransferApprovalAccept);
eventEmitter.on('BudgetTransferAutoReject',BudgetTransferApprovalAutoReject);
eventEmitter.on('Activate',BudgetTransferActivate);
eventEmitter.on('AcceptApproval',AcceptApproval);




module.exports = eventEmitter;
