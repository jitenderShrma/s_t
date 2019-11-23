'use strict';

var mongoose = require('mongoose');
var PreApprovals = mongoose.model('Approvals');
// var Timeline = mongoose.model('Timeline');
var Heads = mongoose.model('Heads');
var User = mongoose.model('User');
var eventEmitter = require('../../Events/Approval Events/Approval_Events');
var mailEmitter = require('../../Events/sendMail Events/sendMail_Events');
var timelineEmitter = require('../../Events/Approval Events/TimeLine_Events');


//Create a Approval
exports.create_a_approval = function(req,res,next){
    var user_type;
    if(req.session.user){
        user_type = "Super_User";
    }else{
        user_type = "User";
    }
    Heads.findOne({company:req.session.company,_id:req.body.budget_head}).exec(function(err,head){
        if(err){
            res.send(err);
        }
        if(head == null){
            res.json({message:"Head not Found"});
        }
        else{
           if(head.amount_left[req.body.month]>=req.body.amount){
                var d = new Date();
                var year = d.getFullYear().toString().slice(2,4);
                PreApprovals.create({
                company:req.session.company,
                request_by:req.session.user || req.session.subuser,
                user_type:user_type || "User",
                requester_designation: req.session.user_designation || undefined,
                requester_name:req.session.user_name || "N/A",
                department:req.body.department,
                approval_type:req.body.approval_type,
                recurring_rate:req.body.recurring_rate,
                recurring_period:req.body.recurring_period,
                budget_head:req.body.budget_head,
                month:req.body.month,
                year: req.body.year || year,
                amount:req.body.amount,
                description:req.body.description,
                imprest_required:req.body.imprest_required,
                request_for_quote:req.body.request_for_quote,
                labels:req.body.labels
            },function(err,approval){
                if(err){
                    res.send(err);
                }else{
                    var str = approval.unique_id.toString();
                    var pad = "0000";
                    var ans = pad.substring(0, pad.length - str.length) + str;  
                    var month = (parseInt(approval.month,10)+1).toString();
                    var pad2 = "00";
                    var mon_ans = pad2.substring(0,pad2.length - month.length)+month;
                    var uniqueid = mon_ans+approval.year.toString()+ans;  
                    (function(my_id,uniqueid){
                        function asyncLoop(j,cb){
                            if(j == 1){
                                PreApprovals.findOneAndUpdate({_id:my_id},{ref_id:uniqueid},{new:true,runValidators: true, context: 'query'},function(err,resp){
                                    if(err){
                                        res.send(err);
                                    }else{
                                        res.json(resp);
                                        timelineEmitter.emit('Initiate',resp.company,resp._id);
                                        asyncLoop(j+1,cb);
                                    }
                                });

                            }else{
                                cb();
                            }
                        }asyncLoop(1,function(){
                            if(req.session.user){
                                console.log("super user approval");
                                eventEmitter.emit('Approved',approval._id,"Auto");
                            }else{
                                res.locals.user_designation = req.session.user_designation;
                                res.locals.approval_id = approval._id;
                                next();
                            }
                            // console.log(res.locals.bud_settings.level1.designation);
                            

                        });
                    })(approval._id,uniqueid);
                }
            });
           }else{
               res.json({message:" Budget limit exceeded"});
           }
        }

    });

};

//manage an approval
exports.manage_an_approval = function(req,res,next){
    var approval_matrix = res.locals.linemangers;
    var approval_id = res.locals.approval_id;
    var settings = res.locals.bud_settings;
    var user = req.session.subuser || req.session.user;
    var acceptor_designation = req.session.user_designation;
    var remarks = req.body.remarks;
    var partially_approved_amount = req.body.partially_approved_amount;
    PreApprovals.findOneAndUpdate({_id:approval_id},{approval_matrix:{level1:approval_matrix[0],level2:approval_matrix[1],level3:approval_matrix[2],level4:approval_matrix[3],level5:approval_matrix[4]}},{new:true}).exec(function(err,approval){
        if(settings.level1.designation == undefined && settings.level1.designation_label == undefined){
            eventEmitter.emit('Approved',approval._id,"Auto");
        }else{
             if(approval.amount < settings.level1.amount && settings.level1.amount>0){
                    eventEmitter.emit('Approved',approval._id,"Auto");         
             }else{
                if(approval.approval_matrix.level1){
                    eventEmitter.emit('Activate',approval._id,"level1",user,acceptor_designation,remarks,partially_approved_amount,settings);
                }else{
                    console.log("skip level 1");
                    eventEmitter.emit('AcceptApproval',approval._id,"level1",user,acceptor_designation,remarks,partially_approved_amount,settings);
                }
                if(settings.auto_cancel_time >0){
                    setTimeout(function(){eventEmitter.emit('AutoReject',approval._id,approval.request_by,approval.company,approval.amount);},res.locals.bud_settings.auto_cancel_time*60000);
                }
             }

        }

    });

};

