var events = require('events');
var eventEmitter = new events.EventEmitter();
var mongoose = require('mongoose');
var Approvals = mongoose.model('Approvals');
var Heads = mongoose.model('Heads');
var Staff = mongoose.model('Staff');
var Designation = mongoose.model('Designation');
var User = mongoose.model('User');




var mailEmitter = require('../sendMail Events/sendMail_Events');
var timelineEmitter = require('../Approval Events/TimeLine_Events');


//Models


//Skip an approval
var SkipAnApproval = function(approval_id,fromLevel){
    if(fromLevel == "level1"){
        eventEmitter.emit()
    }

};

//

var AcceptApproval = function(approval_id,atLevel,user,approved_by_designation,remarks,partially_approved_amount,settings){
    if(atLevel == "level1"){
        Approvals.findOneAndUpdate({_id:approval_id},{last_updated:Date.now(),atLevel:1,level1approved:{by:user,status:true,designation:approved_by_designation,remarks:remarks,partially_approved_amount:partially_approved_amount}},{new:true}).exec(function(err,approval){
            if(err){
                console.log(err);
            }else{
                console.log("level 1 approved");
                var ofAmount = partially_approved_amount || approval.amount;
                var user_remarks = remarks || " ";
                User.findOne({_id:user}).exec(function(err,User){
                    if(User){
                        timelineEmitter.emit('UpdateTimeline',approval_id,"Level 1 approved by "+ `${User.personal_details.name}`+ " of Amount "+ `${ofAmount}`+" INR ,Remarks: "+`${user_remarks}`); 
                        if(settings.level2.amount < approval.amount && settings.level2.amount >= settings.level1.amount && settings.level2.amount>0){
                            if(approval.approval_matrix.level2){
                                console.log("activate level 2");
                                eventEmitter.emit('Activate',approval._id,"level2",user,approved_by_designation,remarks,partially_approved_amount,settings);
                            }else{
                                console.log("skip level 2");
                                eventEmitter.emit('AcceptApproval',approval._id,"level2",user,approved_by_designation,remarks,partially_approved_amount,settings);

                            }         
                        }else{
                            eventEmitter.emit('Approved',approval_id,"level1",user,approved_by_designation,remarks,partially_approved_amount);
                        }
                    }
                });
            }
        });
    }else if(atLevel == "level2"){
        Approvals.findOneAndUpdate({_id:approval_id},{last_updated:Date.now(),atLevel:2,level2approved:{by:user,status:true,designation:approved_by_designation,remarks:remarks,partially_approved_amount:partially_approved_amount}},{new:true}).exec(function(err,approval){
            if(err){
                console.log(err);
            }else{
                console.log("level 2 approved");
                var ofAmount = partially_approved_amount || approval.amount;
                var user_remarks = remarks || " ";
                User.findOne({_id:user}).exec(function(err,User){
                    if(User){
                        timelineEmitter.emit('UpdateTimeline',approval_id,"Level 2 approved by "+ `${User.personal_details.name}`+ " of Amount "+ `${ofAmount}`+" INR ,Remarks: "+`${user_remarks}`);       
                        if(settings.level3.amount < approval.amount && settings.level3.amount >= settings.level2.amount && settings.level3.amount>0){
                            if(approval.approval_matrix.level3){
                                eventEmitter.emit('Activate',approval._id,"level3",user,approved_by_designation,remarks,partially_approved_amount,settings);
                            }else{
                                console.log("skip level 3");
                                eventEmitter.emit('AcceptApproval',approval._id,"level3",user,approved_by_designation,remarks,partially_approved_amount,settings);

                            }         
                        }else{
                            eventEmitter.emit('Approved',approval_id,"level2",user,approved_by_designation,remarks,partially_approved_amount);
                        }                  
                    }

                });
            }

        });
    }else if(atLevel == "level3"){
        Approvals.findOneAndUpdate({_id:approval_id},{last_updated:Date.now(),atLevel:3,level3approved:{by:user,status:true,designation:approved_by_designation,remarks:remarks,partially_approved_amount:partially_approved_amount}},{new:true}).exec(function(err,approval){
            if(err){
                console.log(err);
            }else{
                console.log("level 3 approved");
                var ofAmount = partially_approved_amount || approval.amount;
                var user_remarks = remarks || " ";
                User.findOne({_id:user}).exec(function(err,User){
                    if(User){
                        timelineEmitter.emit('UpdateTimeline',approval_id,"Level 3 approved by "+ `${User.personal_details.name}`+ " of Amount "+ `${ofAmount}`+" INR ,Remarks: "+`${user_remarks}`);  
                        if(settings.level4.amount < approval.amount && settings.level4.amount >= settings.level3.amount && settings.level4.amount>0){
                            if(approval.approval_matrix.level4){
                                eventEmitter.emit('Activate',approval._id,"level4",user,approved_by_designation,remarks,partially_approved_amount,settings);
                            }else{
                                console.log("skip level 4");
                                eventEmitter.emit('AcceptApproval',approval._id,"level4",user,approved_by_designation,remarks,partially_approved_amount,settings);
                            }         
                        }else{
                            eventEmitter.emit('Approved',approval_id,"level3",user,approved_by_designation,remarks,partially_approved_amount);
                        }      
                    }
                });
            }
        });
    }else if(atLevel == "level4"){
        Approvals.findOneAndUpdate({_id:approval_id},{last_updated:Date.now(),atLevel:4,level4approved:{by:user,status:true,designation:approved_by_designation,remarks:remarks,partially_approved_amount:partially_approved_amount}},{new:true}).exec(function(err,approval){
            if(err){
                console.log(err);
            }else{
                console.log("level 4 approved");
                var ofAmount = partially_approved_amount || approval.amount;
                var user_remarks = remarks || " ";
                User.findOne({_id:user}).exec(function(err,User){
                    if(User){
                        timelineEmitter.emit('UpdateTimeline',approval_id,"Level 4 approved by "+ `${User.personal_details.name}`+ " of Amount "+ `${ofAmount}`+" INR ,Remarks: "+`${user_remarks}`);
                        if(settings.level5.amount < approval.amount && settings.level5.amount >= settings.level4.amount && settings.level5.amount>0){
                            if(approval.approval_matrix.level5){
                                eventEmitter.emit('Activate',approval._id,"level5",user,approved_by_designation,remarks,partially_approved_amount,settings);
                            }else{
                                console.log("skip level 4");
                                eventEmitter.emit('AcceptApproval',approval._id,"level5",user,approved_by_designation,remarks,partially_approved_amount,settings);
                            }         
                        }else{
                            eventEmitter.emit('Approved',approval_id,"level4",user,approved_by_designation,remarks,partially_approved_amount);
                        }
                    }
                });
            }
        });
    }else if(atLevel == "level5"){
        Approvals.findOneAndUpdate({_id:approval_id},{last_updated:Date.now(),atLevel:5,level5approved:{by:user,status:true,designation:approved_by_designation,remarks:remarks,partially_approved_amount:partially_approved_amount}},{new:true}).exec(function(err,approval){
            if(err){
                console.log(err);
            }else{
                console.log("level 5 approved");
                var ofAmount = partially_approved_amount || approval.amount;
                var user_remarks = remarks || " ";
                User.findOne({_id:user}).exec(function(err,User){
                    if(User){
                        timelineEmitter.emit('UpdateTimeline',approval_id,"Level 5 approved by "+ `${User.personal_details.name}`+ " of Amount "+ `${ofAmount}`+" INR ,Remarks: "+`${user_remarks}`);
                        eventEmitter.emit('Approved',approval_id,"level5",user,approved_by_designation,remarks,partially_approved_amount);                        
                    }
                });
            }

        });
    }
};


