'use strict';
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Staff = mongoose.model('Staff');
var Designation = mongoose.model('Designation');
var LineManager = require('../../SupportModules/LineManager');
var _ = require('lodash');



// Find all line managers

exports.find_all_line_managers = function(req,res,next){
    User.findOne({_id:req.params.userId}).exec(function(err,user){
        Staff.findOne({_id:user.user_type}).exec(function(err,staff){
            if(staff){
                var user_designation = staff.designation;
                var line_managers = [];
                var users = [];
                function AsyncLoop(i,cb){
                    if(user_designation){
                        Designation.findOne({_id:user_designation}).exec(function(err,designation){
                            if(designation){
                                if(designation.parent_designation_id == undefined){
                                    user_designation = undefined;
                                    cb();
                                }else{
                                    user_designation = designation.parent_designation_id;
                                    line_managers[i] = user_designation;
                                    AsyncLoop(i+1,cb);
                                }

                            }else{
                                console.log("designation not found");
                                cb();

                            }

                        });

                    }else{
                        cb();
                    }


                }AsyncLoop(0,function(){
                    console.log("loop ends");
                    function AsyncLoop2(j,ncb){
                        if(j<line_managers.length){
                            Staff.find({designation:line_managers[j],user:{$exists:true,$ne:null}}).populate('user designation department').exec(function(err,staffs){
                                if(err){
                                    res.send(err);
                                }else{
                                    users[j] = _.reject(staffs,['user', null]);
                                    AsyncLoop2(j+1,ncb);
                                }
                            });
                        }else{
                            ncb();
                        }

                    }AsyncLoop2(0,function(){
                        console.log("final loop ended");
                        res.json(users);

                    });
                });


            }else{
                console.log("Not Staff");
            }

        });

    });

};

// ************************************************************************


exports.find_approval_tree = function(req,res,next){
    var designations = [];
    User.findOne({_id:req.params.userId}).exec(function(err,user){
        if(user){
            Staff.findOne({_id:user.user_type}).exec(function(err,staff){
                if(staff){
                    res.locals.user_designation = staff.designation;
                    next();
            }
        });
    }   
  });
};