// find all approvals

exports.find_all_approvals = function(req,res,next){
    if(req.session.user){
        PreApprovals.find({company:req.session.company}).populate({path:'request_by level1approved.by level2approved.by level3approved.by level4approved.by level5approved.by budget_head department labels',populate:{path:'user_type',populate:{path:'designation department'}}}).exec(function(err,approvals){
            if(err){
                res.send(err);
            }else{
                res.json(approvals);  
            }   
        });
    }else if(req.session.subuser){
        if(res.locals.add_read_all_permission == true){
            PreApprovals.find({company:req.session.company}).populate({path:'request_by level1approved.by level2approved.by level3approved.by level4approved.by level5approved.by budget_head department labels',populate:{path:'user_type',populate:{path:'designation department'}}}).exec(function(err,approvals){
                if(err){
                    res.send(err);
                }else{
                    res.json(approvals);  
                }   
            });
        }
        else{
            PreApprovals.find({company:req.session.company,$or:[{'request_by':req.session.subuser},{'assigned_to_designation':req.session.user_designation},{'level1approved.by':req.session.subuser},{'level2approved.by':req.session.subuser},{'level3approved.by':req.session.subuser},{'level4approved.by':req.session.subuser},{'level5approved.by':req.session.subuser},{'rejected_by':req.session.subuser}]}).populate({path:'request_by budget_head level1approved.by level2approved.by level3approved.by level4approved.by level5approved.by department labels',populate:{path:'user_type',populate:{path:'designation department'}}}).exec(function(err,approvals){
                if(err){
                    res.send(err);
                }else{
                    res.json(approvals);
                }
            });
        }
    }
   
};

// find a approval

exports.find_an_approval = function(req,res,next){
    PreApprovals.findOne({company:req.session.company,ref_id:req.params.uniqueId}).populate('labels').exec(function(err,approval){
        if(err)
            res.send(err);
        res.json(approval);    
    });
};

// *********RESET**********
exports.reset_a_counter = function(req,res,next){
    PreApprovals.counterReset('unique_seq',function(err){
        if(err)
            res.send(err);
         res.json({ok:true});  
    });
};


exports.accept_an_approval = function(req,res,next){
    var settings = res.locals.bud_settings;
    PreApprovals.findOne({company:req.session.company,ref_id:req.params.uniqueId}).exec(function(err,approval){
        if(err){
            console.log(approval);
        }else{
            if(approval.atLevel == 0){
                var user = req.session.user || req.session.subuser;
                var acceptor_designation = req.session.user_designation;
                var remarks = req.body.remarks;
                var partially_approved_amount = req.body.partially_approved_amount;
                eventEmitter.emit('AcceptApproval',approval._id,"level1",user,acceptor_designation,remarks,partially_approved_amount,settings);
                res.json({message:"approval Accepted"});                
            }else if(approval.atLevel == 1){
                var user = req.session.user || req.session.subuser;
                var acceptor_designation = req.session.user_designation;
                var remarks = req.body.remarks;
                var partially_approved_amount = req.body.partially_approved_amount;
                eventEmitter.emit('AcceptApproval',approval._id,"level2",user,acceptor_designation,remarks,partially_approved_amount,settings);
                res.json({message:"approval Accepted"}); 
            }else if(approval.atLevel == 2){
                var user = req.session.user || req.session.subuser;
                var acceptor_designation = req.session.user_designation;
                var remarks = req.body.remarks;
                var partially_approved_amount = req.body.partially_approved_amount;
                eventEmitter.emit('AcceptApproval',approval._id,"level3",user,acceptor_designation,remarks,partially_approved_amount,settings);
                res.json({message:"approval Accepted"}); 
            }else if(approval.atLevel == 3){
                var user = req.session.user || req.session.subuser;
                var acceptor_designation = req.session.user_designation;
                var remarks = req.body.remarks;
                var partially_approved_amount = req.body.partially_approved_amount;
                eventEmitter.emit('AcceptApproval',approval._id,"level4",user,acceptor_designation,remarks,partially_approved_amount,settings);
                res.json({message:"approval Accepted"}); 
            }else if(approval.atLevel == 4){
                var user = req.session.user || req.session.subuser;
                var acceptor_designation = req.session.user_designation;
                var remarks = req.body.remarks;
                var partially_approved_amount = req.body.partially_approved_amount;
                eventEmitter.emit('AcceptApproval',approval._id,"level5",user,acceptor_designation,remarks,partially_approved_amount,settings);
                res.json({message:"approval Accepted"}); 

            }
        }

    });
};