var ActivateApproval = function(approval_id,atLevel,user,approved_by_designation,remarks,partially_approved_amount,settings){
    if(atLevel == "level1"){
        Approvals.findOne({_id:approval_id}).exec(function(err,approval){
            if(approval){
                var self_designation = JSON.stringify(approval.requester_designation);
                var level1_id = JSON.stringify(approval.approval_matrix.level);
                if(level1_id == self_designation){
                    console.log("skip level 1");
                    eventEmitter.emit('AcceptApproval',approval._id,"level1",user,approved_by_designation,remarks,partially_approved_amount,settings);
                }else{
                    Approvals.findOneAndUpdate({_id:approval_id},{assigned_to_designation:approval.approval_matrix.level1,last_updated:Date.now()},{new:true}).exec(function(err,approval2){
                        console.log("level 1 approval sent");  
                        Designation.findOne({_id:approval2.assigned_to_designation}).exec(function(err,designation){
                            if(designation){
                                timelineEmitter.emit('UpdateTimeline',approval_id,"Level 1 approval sent to "+designation.name);                                            
                            }
                        });
                      });
                }
                
            }

        });
    }else if(atLevel == "level2"){
        Approvals.findOne({_id:approval_id}).exec(function(err,approval){
            if(approval){
                var self_designation = JSON.stringify(approval.requester_designation);
                var level1_id = JSON.stringify(approval.level1approved.designation);
                var level2_id = JSON.stringify(approval.approval_matrix.level2);
                if(level2_id == level1_id || level2_id == self_designation){
                    console.log("skip level 2");
                    eventEmitter.emit('AcceptApproval',approval._id,"level2",user,approved_by_designation,remarks,partially_approved_amount,settings);
                }else{
                    Approvals.findOneAndUpdate({_id:approval_id},{assigned_to_designation:approval.approval_matrix.level2,last_updated:Date.now()},{new:true}).exec(function(err,approval2){
                        console.log("level 2 approval sent");
                        Designation.findOne({_id:approval2.assigned_to_designation}).exec(function(err,designation){
                            if(designation){
                                timelineEmitter.emit('UpdateTimeline',approval_id,"Level 2 approval sent to "+designation.name);                                            
                            }
                        });
                    });
                }
            }

        });

    }else if(atLevel == "level3"){
        console.log("Activate level 3");
        Approvals.findOne({_id:approval_id}).exec(function(err,approval){
            if(approval){
                var self_designation = JSON.stringify(approval.requester_designation);
                var level1_id = JSON.stringify(approval.level1approved.designation);
                var level2_id = JSON.stringify(approval.level2approved.designation);
                var level3_id = JSON.stringify(approval.approval_matrix.level3);
                if(level3_id == level2_id || level3_id == level1_id || level3_id == self_designation){
                    console.log("skip level 3");
                    eventEmitter.emit('AcceptApproval',approval._id,"level3",user,approved_by_designation,remarks,partially_approved_amount,settings);
                }else{
                    Approvals.findOneAndUpdate({_id:approval_id},{assigned_to_designation:approval.approval_matrix.level3,last_updated:Date.now()},{new:true}).exec(function(err,approval2){
                        console.log("level 3 approval sent");
                        Designation.findOne({_id:approval2.assigned_to_designation}).exec(function(err,designation){
                            if(designation){
                                timelineEmitter.emit('UpdateTimeline',approval_id,"Level 3 approval sent to "+designation.name);                                            
                            }
                        });
                    });
                }
            }
        });
    }else if(atLevel == "level4"){
        console.log("Activate level 4");
        Approvals.findOne({_id:approval_id}).exec(function(err,approval){
            if(approval){
                var self_designation = JSON.stringify(approval.requester_designation);
                var level1_id = JSON.stringify(approval.level1approved.designation);
                var level2_id = JSON.stringify(approval.level2approved.designation);
                var level3_id = JSON.stringify(approval.level3approved.designation);
                var level4_id = JSON.stringify(approval.approval_matrix.level4);
                if(level4_id == level3_id || level4_id == level2_id || level4_id == level1_id || level4_id == self_designation){
                    console.log("skip level 4");
                    eventEmitter.emit('AcceptApproval',approval._id,"level4",user,approved_by_designation,remarks,partially_approved_amount,settings);
                }else{
                    Approvals.findOneAndUpdate({_id:approval_id},{assigned_to_designation:approval.approval_matrix.level4,last_updated:Date.now()},{new:true}).exec(function(err,approval2){
                        console.log("level 4 approval sent");
                        Designation.findOne({_id:approval2.assigned_to_designation}).exec(function(err,designation){
                            if(designation){
                                timelineEmitter.emit('UpdateTimeline',approval_id,"Level 4 approval sent to "+designation.name);                                            
                            }
                        });
                    });
                }
            }
        });
    }else if(atLevel == "level5"){
        console.log("Activate level 5");
        Approvals.findOne({_id:approval_id}).exec(function(err,approval){
            if(approval){
                var self_designation = JSON.stringify(approval.requester_designation);
                var level1_id = JSON.stringify(approval.level1approved.designation);
                var level2_id = JSON.stringify(approval.level2approved.designation);
                var level3_id = JSON.stringify(approval.level3approved.designation);
                var level4_id = JSON.stringify(approval.level4approved.designation);
                var level5_id = JSON.stringify(approval.approval_matrix.level5);
                if(level5_id == level4_id || level5_id == level3_id || level5_id == level2_id || level5_id == level1_id || level5_id == self_designation){
                    console.log("skip level 5");
                    eventEmitter.emit('AcceptApproval',approval._id,"level5",user,approved_by_designation,remarks,partially_approved_amount,settings);
                }else{
                    Approvals.findOneAndUpdate({_id:approval_id},{assigned_to_designation:approval.approval_matrix.level5,last_updated:Date.now()},{new:true}).exec(function(err,approval2){
                        console.log("level 5 approval sent");
                        Designation.findOne({_id:approval2.assigned_to_designation}).exec(function(err,designation){
                            if(designation){
                                timelineEmitter.emit('UpdateTimeline',approval_id,"Level 5 approval sent to "+designation.name);                                            
                            }
                        });
                    });
                }
            }
        });
    }
};