exports.level1_approval = function(req,res,next){
    PreApprovals.findOne({company:req.session.company,ref_id:req.params.uniqueId}).exec(function(err,approval){
        if(err){
            res.send(err);
        }
        else{
            if(approval.atLevel == 0){
                var user = req.session.user || req.session.subuser ;
                if(res.locals.bud_settings.level2.amount < approval.amount && res.locals.bud_settings.level2.amount >= res.locals.bud_settings.level1.amount){
                    if(res.locals.bud_settings.level2.designation){
                        if(res.locals.bud_settings.level2.designation == "LM1" || res.locals.bud_settings.level2.designation == "LM2" || res.locals.bud_settings.level2.designation == "LM3" || res.locals.bud_settings.level2.designation == "LM4" || res.locals.bud_settings.level2.designation == "LM5" ){
                            var linemanager = res.locals.bud_settings.level2.designation;

                            eventEmitter.emit('LineManager',approval._id,approval.request_by,approval.amount,req.session.subuser,approval.company,approval.requester_designation,linemanager,approval.requester_name,0,req.session.user_designation,req.body.remarks,req.body.partially_approved_amount,res.locals.bud_settings);
                            timelineEmitter.emit('UpdateTimeline',approval._id,"Approved at Level 1");                                            

                        }else{
                            if(res.locals.bud_settings.level2.designation == approval.level1approved.designation){
                                if(res.locals.bud_settings.level3.designation){
                                        if(res.locals.bud_settings.level3.designation == "LM1" || res.locals.bud_settings.level3.designation == "LM2" || res.locals.bud_settings.level3.designation == "LM3" || res.locals.bud_settings.level3.designation == "LM4" || res.locals.bud_settings.level3.designation == "LM5" ){
                                            var linemanager = res.locals.bud_settings.level3.designation;
                                            eventEmitter.emit('LineManager',approval._id,approval.request_by,approval.amount,req.session.subuser,approval.company,approval.requester_designation,linemanager,approval.requester_name,1,req.session.user_designation,req.body.remarks,req.body.partially_approved_amount,res.locals.bud_settings);
                                            timelineEmitter.emit('UpdateTimeline',approval._id,"Auto Approved at Level 2");                                                            
                                        }else{
                                            eventEmitter.emit('SendApproval',approval._id,res.locals.bud_settings.level3.designation,res.locals.bud_settings.level3.alert_time,user,1,req.session.user_designation,req.body.remarks,req.body.partially_approved_amount);  
                                            timelineEmitter.emit('UpdateTimeline',approval._id,"Auto Approved at Level 2");   

                                        }
                                }else{
                                    eventEmitter.emit('Approved',approval._id,"level1",user,req.session.user_designation,req.body.remarks,req.body.partially_approved_amount);
                                }
                            }else{
                                eventEmitter.emit('SendApproval',approval._id,res.locals.bud_settings.level2.designation,res.locals.bud_settings.level2.alert_time,user,0,req.session.user_designation,req.body.remarks,req.body.partially_approved_amount);  
                                timelineEmitter.emit('UpdateTimeline',approval._id,"Approved at Level 1");                                               
                            }
                            
                        }
                    }
                    else{
                    eventEmitter.emit('SendApproval',approval._id,res.locals.bud_settings.level2.designation_label,res.locals.bud_settings.level2.alert_time,user,0,req.session.user_designation,req.body.remarks,req.body.partially_approved_amount);
                    }


                }else{
                    eventEmitter.emit('Approved',approval._id,"level1",user,req.session.user_designation,req.body.remarks,req.body.partially_approved_amount);
                }
                res.json({message:"approved"});

            }else if(approval.atLevel == 1){
                var user1 = req.session.user || req.session.subuser ;
                if(res.locals.bud_settings.level3.amount < approval.amount && res.locals.bud_settings.level3.amount >= res.locals.bud_settings.level2.amount){
                    if(res.locals.bud_settings.level3.designation){
                        if(res.locals.bud_settings.level3.designation == "LM1" || res.locals.bud_settings.level3.designation == "LM2" || res.locals.bud_settings.level3.designation == "LM3" || res.locals.bud_settings.level3.designation == "LM4" || res.locals.bud_settings.level3.designation == "LM5" ){
                            var linemanager = res.locals.bud_settings.level3.designation;
                            eventEmitter.emit('LineManager',approval._id,approval.request_by,approval.amount,req.session.subuser,approval.company,approval.requester_designation,linemanager,approval.requester_name,1,req.session.user_designation,req.body.remarks,req.body.partially_approved_amount,res.locals.bud_settings);
                            timelineEmitter.emit('UpdateTimeline',approval._id,"Approved at Level 2");                                            
                        }else{
                            if(res.locals.bud_settings.level3.designation == approval.level1approved.designation || res.locals.bud_settings.level3.designation == approval.level2approved.designation){
                                if(res.locals.bud_settings.level4.designation){
                                    if(res.locals.bud_settings.level4.designation == "LM1" || res.locals.bud_settings.level4.designation == "LM2" || res.locals.bud_settings.level4.designation == "LM3" || res.locals.bud_settings.level4.designation == "LM4" || res.locals.bud_settings.level4.designation == "LM5" ){
                                        var linemanager = res.locals.bud_settings.level4.designation;
                                        eventEmitter.emit('LineManager',approval._id,approval.request_by,approval.amount,req.session.subuser,approval.company,approval.requester_designation,linemanager,approval.requester_name,2,req.session.user_designation,req.body.remarks,req.body.partially_approved_amount,res.locals.bud_settings);
                                        timelineEmitter.emit('UpdateTimeline',approval._id,"Auto Approved at Level 3");      
                                    
                                    }else{
                                        eventEmitter.emit('SendApproval',approval._id,res.locals.bud_settings.level4.designation,res.locals.bud_settings.level3.alert_time,user1,2,req.session.user_designation,req.body.remarks,req.body.partially_approved_amount);   
                                        timelineEmitter.emit('UpdateTimeline',approval._id," Auto Approved at Level 3"); 

                                    }
                                }else{
                                    eventEmitter.emit('Approved',approval._id,"level2",user1,req.session.user_designation,req.body.remarks,req.body.partially_approved_amount);
                                }

                            }else{
                                eventEmitter.emit('SendApproval',approval._id,res.locals.bud_settings.level3.designation,res.locals.bud_settings.level3.alert_time,user1,1,req.session.user_designation,req.body.remarks,req.body.partially_approved_amount);   
                                timelineEmitter.emit('UpdateTimeline',approval._id,"Approved at Level 2"); 
                            }
                        }
                    }
                        else{
                        eventEmitter.emit('SendApproval',approval._id,res.locals.bud_settings.level3.designation_label,res.locals.bud_settings.level3.alert_time,user1,1,req.session.user_designation,req.body.remarks,req.body.partially_approved_amount);
                        }
                }else{
                eventEmitter.emit('Approved',approval._id,"level2",user1,req.session.user_designation,req.body.remarks,req.body.partially_approved_amount);
                }
                res.json({message:"approved"});

            }else if(approval.atLevel == 2){
                var user2 = req.session.user || req.session.subuser ;
                if(res.locals.bud_settings.level4.amount < approval.amount && res.locals.bud_settings.level4.amount >= res.locals.bud_settings.level3.amount){
                    if(res.locals.bud_settings.level4.designation){
                        if(res.locals.bud_settings.level4.designation == "LM1" || res.locals.bud_settings.level4.designation == "LM2" || res.locals.bud_settings.level4.designation == "LM3" || res.locals.bud_settings.level4.designation == "LM4" || res.locals.bud_settings.level4.designation == "LM5" ){
                            var linemanager = res.locals.bud_settings.level4.designation;                            
                            eventEmitter.emit('LineManager',approval._id,approval.request_by,approval.amount,req.session.subuser,approval.company,approval.requester_designation,linemanager,approval.requester_name,2,req.session.user_designation,req.body.remarks,req.body.partially_approved_amount,res.locals.bud_settings);
                            timelineEmitter.emit('UpdateTimeline',approval._id,"Approved at Level 3");                                            

                        }else{
                            if(res.locals.bud_settings.level4.designation == approval.level1approved.designation || res.locals.bud_settings.level4.designation == approval.level2approved.designation || res.locals.bud_settings.level4.designation == approval.level3approved.designation){
                                if(res.locals.bud_settings.level5.designation){
                                    if(res.locals.bud_settings.level5.designation == "LM1" || res.locals.bud_settings.level5.designation == "LM2" || res.locals.bud_settings.level5.designation == "LM3" || res.locals.bud_settings.level5.designation == "LM4" || res.locals.bud_settings.level5.designation == "LM5" ){
                                        var linemanager = res.locals.bud_settings.level5.designation;                            
                                        eventEmitter.emit('LineManager',approval._id,approval.request_by,approval.amount,req.session.subuser,approval.company,approval.requester_designation,linemanager,approval.requester_name,3,req.session.user_designation,req.body.remarks,req.body.partially_approved_amount,res.locals.bud_settings);
                                        timelineEmitter.emit('UpdateTimeline',approval._id,"Approved at Level 3");                                            
                                    }else{
                                        eventEmitter.emit('SendApproval',approval._id,res.locals.bud_settings.level5.designation,res.locals.bud_settings.level5.alert_time,user2,3,req.session.user_designation,req.body.remarks,req.body.partially_approved_amount);   
                                        timelineEmitter.emit('UpdateTimeline',approval._id,"Auto Approved at Level 3");                                                                            
                                    }
                                }else{
                                    eventEmitter.emit('Approved',approval._id,"level4",user2,req.session.user_designation,req.body.remarks,req.body.partially_approved_amount);
                                }       

                            }else{  
                                eventEmitter.emit('SendApproval',approval._id,res.locals.bud_settings.level4.designation,res.locals.bud_settings.level4.alert_time,user2,2,req.session.user_designation,req.body.remarks,req.body.partially_approved_amount);   
                                timelineEmitter.emit('UpdateTimeline',approval._id,"Approved at Level 3");                                            
                            }
                       }
                    }
                        else{
                        eventEmitter.emit('SendApproval',approval._id,res.locals.bud_settings.level4.designation_label,res.locals.bud_settings.level4.alert_time,user2,2,req.session.user_designation,req.body.remarks,req.body.partially_approved_amount);
                        }
                }else{
                eventEmitter.emit('Approved',approval._id,"level3",user2,req.session.user_designation,req.body.remarks,req.body.partially_approved_amount);
                }
                res.json({message:"approved"});

            }else if(approval.atLevel == 3){
                var user3 = req.session.user || req.session.subuser ;
                if(res.locals.bud_settings.level5.amount < approval.amount && res.locals.bud_settings.level5.amount >= res.locals.bud_settings.level4.amount){
                    if(res.locals.bud_settings.level5.designation){
                        if(res.locals.bud_settings.level5.designation == "LM1" || res.locals.bud_settings.level5.designation == "LM2" || res.locals.bud_settings.level5.designation == "LM3" || res.locals.bud_settings.level5.designation == "LM4" || res.locals.bud_settings.level5.designation == "LM5" ){
                            var linemanager = res.locals.bud_settings.level5.designation;
                            eventEmitter.emit('LineManager',approval._id,approval.request_by,approval.amount,req.session.subuser,approval.company,approval.requester_designation,linemanager,approval.requester_name,3,req.session.user_designation,req.body.remarks,req.body.partially_approved_amount,res.locals.bud_settings);
                            timelineEmitter.emit('UpdateTimeline',approval._id,"Approved at Level 4");                                            

                        }else{
                            if(res.locals.bud_settings.level5.designation == approval.level1approved.designation || res.locals.bud_settings.level5.designation == approval.level2approved.designation || res.locals.bud_settings.level5.designation == approval.level3approved.designation || res.locals.bud_settings.level5.designation == approval.level4approved.designation){
                                    eventEmitter.emit('Approved',approval._id,"level4",user3,req.session.user_designation,req.body.remarks,req.body.partially_approved_amount);
                            }else{
                                eventEmitter.emit('SendApproval',approval._id,res.locals.bud_settings.level5.designation,res.locals.bud_settings.level5.alert_time,user3,3,req.session.user_designation,req.body.remarks,req.body.partially_approved_amount);
                                timelineEmitter.emit('UpdateTimeline',approval._id,"Approved at Level 4");   
                            }
                        }
                    }
                        else{
                        eventEmitter.emit('SendApproval',approval._id,res.locals.bud_settings.level5.designation_label,res.locals.bud_settings.level5.alert_time,user3,3,req.session.user_designation,req.body.remarks,req.body.partially_approved_amount);
                        }
                }else{
                eventEmitter.emit('Approved',approval._id,"level4",user3,req.session.user_designation,req.body.remarks,req.body.partially_approved_amount);
                }
                res.json({message:"approved"});

            }else if(approval.atLevel == 4){
                var user4 = req.session.user || req.session.subuser ;
                eventEmitter.emit('Approved',approval._id,"level5",user4,req.session.user_designation,req.body.remarks,req.body.partially_approved_amount);
                res.json({message:"approved"});
            }
        }

    });
};


exports.level1_rejection = function(req,res,next){
    var user = req.session.subuser;
    var remarks = req.body.remarks || " ";
    PreApprovals.findOneAndUpdate({company:req.session.company,ref_id:req.params.uniqueId},{status:"DECLINED",assigned_to_designation:null,rejected_by:req.session.subuser || req.session.user,remarks:{by:req.session.subuser || req.session.user,query:req.body.remarks}},{new:true}).exec(function(err,approval){
        if(err){
            res.send(err);
        }else{
            User.findOne({_id:user}).exec(function(err,user){
                if(user){
                    timelineEmitter.emit('UpdateTimeline',approval._id,"Approval Rejected by "+`${user.personal_details.name}`+" Remarks: "+`${remarks}`);              
                }
            });
            res.json({message:"Approval Rejected"});
        }
        


    });
}


exports.view_all_requests = function(req,res,next){
    PreApprovals.find({company:req.session.company,assigned_to_designation:req.session.user_designation,status:"PENDING"},function(err,approvals){
        if(err)
            res.send(err);
        res.json(approvals);    

    });

};

//ADD A LABEL

exports.add_a_label = function(req,res,next)  {
    PreApprovals.findOneAndUpdate({company:req.session.company,_id:req.params.uniqueId},{$push: {labels:req.body.labels}},{new:true},function(err,usergroup) {
        if(err) res.send(err);
        res.json(usergroup);
    });
};