var ApprovalAccept = function(approval_id,approval_by,user,designation,remarks,partially_approved_amount){
    Approvals.findOne({_id:approval_id}).exec(function(err,approval){
        if(err){
            console.log(err);
        }else{
            Heads.findOne({_id:approval.budget_head}).exec(function(err,head){
                if(err){
                    res.send(err);
                }else if(head == null){
                    res.json({message:"Head not Found"});            
                }else{
                    if(head.amount_left[approval.month]>=approval.amount){
                        if(approval.approval_type == "One Time"){
                            if(partially_approved_amount){
                                head.amount_left[approval.month] = head.amount_left[approval.month] - partially_approved_amount;
                                approval.approval_amount_left[approval.month] = partially_approved_amount;
                            }else{
                                head.amount_left[approval.month] = head.amount_left[approval.month]-approval.amount;
                                approval.approval_amount_left[approval.month] = approval.amount;
                                // approval_amount_left = approval.approval_amount_left;
                            }
                        }else{
                            for(var i=0;i<approval.recurring_period;i++){
                                if(partially_approved_amount){
                                    if(head.amount_left[approval.month] >=partially_approved_amount){
                                        head.amount_left[approval.month] = head.amount_left[approval.month] - partially_approved_amount;
                                        approval.approval_amount_left[approval.month] = partially_approved_amount;
                                        approval.month = parseInt(approval.month)+1;     
                                    }else{
                                        approval.approval_amount_left[approval.month] = head.amount_left[approval.month];
                                        head.amount_left[approval.month] = 0;
                                        approval.month = parseInt(approval.month)+1;     
                                    }
                                    if(approval.month > 11){
                                        approval.month = 0;
                                    }
                                

                                }else{
                                    if(head.amount_left[approval.month] >=approval.amount){
                                        head.amount_left[approval.month] = head.amount_left[approval.month] - approval.amount;
                                        approval.approval_amount_left[approval.month] = approval.amount;
                                        approval.month = parseInt(approval.month)+1;     
                                    }else{
                                        approval.approval_amount_left[approval.month] = head.amount_left[approval.month];
                                        head.amount_left[approval.month] = 0;
                                        approval.month = parseInt(approval.month)+1;     
                                    }
                                    if(approval.month > 11){
                                        approval.month = 0;
                                    }
                                }
                                
                                
                             
                            }
                        }
                        var approval_amount;
                        if(partially_approved_amount){
                            approval_amount = partially_approved_amount;
                        }else{
                            approval_amount = approval.amount;
                        }
                        Heads.findOneAndUpdate({_id:approval.budget_head},{$set:{amount_left:head.amount_left}},{new:true}).exec(function(err,updated_head){
                            if(err){
                                console.log(err);
                            }else{
                                if(approval_by == "Auto"){
                                    Approvals.findOneAndUpdate({_id:approval_id},{status:"APPROVED",last_updated:Date.now(),$set:{approval_amount_left:approval.approval_amount_left}},{new:true}).exec(function(err,updated_approval){
                                        if(err){
                                            console.log(err);
                                        }else{
                                            console.log("Auto Approved");
                                            timelineEmitter.emit('UpdateTimeline',approval_id,"Auto Approved");
                                        }
    
                                    });

                                }
                                else if(approval_by == "level1"){
                                    Approvals.findOneAndUpdate({_id:approval_id},{status:"APPROVED",last_updated:Date.now(),amount:approval_amount,$set:{approval_amount_left:approval.approval_amount_left},atLevel:1,level1approved:{by:user,designation:designation,status:true,remarks:remarks,partially_approved_amount:partially_approved_amount}},{new:true}).exec(function(err,updated_approval){
                                        if(err){
                                            console.log(err);
                                        }else{
                                            console.log("level 1 approved");
                                            var user_remarks = remarks || " ";
                                            User.findOne({_id:user}).exec(function(err,User){
                                                timelineEmitter.emit('UpdateTimeline',approval_id,"Approved by "+ `${User.personal_details.name}`+ " of Amount " + `${approval_amount}` + " INR ,Remarks: "+`${user_remarks}`);                                            
                                                mailEmitter.emit('request_accepted_mail',approval.request_by,approval.company,"Approval",approval.amount,user);
                                            });
                                        }
                                    });
                                }
                                else if(approval_by == "level2"){
                                    Approvals.findOneAndUpdate({_id:approval_id},{status:"APPROVED",last_updated:Date.now(),amount:approval_amount,$set:{approval_amount_left:approval.approval_amount_left},atLevel:2,level2approved:{by:user,designation:designation,status:true,remarks:remarks,partially_approved_amount:partially_approved_amount}},{new:true}).exec(function(err,updated_approval){
                                        if(err){
                                            console.log(err);
                                        }else{
                                            console.log("level 2 approved");
                                            var user_remarks = remarks || " ";
                                            User.findOne({_id:user}).exec(function(err,User){
                                                timelineEmitter.emit('UpdateTimeline',approval_id,"Approved by "+ `${User.personal_details.name}`+ " of Amount " + `${approval_amount}` + " INR ,Remarks: "+`${user_remarks}`);                                            
                                                mailEmitter.emit('request_accepted_mail',approval.request_by,approval.company,"Approval",approval.amount,user);
                                            });
                                        }
                                    });
                                }
                                else if(approval_by == "level3"){
                                    Approvals.findOneAndUpdate({_id:approval_id},{status:"APPROVED",last_updated:Date.now(),amount:approval_amount,$set:{approval_amount_left:approval.approval_amount_left},atLevel:3,level3approved:{by:user,designation:designation,status:true,remarks:remarks,partially_approved_amount:partially_approved_amount}},{new:true}).exec(function(err,updated_approval){
                                        if(err){
                                            console.log(err);
                                        }else{
                                            console.log("level 3 approved");
                                            var user_remarks = remarks || " ";
                                            User.findOne({_id:user}).exec(function(err,User){
                                                timelineEmitter.emit('UpdateTimeline',approval_id,"Approved by "+ `${User.personal_details.name}`+ " of Amount " + `${approval_amount}` + " INR ,Remarks: "+`${user_remarks}`);                                            
                                                mailEmitter.emit('request_accepted_mail',approval.request_by,approval.company,"Approval",approval.amount,user);
                                            });
                                        }
                                    });
                                }
                                else if(approval_by == "level4"){
                                    Approvals.findOneAndUpdate({_id:approval_id},{status:"APPROVED",last_updated:Date.now(),amount:approval_amount,$set:{approval_amount_left:approval.approval_amount_left},atLevel:4,level4approved:{by:user,designation:designation,status:true,remarks:remarks,partially_approved_amount:partially_approved_amount}},{new:true}).exec(function(err,updated_approval){
                                        if(err){
                                            console.log(err);
                                        }else{
                                            console.log("level 4 approved");
                                            var user_remarks = remarks || " ";
                                            User.findOne({_id:user}).exec(function(err,User){
                                                timelineEmitter.emit('UpdateTimeline',approval_id,"Approved by "+ `${User.personal_details.name}`+ " of Amount " + `${approval_amount}` + " INR ,Remarks: "+`${user_remarks}`);                                            
                                                mailEmitter.emit('request_accepted_mail',approval.request_by,approval.company,"Approval",approval.amount,user);
                                            });
                                        }
                                    });

                                }else if(approval_by == "level5"){
                                    Approvals.findOneAndUpdate({_id:approval_id},{status:"APPROVED",last_updated:Date.now(),amount:approval_amount,$set:{approval_amount_left:approval.approval_amount_left},atLevel:5,level5approved:{by:user,designation:designation,status:true,remarks:remarks,partially_approved_amount:partially_approved_amount}},{new:true}).exec(function(err,updated_approval){
                                        if(err){
                                            console.log(err);
                                        }else{
                                            console.log("level 5 approved");
                                            var user_remarks = remarks || " ";
                                            User.findOne({_id:user}).exec(function(err,User){
                                                timelineEmitter.emit('UpdateTimeline',approval_id,"Approved by "+ `${User.personal_details.name}`+ " of Amount " + `${approval_amount}` + " INR ,Remarks: "+`${user_remarks}`);                                            
                                                mailEmitter.emit('request_accepted_mail',approval.request_by,approval.company,"Approval",approval.amount,user);
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }else{
                        Approvals.findOneAndUpdate({_id:approval_id},{status:"BUDGET LIMIT EXCEEDED",last_updated:Date.now()},{new:true}).exec(function(err,updated_approval){
                            if(err){
                                console.log(err);
                            }else{
                                console.log("Budget Limit Exceeded");
                                timelineEmitter.emit('UpdateTimeline',approval_id,"Approval Budget Limit Exceeded");                                            
                            }

                        });
                    }

                }

            });
        }
    });
};

var ApprovalAutoReject = function(approval_id,user,company,amount){
    Approvals.findOne({_id:approval_id}).exec(function(err,approval){
        if(err){
            console.log(err);
        }else{
            if(approval.status == "PENDING"){
                Approvals.findByIdAndUpdate({_id:approval_id},{status:"AUTO-REJECTED",last_updated:Date.now(),assigned_to_designation:undefined},{new:true}).exec(function(err,update){
                    if(err){
                        console.log(err);
                    }
                    else{
                        mailEmitter.emit('SendMail_approvals',user,company,'AutoReject',amount,"DeadBot");
                        timelineEmitter.emit('UpdateTimeline',approval_id,"Approval Auto Rejected / Request Time-Out");                                            
                        console.log("Auto-Rejected");        
                    }
            
                });
                
            }else{
                if(approval.status == "APPROVED"){
                    console.log("already approved");
                }else{
                    console.log("already Rejected");
                }
            }
        }

    });
   

    // console.log("OK after 10");

};

var SendApproval = function(approval_id,designation_id,alert_time,user,level,approved_by_designation,remarks,partially_approved_amount){
    if(level == 0){
        Approvals.findOneAndUpdate({_id:approval_id},{last_updated:Date.now(),atLevel:1,level1approved:{by:user,status:true,designation:approved_by_designation,remarks:remarks,partially_approved_amount:partially_approved_amount}},{new:true}).exec(function(err,approval){
            if(err){
                console.log(err);
            }else{
                console.log("level 1 request Accepted");
                if(approval.level1approved.designation == designation_id){

                }else{
                    Approvals.findOneAndUpdate({_id:approval_id},{assigned_to_designation:designation_id,last_updated:Date.now()},{new:true}).exec(function(err,new_approval){
                        timelineEmitter.emit('UpdateTimeline',approval_id,"Approval sent for Level 2 approval");                                            
                    });
                }
            }
    
        });

    }else if(level == 1){
        Approvals.findOneAndUpdate({_id:approval_id},{assigned_to_designation:designation_id,last_updated:Date.now(),atLevel:2,level2approved:{by:user,status:true,designation:approved_by_designation,remarks:remarks,partially_approved_amount:partially_approved_amount}},{new:true}).exec(function(err,approval){
            if(err){
                console.log(err);
            }else{
                console.log("level 3 request sent");
                timelineEmitter.emit('UpdateTimeline',approval_id,"Approval sent for Level 3 approval");                                            
            }
    
        });

    }else if(level == 2){
        Approvals.findOneAndUpdate({_id:approval_id},{assigned_to_designation:designation_id,last_updated:Date.now(),atLevel:3,level3approved:{by:user,status:true,designation:approved_by_designation,remarks:remarks,partially_approved_amount:partially_approved_amount}},{new:true}).exec(function(err,approval){
            if(err){
                console.log(err);
            }else{
                console.log("level 4 request sent");
                timelineEmitter.emit('UpdateTimeline',approval_id,"Approval sent for Level 4 approval");                                            
            }
    
        });
    }else if(level == 3){
        Approvals.findOneAndUpdate({_id:approval_id},{assigned_to_designation:designation_id,last_updated:Date.now(),atLevel:4,level4approved:{by:user,status:true,designation:approved_by_designation,remarks:remarks,partially_approved_amount:partially_approved_amount}},{new:true}).exec(function(err,approval){
            if(err){
                console.log(err);
            }else{
                console.log("level 5 request sent");
                timelineEmitter.emit('UpdateTimeline',approval_id,"Approval sent for Level 5 approval");                                            
            }
    
        });
    }else{
        Approvals.findOneAndUpdate({_id:approval_id},{assigned_to_designation:designation_id,last_updated:Date.now()},{new:true}).exec(function(err,approval){
            if(err){
                console.log(err);
            }else{
                console.log("level 1 request sent");
                timelineEmitter.emit('UpdateTimeline',approval_id,"Approval sent for Level 1 approval");                                            
            }
    
        });

    }
   


};


var LineManagerApproval = function(approval_id,request_by,amount,subuser,company,user_designation,LineManager,requester_name,level,approved_by_designation,remarks,partially_approved_amount,settings,level1approved_designation,level2approved_designation,level3approved_designation,level4approved_designation){
    var asyncLoopvalue ;
    var assigned_to_designation;
    if(LineManager == "LM1"){
        asyncLoopvalue = 1;
    }else if(LineManager == "LM2"){
        asyncLoopvalue = 2;
    }else if(LineManager == "LM3"){
        asyncLoopvalue = 3;
    }else if(LineManager == "LM4"){
        asyncLoopvalue = 4;
    }else if(LineManager == "LM5"){
        asyncLoopvalue = 5;
    }else{
        asyncLoopvalue = 0;
        console.log("invalid Line Manager "+ LineManager)
    }
    if(level == 0){
        var parents = [] ;
        parents[0] = user_designation;
        console.log(parents[0]);
        function AsyncLoop(i,cb){
            if(i<asyncLoopvalue){
                Designation.findOne({_id:parents[i]}).exec(function(err,designation){
                    if(designation.parent_designation_id == undefined){
                        assigned_to_designation = undefined;
                        cb();
                    }else{
                        parents[i+1] = designation.parent_designation_id;
                        AsyncLoop(i+1,cb);
                    }

                });
            }else{
                assigned_to_designation = parents[i];
                cb();
            }
        }AsyncLoop(0,function(){
            console.log("loop ended");
            // console.log(assigned_to_designation);
            if(assigned_to_designation == undefined){
                if(settings.level3.designation){
                    if(settings.level3.designation == "LM1" || settings.level3.designation == "LM2" || settings.level3.designation == "LM3" || settings.level3.designation == "LM4" || settings.level3.designation == "LM5" || settings.level3.designation == level1approved_designation || settings.level3.designation == level2approved_designation){
                        if(settings.level4.designation){
                            if(settings.level4.designation == "LM1" || settings.level4.designation == "LM2" || settings.level4.designation == "LM3" || settings.level4.designation == "LM4" || settings.level4.designation == "LM5" || settings.level4.designation == level1approved_designation || settings.level4.designation == level2approved_designation || settings.level4.designation == level3approved_designation){
                                if(settings.level5.designation){
                                    if(settings.level5.designation == "LM1" || settings.level5.designation == "LM2" || settings.level5.designation == "LM3" || settings.level5.designation == "LM4" || settings.level5.designation == "LM5" || settings.level5.designation == level1approved_designation || settings.level5.designation == level2approved_designation || settings.level5.designation == level3approved_designation || settings.level5.designation == level4approved_designation){
                                        eventEmitter.emit('Approved',approval_id,"level1",subuser);
                                    }else{
                                        Approvals.findOneAndUpdate({_id:approval_id},{assigned_to_designation:settings.level5.designation,last_updated:Date.now(),atLevel:4,level1approved:{by:subuser,designation:approved_by_designation,status:true},level2approved:{by:subuser,designation:approved_by_designation,status:true},level3approved:{by:subuser,designation:approved_by_designation,status:true},level4approved:{by:subuser,designation:approved_by_designation,status:true}},{new:true}).exec(function(err,approval){
                                            if(err){
                                                console.log(err);
                                            }else{
                                                    console.log("level 2 ,level 3 , level 4 request skipped");
                                                    timelineEmitter.emit('UpdateTimeline',approval_id,"Level 5 Request sent");              
                                                    // mailEmitter.emit('SendMail_approvals_sent',request_by,company,'request_sent',amount);
                                                    // mailEmitter.emit('SendMail_approvals_arrived',assigned_to_designation,company,'request_received',amount,requester_name);
                                            }
                                        });

                                    }
                                }else{
                                    eventEmitter.emit('Approved',approval_id,"level1",subuser);
                                }
                            }else{
                                Approvals.findOneAndUpdate({_id:approval_id},{assigned_to_designation:settings.level4.designation,last_updated:Date.now(),atLevel:3,level1approved:{by:subuser,designation:approved_by_designation,status:true},level2approved:{by:subuser,designation:approved_by_designation,status:true},level3approved:{by:subuser,designation:approved_by_designation,status:true}},{new:true}).exec(function(err,approval){
                                    if(err){
                                        console.log(err);
                                    }else{
                                            console.log("level 2 and level 3 request skipped");
                                            timelineEmitter.emit('UpdateTimeline',approval_id,"Level 4 Request sent");              
                                            // mailEmitter.emit('SendMail_approvals_sent',request_by,company,'request_sent',amount);
                                            // mailEmitter.emit('SendMail_approvals_arrived',assigned_to_designation,company,'request_received',amount,requester_name);
                                    }
                                });

                            }
                        }else{
                            eventEmitter.emit('Approved',approval_id,"level1",subuser);
                        }   
                    }else{
                        Approvals.findOneAndUpdate({_id:approval_id},{assigned_to_designation:settings.level3.designation,last_updated:Date.now(),atLevel:2,level1approved:{by:subuser,designation:approved_by_designation,status:true},level2approved:{by:subuser,designation:approved_by_designation,status:true}},{new:true}).exec(function(err,approval){
                            if(err){
                                console.log(err);
                            }else{
                                    console.log("level 2 request skipped");
                                    timelineEmitter.emit('UpdateTimeline',approval_id,"Level 3 Request sent");              
                                    // mailEmitter.emit('SendMail_approvals_sent',request_by,company,'request_sent',amount);
                                    // mailEmitter.emit('SendMail_approvals_arrived',assigned_to_designation,company,'request_received',amount,requester_name);
    
                            }
                    
                        });
                    }

                }else{
                    eventEmitter.emit('Approved',approval_id,"level1",subuser);
                }
            }else{
                        if(assigned_to_designation == approved_by_designation){
                            console.log("skip");

                        }else{
                            Approvals.findOneAndUpdate({_id:approval_id},{assigned_to_designation:assigned_to_designation,last_updated:Date.now(),atLevel:1,level1approved:{by:subuser,designation:approved_by_designation,status:true}},{new:true}).exec(function(err,approval){
                                if(err){
                                    console.log(err);
                                }else{
                                    console.log("level 2 request sent");
                                        timelineEmitter.emit('UpdateTimeline',approval_id,"Level 2 Request sent to "+LineManager);              
                                        mailEmitter.emit('SendMail_approvals_sent',request_by,company,'request_sent',amount);
                                        mailEmitter.emit('SendMail_approvals_arrived',assigned_to_designation,company,'request_received',amount,requester_name);
                                }
                            });
                        }                    
                }
        });  
    }else if(level == 1){
        var parents = [] ;
        parents[0] = user_designation;
        console.log(parents[0]);
        function AsyncLoop(i,cb){
            if(i<asyncLoopvalue){
                Designation.findOne({_id:parents[i]}).exec(function(err,designation){
                    if(designation.parent_designation_id == undefined){
                        assigned_to_designation = undefined;
                        cb();
                    }else{
                        parents[i+1] = designation.parent_designation_id;
                        AsyncLoop(i+1,cb);
                    }

                });
            }else{
                assigned_to_designation = parents[i];
                cb();
            }
        }AsyncLoop(0,function(){
            console.log("loop ended");
            // console.log(assigned_to_designation);
            if(assigned_to_designation == undefined){
                if(settings.level4.designation){
                     if(settings.level4.designation == "LM1" || settings.level4.designation == "LM2" || settings.level4.designation == "LM3" || settings.level4.designation == "LM4" || settings.level4.designation == "LM5"){
                        if(settings.level5.designation){
                            if(settings.level5.designation == "LM1" || settings.level5.designation == "LM2" || settings.level5.designation == "LM3" || settings.level5.designation == "LM4" || settings.level5.designation == "LM5" ){
                                eventEmitter.emit('Approved',approval_id,"level2",subuser);
                            }else{
                                Approvals.findOneAndUpdate({_id:approval_id},{assigned_to_designation:settings.level5.designation,last_updated:Date.now(),atLevel:4,level2approved:{by:subuser,designation:approved_by_designation,status:true},level3approved:{by:subuser,designation:approved_by_designation,status:true},level4approved:{by:subuser,designation:approved_by_designation,status:true}},{new:true}).exec(function(err,approval){
                                    if(err){
                                        console.log(err);
                                    }else{
                                            console.log(" level 3 and level 4 request skipped");
                                            timelineEmitter.emit('UpdateTimeline',approval_id,"Level 5 Request sent");              
                                            // mailEmitter.emit('SendMail_approvals_sent',request_by,company,'request_sent',amount);
                                            // mailEmitter.emit('SendMail_approvals_arrived',assigned_to_designation,company,'request_received',amount,requester_name);
                                    }
                                });

                            }
                        }else{
                            eventEmitter.emit('Approved',approval_id,"level2",subuser);
                        }

                    }else{
                        Approvals.findOneAndUpdate({_id:approval_id},{assigned_to_designation:settings.level4.designation,last_updated:Date.now(),atLevel:3,level2approved:{by:subuser,designation:approved_by_designation,status:true},level3approved:{by:subuser,designation:approved_by_designation,status:true}},{new:true}).exec(function(err,approval){
                            if(err){
                                console.log(err);
                            }else{
                                    console.log(" level 3 request skipped");
                                    timelineEmitter.emit('UpdateTimeline',approval_id,"Level 4 Request sent");              
                                    // mailEmitter.emit('SendMail_approvals_sent',request_by,company,'request_sent',amount);
                                    // mailEmitter.emit('SendMail_approvals_arrived',assigned_to_designation,company,'request_received',amount,requester_name);
                            }
                        });

                    }

                }else{
                    eventEmitter.emit('Approved',approval_id,"level2",subuser);
                }
            }else{
                    Approvals.findOneAndUpdate({_id:approval_id},{assigned_to_designation:assigned_to_designation,last_updated:Date.now(),atLevel:2,level2approved:{by:subuser,designation:approved_by_designation,status:true}},{new:true}).exec(function(err,approval){
                        if(err){
                            console.log(err);
                        }else{
                            timelineEmitter.emit('UpdateTimeline',approval_id,"Level 3 Request sent to "+LineManager);              
                            console.log("level 3 request sent");
                            mailEmitter.emit('SendMail_approvals_sent',request_by,company,'request_sent',amount);
                            mailEmitter.emit('SendMail_approvals_arrived',assigned_to_designation,company,'request_received',amount,requester_name);

                        }
                
                    });
                }
        });  
    }else if(level == 2){
        var parents = [] ;
        parents[0] = user_designation;
        console.log(parents[0]);
        function AsyncLoop(i,cb){
            if(i<asyncLoopvalue){
                Designation.findOne({_id:parents[i]}).exec(function(err,designation){
                    if(designation.parent_designation_id == undefined){
                        assigned_to_designation = undefined;
                        cb();
                    }else{
                        parents[i+1] = designation.parent_designation_id;
                        AsyncLoop(i+1,cb);
                    }

                });
            }else{
                assigned_to_designation = parents[i];
                cb();
            }
        }AsyncLoop(0,function(){
            console.log("loop ended");
            // console.log(assigned_to_designation);
            if(assigned_to_designation == undefined){
                if(settings.level5.designation){
                    if(settings.level5.designation == "LM1" || settings.level5.designation == "LM2" || settings.level5.designation == "LM3" || settings.level5.designation == "LM4" || settings.level5.designation == "LM5" ){
                        eventEmitter.emit('Approved',approval_id,"level3",subuser);
                    }else{
                        Approvals.findOneAndUpdate({_id:approval_id},{assigned_to_designation:settings.level5.designation,last_updated:Date.now(),atLevel:4,level3approved:{by:subuser,designation:approved_by_designation,status:true},level4approved:{by:subuser,designation:approved_by_designation,status:true}},{new:true}).exec(function(err,approval){
                            if(err){
                                console.log(err);
                            }else{
                                console.log("level 4 request skipped");
                                timelineEmitter.emit('UpdateTimeline',approval_id,"Level 5 Request sent");              
                                // mailEmitter.emit('SendMail_approvals_sent',request_by,company,'request_sent',amount);
                                // mailEmitter.emit('SendMail_approvals_arrived',assigned_to_designation,company,'request_received',amount,requester_name);
    
                            }
                    
                        });

                    }

                }else{
                    eventEmitter.emit('Approved',approval_id,"level3",subuser);
                }
            }else{
                    Approvals.findOneAndUpdate({_id:approval_id},{assigned_to_designation:assigned_to_designation,last_updated:Date.now(),atLevel:3,level3approved:{by:subuser,designation:approved_by_designation,status:true}},{new:true}).exec(function(err,approval){
                        if(err){
                            console.log(err);
                        }else{

                            console.log("level 4 request sent");
                            timelineEmitter.emit('UpdateTimeline',approval_id,"Level 4 Request sent to "+LineManager);              
                            mailEmitter.emit('SendMail_approvals_sent',request_by,company,'request_sent',amount);
                            mailEmitter.emit('SendMail_approvals_arrived',assigned_to_designation,company,'request_received',amount,requester_name);

                        }
                
                    });
                }
        }); 
    }else if(level == 3){
        var parents = [] ;
        parents[0] = user_designation;
        console.log(parents[0]);
        function AsyncLoop(i,cb){
            if(i<asyncLoopvalue){
                Designation.findOne({_id:parents[i]}).exec(function(err,designation){
                    if(designation.parent_designation_id == undefined){
                        assigned_to_designation = undefined;
                        cb();
                    }else{
                        parents[i+1] = designation.parent_designation_id;
                        AsyncLoop(i+1,cb);
                    }

                });
            }else{
                assigned_to_designation = parents[i];
                cb();
            }
        }AsyncLoop(0,function(){
            console.log("loop ended");
            // console.log(assigned_to_designation);
            if(assigned_to_designation == undefined){
                eventEmitter.emit('Approved',approval_id,"level4",subuser);
            }else{
                    Approvals.findOneAndUpdate({_id:approval_id},{assigned_to_designation:assigned_to_designation,last_updated:Date.now(),atLevel:4,level4approved:{by:subuser,designation:approved_by_designation,status:true}},{new:true}).exec(function(err,approval){
                        if(err){
                            console.log(err);
                        }else{
                            console.log("level 5 request sent");
                            timelineEmitter.emit('UpdateTimeline',approval_id,"Level 5 Request sent to "+LineManager);              
                            mailEmitter.emit('SendMail_approvals_sent',request_by,company,'request_sent',amount);
                            mailEmitter.emit('SendMail_approvals_arrived',assigned_to_designation,company,'request_received',amount,requester_name);

                        }
                
                    });
                }
        }); 
    }else{
            var parents = [] ;
            parents[0] = user_designation;
            console.log(parents[0]);
            function AsyncLoop(i,cb){
                if(i<asyncLoopvalue){
                    Designation.findOne({_id:parents[i]}).exec(function(err,designation){
                        if(designation.parent_designation_id == undefined){
                            assigned_to_designation = undefined;
                            cb();
                        }else{
                            parents[i+1] = designation.parent_designation_id;
                            AsyncLoop(i+1,cb);
                        }

                    });
                }else{
                    assigned_to_designation = parents[i];
                    cb();
                }
            }AsyncLoop(0,function(){
                console.log("loop ended");
                // console.log(assigned_to_designation);
                if(assigned_to_designation == undefined){
                    if(settings.level2.designation){
                        if(settings.level2.designation == "LM1" || settings.level2.designation == "LM2" || settings.level2.designation == "LM3" || settings.level2.designation == "LM4" || settings.level2.designation == "LM5"){
                            if(settings.level3.designation){
                                if(settings.level3.designation == "LM1" || settings.level3.designation == "LM2" || settings.level3.designation == "LM3" || settings.level3.designation == "LM4" || settings.level3.designation == "LM5" ){
                                    if(settings.level4.designation){
                                        if(settings.level4.designation == "LM1" || settings.level4.designation == "LM2" || settings.level4.designation == "LM3" || settings.level4.designation == "LM4" || settings.level4.designation == "LM5" ){
                                            if(settings.level5.designation){
                                                if(settings.level5.designation == "LM1" || settings.level5.designation == "LM2" || settings.level5.designation == "LM3" || settings.level5.designation == "LM4" || settings.level5.designation == "LM5" ){
                                                        eventEmitter.emit('Approved',approval_id,"Auto");       
                                                }else{
                                                    Approvals.findOneAndUpdate({_id:approval_id},{assigned_to_designation:settings.level5.designation,atLevel:4,last_updated:Date.now(),level1approved:{by:subuser,designation:approved_by_designation,status:true},level2approved:{by:subuser,designation:approved_by_designation,status:true},level3approved:{by:subuser,designation:approved_by_designation,status:true},level4approved:{by:subuser,designation:approved_by_designation,status:true}},{new:true}).exec(function(err,approval){
                                                        if(err){
                                                            console.log(err);
                                                        }else{
                                                            console.log("level 1 and level 2 level 3 and level 4 request skipped");
                                                            timelineEmitter.emit('UpdateTimeline',approval_id,"Level 5 Request sent");              
                                                            // mailEmitter.emit('SendMail_approvals_sent',request_by,company,'request_sent',amount);
                                                            // mailEmitter.emit('SendMail_approvals_arrived',assigned_to_designation,company,'request_received',amount,requester_name);
                                                        }
                                                    });   

                                                }
                                            }else{
                                                eventEmitter.emit('Approved',approval_id,"Auto");       
                                            }
                                        }else{
                                            Approvals.findOneAndUpdate({_id:approval_id},{assigned_to_designation:settings.level4.designation,atLevel:3,last_updated:Date.now(),level1approved:{by:subuser,designation:approved_by_designation,status:true},level2approved:{by:subuser,designation:approved_by_designation,status:true},level3approved:{by:subuser,designation:approved_by_designation,status:true}},{new:true}).exec(function(err,approval){
                                                if(err){
                                                    console.log(err);
                                                }else{
                                                    console.log("level 1 and level 2 and level 3 request skipped");
                                                    timelineEmitter.emit('UpdateTimeline',approval_id,"Level 4 Request sent");              
                                                    // mailEmitter.emit('SendMail_approvals_sent',request_by,company,'request_sent',amount);
                                                    // mailEmitter.emit('SendMail_approvals_arrived',assigned_to_designation,company,'request_received',amount,requester_name);
                                                }
                                            });   
                                        }

                                    }else{
                                            eventEmitter.emit('Approved',approval_id,"Auto");
                                    }

                                }else{
                                    Approvals.findOneAndUpdate({_id:approval_id},{assigned_to_designation:settings.level3.designation,atLevel:2,last_updated:Date.now(),level1approved:{by:subuser,designation:approved_by_designation,status:true},level2approved:{by:subuser,designation:approved_by_designation,status:true}},{new:true}).exec(function(err,approval){
                                        if(err){
                                            console.log(err);
                                        }else{
                                            console.log("level 1 and level 2 request skipped");
                                            timelineEmitter.emit('UpdateTimeline',approval_id,"Level 3 Request sent");              
                                            // mailEmitter.emit('SendMail_approvals_sent',request_by,company,'request_sent',amount);
                                            // mailEmitter.emit('SendMail_approvals_arrived',assigned_to_designation,company,'request_received',amount,requester_name);
                                        }
                                
                                    });        

                                }
                            }else{
                                eventEmitter.emit('Approved',approval_id,"Auto");
                            }
                        }else{
                            Approvals.findOneAndUpdate({_id:approval_id},{assigned_to_designation:settings.level2.designation,atLevel:1,last_updated:Date.now(),level1approved:{by:subuser,designation:approved_by_designation,status:true}},{new:true}).exec(function(err,approval){
                                if(err){
                                    console.log(err);
                                }else{
                                    console.log("level 1 request skipped");
                                    timelineEmitter.emit('UpdateTimeline',approval_id,"Level 2 Request sent");              
                                    // mailEmitter.emit('SendMail_approvals_sent',request_by,company,'request_sent',amount);
                                    // mailEmitter.emit('SendMail_approvals_arrived',assigned_to_designation,company,'request_received',amount,requester_name);
                                }
                        
                            });

                        }

                    }else{
                        eventEmitter.emit('Approved',approval_id,"Auto");
                    }
                }else{
                        Approvals.findOneAndUpdate({_id:approval_id},{assigned_to_designation:assigned_to_designation,last_updated:Date.now()},{new:true}).exec(function(err,approval){
                            if(err){
                                console.log(err);
                            }else{
                                console.log("level 1 request sent");
                                timelineEmitter.emit('UpdateTimeline',approval_id,"Level 1 Request sent to "+LineManager);              
                                mailEmitter.emit('SendMail_approvals_sent',request_by,company,'request_sent',amount);
                                mailEmitter.emit('SendMail_approvals_arrived',assigned_to_designation,company,'request_received',amount,requester_name);


                            }
                    
                        });
                    }
            });     
    }
    // Staff.findOne({_id:staff_id}).exec(function(err,staff){
    //     if(err){
    //         res.send(err);
    //     }else{
    //         // res.json(staff);
    //         // console.log(staff);
    //         Designation.findOne({_id:staff.designation}).exec(function(err,designation){
    //             if(err){
    //                 res.send(err);
    //             }else{
    //                 if(designation.parent_designation_id == undefined){
    //                     eventEmitter.emit('Approved',approval_id,"Auto");
    //                 }else{
    //                     Approvals.findOneAndUpdate({_id:approval_id},{assigned_to_designation:designation.parent_designation_id},{new:true}).exec(function(err,approval){
    //                         if(err){
    //                             console.log(err);
    //                         }else{
    //                             console.log("LM 1 request sent");
    //                             // Staff.findOne({designation:designation.parent_designation_id}).exec(function(err,staff2){
    //                             //     User.findOne({user_type:staff2._id}).exec(function(err,user){
                                        
                                        // mailEmitter.emit('SendMail_approvals_arrived',user._id,user.company,'request_received',amount,requester_name);
                                        // mailEmitter.emit('SendMail_approvals_sent',subuser,user.company,'request_sent',amount);

    //                             //         console.log("LM 1 mails sent");

    //                             //     });

    //                             // });
    //                         }
                    
    //                     });
                        
    //                 }
    //             }

    //         });

    //     }


    // });

};





eventEmitter.on('Approved',ApprovalAccept);
eventEmitter.on('AutoReject',ApprovalAutoReject);
eventEmitter.on('SendApproval',SendApproval);
eventEmitter.on('LineManager',LineManagerApproval);
eventEmitter.on('skipApproval',SkipAnApproval);
eventEmitter.on('Activate',ActivateApproval);
eventEmitter.on('AcceptApproval',AcceptApproval);


module.exports = eventEmitter;