// REMOVE A LABEL

exports.remove_a_label = function(req,res,next) {
    PreApprovals.findOneAndUpdate({company:req.session.company,_id:req.params.uniqueId},{$pull: {labels:req.body.labels}},{new:true},function(err,usergroup) {
        if(err) res.send(err);
        res.json(usergroup);
    })
};


//Cancel an Approval

exports.cancel_a_approval = function(req,res,next){
    PreApprovals.findOne({company:req.session.company,ref_id:req.params.uniqueId}).exec(function(err,approval){
        if(approval == null){
            res.json({message:"Approval Not Found"});
        }else{
            if(approval.request_by == req.session.subuser && approval.status == "PENDING" && approval.approval_type == "One Time"){
                PreApprovals.findOneAndUpdate({_id:approval._id},{status:"CANCELLED",assigned_to_designation:null},{new:true}).exec(function(err,approval2){
                    if(err){
                        res.send(err);
                    }else{
                        res.json({message:"Approval Cancelled"});
                    }
                });
            }else if(approval.request_by == req.session.subuser && approval.approval_type == "Recurring"){
                PreApprovals.findOneAndUpdate({_id:approval._id},{status:"CANCELLED",assigned_to_designation:null},{new:true}).exec(function(err,approval2){
                    if(err){
                        res.send(err);
                    }else{
                        res.json({message:"Approval Cancelled"});
                    }
                });
            }
        }
       

    });
}


// Send Pending Count 


exports.send_pending_approval_count = function(req,res,next){
    if(req.session.user){
        PreApprovals.countDocuments({company:req.session.company,status:"PENDING"}).exec(function(err,count){
            if(err){
                res.send(err);
            }else{
                res.json(count);  
            }   
        });
    }else if(req.session.subuser){
        if(res.locals.add_read_all_permission == true){
            PreApprovals.countDocuments({company:req.session.company,status:"PENDING"}).exec(function(err,count){
                if(err){
                    res.send(err);
                }else{
                    res.json(count);  
                }   
            });
        }
        else{
            PreApprovals.countDocuments({company:req.session.company,$or:[{'assigned_to_designation':req.session.user_designation},{'request_by':req.session.subuser}],status:"PENDING"}).exec(function(err,count){
                if(err){
                    res.send(err);
                }else{
                    res.json(count);
                }
            });
        }
    }
   
};


//Release an approval


exports.release_an_approval = function(req,res,next){

    console.log("release request");
    var released_amount = [];
    var approval_amount_left = [0,0,0,0,0,0,0,0,0,0,0,0];
    PreApprovals.findOne({ref_id:req.params.uniqueId}).exec(function(err,approval){
        if(err){
            res.send(err);
        }else{
            if(approval.status == "APPROVED" && req.session.subuser == approval.request_by){
                Heads.findOne({_id:approval.budget_head}).exec(function(err,head){
                    if(head){
                        for(var i=0;i<12;i++){
                            released_amount[i] = head.amount_left[i] + approval.approval_amount_left[i];
                        
                        }
                        var amount = approval.approval_amount_left[approval.month];
                        // console.log(released_amount);
                        Heads.findOneAndUpdate({_id:approval.budget_head},{$set:{amount_left:released_amount}}).exec(function(err,updatedhead){
                            if(updatedhead){
                                PreApprovals.findOneAndUpdate({ref_id:req.params.uniqueId},{status:"CLOSED",last_updated:Date.now(),$set:{approval_amount_left:approval_amount_left}}).exec(function(err,updatedapp){
                                    if(updatedapp){
                                        timelineEmitter.emit('UpdateTimeline',updatedapp._id,"Approval Closed by "+`${approval.requester_name}`+" Left Amount: "+`${amount}`);              
                                        res.json({message:"Approval Released"});
                                    }
                                });
                            }
                        });
                    }
                });
            }else{
                res.json({message:"This Request Cannot be Released"});  
                console.log("This Request Cannot be Released");  
                console.log(approval.status);
                console.log(approval.request_by);
                console.log(req.session.subuser);            
            }
        }
    });

}



exports.filter_approvals_user = function(req,res,next) {
    var regexp = new RegExp("")
    if(req.session.user){
        var query = {company:req.session.company}
        if( req.body.field !== "" ) {
            if(req.body.field == "request_by.user_name") {
                regexp = new RegExp(req.body.value)
                console.log(regexp)
            }
            else{
                query[req.body.field] = req.body.value;
            }
        }
        PreApprovals.find(query).populate({path:'request_by level1approved.by level2approved.by level3approved.by level4approved.by level5approved.by budget_head department labels',match:{user_name: {$regex: regexp}},populate:{path:'user_type',populate:{path:'designation department'}}}).exec(function(err,approvals){
            if(err){
                res.send(err);
            }else{
                approvals = approvals.filter(function (appr) {
                            return appr.request_by != null
                        })
                res.json(approvals);  
            }   
        });
    }else if(req.session.subuser){
        if(res.locals.add_read_all_permission == true){
            var query = {company:req.session.company}
            if( req.body.field !== "" ) {
                if(req.body.field == "request_by.user_name") {
                regexp = new RegExp(req.body.value)
                console.log(regexp)
            }
            else{
                query[req.body.field] = req.body.value;
            }
            }
            PreApprovals.find(query).populate({path:'request_by level1approved.by level2approved.by level3approved.by level4approved.by level5approved.by budget_head department labels',match:{user_name: {$regex: regexp}},populate:{path:'user_type',populate:{path:'designation department'}}}).exec(function(err,approvals){
                if(err){
                    res.send(err);
                }else{
                    approvals = approvals.filter(function (appr) {
                            return appr.request_by != null
                        })
                    res.json(approvals);  
                }   
            });
        }
        else{
            var query = {company:req.session.company,$or:[{'request_by':req.session.subuser},{'assigned_to_designation':req.session.user_designation},{'level1approved.by':req.session.subuser},{'level2approved.by':req.session.subuser},{'level3approved.by':req.session.subuser},{'level4approved.by':req.session.subuser},{'level5approved.by':req.session.subuser},{'rejected_by':req.session.subuser}]}
            if( req.body.field !== "" ) {
                if(req.body.field == "request_by.user_name") {
                regexp = new RegExp(req.body.value)
                console.log(regexp)
            }
            else{
                query[req.body.field] = req.body.value;
            }
            }
            PreApprovals.find(query).populate({path:'request_by budget_head level1approved.by level2approved.by level3approved.by level4approved.by level5approved.by department labels',match:{user_name: {$regex: regexp}},populate:{path:'user_type',populate:{path:'designation department'}}}).exec(function(err,approvals){
                if(err){
                    res.send(err);
                }else{
                    approvals = approvals.filter(function (appr) {
                            return appr.request_by != null
                        })
                    res.json(approvals);
                }
            });
        }
    }
};


// FILTER APPROVALS
exports.filter_approvals = function(req,res,next) {
    if(req.session.user){
        var query = {company:req.session.company}
        if( req.body.field !== "" ) {
                if( req.body.field == "created_date" ) {
                    query[`$and`] = [{created_date:{$gte:req.body.value.startDate}},{created_date:{$lte:req.body.value.endDate}}];
                }
                else{
                    query[req.body.field] = req.body.value;
                }
            }
        PreApprovals.find(query).populate({path:'request_by level1approved.by level2approved.by level3approved.by level4approved.by level5approved.by budget_head department labels',populate:{path:'user_type',populate:{path:'designation department'}}}).exec(function(err,approvals){
            if(err){
                res.send(err);
            }else{
                res.json(approvals);  
            }   
        });
    }else if(req.session.subuser){
        if(res.locals.add_read_all_permission == true){
            var query={company:req.session.company}
            if( req.body.field !== "" ) {
                if( req.body.field == "created_date" ) {
                    query[`$and`] = [{created_date:{$gte:req.body.value.startDate}},{created_date:{$lte:req.body.value.endDate}}];
                }
                else{
                    query[req.body.field] = req.body.value;
                }
            }
            PreApprovals.find(query).populate({path:'request_by level1approved.by level2approved.by level3approved.by level4approved.by level5approved.by budget_head department labels',populate:{path:'user_type',populate:{path:'designation department'}}}).exec(function(err,approvals){
                if(err){
                    res.send(err);
                }else{
                    res.json(approvals);  
                }   
            });
        }
        else{
            var query = {company:req.session.company,$or:[{'request_by':req.session.subuser},{'assigned_to_designation':req.session.user_designation},{'level1approved.by':req.session.subuser},{'level2approved.by':req.session.subuser},{'level3approved.by':req.session.subuser},{'level4approved.by':req.session.subuser},{'level5approved.by':req.session.subuser},{'rejected_by':req.session.subuser}]}
            if( req.body.field !== "" ) {
                if( req.body.field == "created_date" ) {
                    query[`$and`] = [{created_date:{$gte:req.body.value.startDate}},{created_date:{$lte:req.body.value.endDate}}];
                }
                else{
                    query[req.body.field] = req.body.value;
                }
            }
            PreApprovals.find(query).populate({path:'request_by budget_head level1approved.by level2approved.by level3approved.by level4approved.by level5approved.by department labels',populate:{path:'user_type',populate:{path:'designation department'}}}).exec(function(err,approvals){
                if(err){
                    res.send(err);
                }else{
                    res.json(approvals);
                }
            });
        }
    }
};


// HEADS FIX
exports.fix_all_mess = function(req,res,next){
    var flag = 0;
    PreApprovals.find({last_updated:{$gte : new Date(2019,9,3,1)},status:"APPROVED"}).exec(function(err,approvals){
        function AsyncLoop(i,cb){
            if(i<approvals.length){
                Heads.findOne({_id:approvals[i].budget_head}).exec(function(err,head){
                    if(head){
                        head.amount_left[approvals[i].month] = head.amount_left[approvals[i].month] - approvals[i].amount;
                        Heads.findOneAndUpdate({_id:head._id},{$set:{amount_left:head.amount_left}},{new:true}).exec(function(err,updated){
                            console.log("updated");
                            flag= flag +1;
                            AsyncLoop(i+1,cb);
                        });
                    }else{
                        AsyncLoop(i+1,cb);
                    }
                });

            }else{
                cb();
            }
        }AsyncLoop(0,function(){
            console.log("end game");
            console.log(`${flag} Heads Updated`);
            res.json({message:`${flag} Heads Fixed`});

        });
    });
};