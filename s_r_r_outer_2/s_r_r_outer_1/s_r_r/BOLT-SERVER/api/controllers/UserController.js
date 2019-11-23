'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('User');
var TypePermissions = mongoose.model('TypePermissions');
var path = require('path');
var OverRide = require('../filter/override');
var ObjectOverRide = require('../filter/ObjectOverride');
var fs = require('fs');
var bcrypt = require('bcryptjs');
var encrypt = require('../../license/encrypt');
var UserGroups = mongoose.model('UserGroup');
var Staff = mongoose.model('Staff');
//Mail Event Emitter

var mailEmitter = require('../Events/sendMail Events/sendMail_Events');
var smsEmitter = require('../Events/sendSMS Events/sendSMSEvents');



// CREATE A USER(SUPER USER)
exports.create_a_User = function(req, res,next) {

    if((req.session.user && req.session.company)|| req.session.subuser){
        var hashedPassword = bcrypt.hashSync(req.body.password, 8);
        var license = encrypt.decrypt();

        User.countDocuments({company:req.session.company,},function(err,count){
            if(err){
                res.send(err);
            }
            else{
                if(count < parseInt(license.users_allowed)){
                    User.create ({
                        company : req.session.company,
                        user_name : req.body.user_name.toLowerCase(),
                        password : hashedPassword,
                        personal_details:{
                            name:req.body.name,
                            profile_picture:req.body.profile_picture,
                            fathers_name:req.body.fathers_name,
                            mothers_name:req.body.mothers_name,
                            email:req.body.email,
                            mobile:req.body.address[0].phone,
                            address:req.body.address,
                            blood_group:req.body.blood_group,
                            identification:req.body.identification
                        },
                        user_type : req.body.user_type,
                        onType: req.body.onType,
                        user_group:req.body.user_group,
                        add_attributes : req.body.add_attributes,
                        labels : req.body.labels,
                        bank_account_details:{
                            account_holder_name:req.body.account_holder_name,
                            account_number:req.body.account_number,
                            bank_name:req.body.bank_name,
                            branch:req.body.branch,
                            ifsc_code:req.body.ifsc_code
                        },
                        pan_details:{
                            pan_number:req.body.pan_number,
                            pan_upload:req.body.pan_upload
                        },
                        user_permissions:req.body.user_permissions,
                        additional_permissions:req.body.additional_permissions,
                        approval_permissions:req.body.approval_permissions,
                        isProfessor:req.body.isProfessor,
                        substitution_details:req.body.substitution_details
                    },
                    function(err, user) {
                        if(err) return res.send(err);
                        res.locals.context = "User Created";
                        res.locals.user_name = user.user_name;
                        //mail request
                        smsEmitter.emit('UserCreatedSMS',res.locals.context,req.session.company,user._id);
                        mailEmitter.emit('UserCreatedEmail',res.locals.context,req.session.company,user._id);
                        res.json(user);
                    });
                }else{
                    res.json({limit:"exceeded"});
                }
            }

        });    
    }else{
        res.json({auth:false});
    }
   
};
//GET ALL USERS(SUPER USER)

exports.get_all_Users = function(req,res){

    if(req.session.user){
        User.find({company:req.session.company}).populate({path:'user_type user_group',populate:{path:'designation department',populate:{path:'labels'}}}).exec(function(err,users){
            if(err)
                res.send(err)
            res.json(users);    
        });    
    }else if(req.session.subuser){
        if(res.locals.add_read_all_permission == true){
            User.find({company:req.session.company}).populate({path:'user_type user_group',populate:{path:'designation department',populate:{path:'labels'}}}).exec(function(err,users){
                if(err)
                    res.send(err)
                res.json(users);    
            });  
        }else{
            User.find({company:req.session.company,_id:req.session.subuser}).populate({path:'user_type user_group',populate:{path:'designation department',populate:{path:'labels'}}}).exec(function(err,users){
                if(err)
                    res.send(err)
                res.json(users);    
            });  

        }
    }
    else{
        res.json({auth:false});
    }  
};


//GET ALL PROFESSORS

exports.get_all_professors = function(req,res){

    if(req.session.user){
        User.find({company:req.session.company,isProfessor:true}).populate({path:'user_type user_group',populate:{path:'designation department',populate:{path:'labels'}}}).exec(function(err,users){
            if(err)
                res.send(err)
            res.json(users);    
        });    
    }else if(req.session.subuser){
        if(res.locals.add_read_all_permission == true){
            User.find({company:req.session.company,isProfessor:true}).populate({path:'user_type user_group',populate:{path:'designation department',populate:{path:'labels'}}}).exec(function(err,users){
                if(err)
                    res.send(err)
                res.json(users);    
            });  
        }else{
            User.find({company:req.session.company,_id:req.session.subuser,isProfessor:true}).populate({path:'user_type user_group',populate:{path:'designation department',populate:{path:'labels'}}}).exec(function(err,users){
                if(err)
                    res.send(err)
                res.json(users);    
            });  

        }
    }
    else{
        res.json({auth:false});
    }  
};


// GET A USER(SUPER USER)

exports.get_a_User = function(req, res) {

    if(req.session.user || req.session.subuser){
        User.findOne({company:req.session.company,_id:req.params.userId}).populate('user_type').exec(function(err,user){
            if(err)
                res.send(err);
            // user.user_type.pan_copy = import (path.join(__dirname, `./vendor/${user.user_type.pan_copy}`))
            // console.log(user.user_type.pan_copy)
            res.json(user);
        });
    }else{
        res.json({auth:false});
    }
};


//UPDATE A USER(SUPER USER)

exports.update_a_User = function(req,res){
    if(req.session.user || req.session.subuser){
        if(req.session.subuser){
            if(res.locals.add_edit_own_permission == true){
                if(req.params.userId == req.session.subuser){
                    User.findOne({company:req.session.company,_id:req.params.userId}).exec(function(err,user){
                        if(err){
                            res.send(err);
                        }else{
                            if(req.body.password == undefined){
                                User.findOneAndUpdate({company:req.session.company,_id:req.params.userId},req.body,{new: true,runValidators: true, context: 'query' },function(err,updated_user){
                                    if(err)
                                        res.send(err)
                                    res.json(updated_user);    
                                });      
                            }else{
                                req.body.password = bcrypt.hashSync(req.body.password, 8);
                                User.findOneAndUpdate({company:req.session.company,_id:req.params.userId},req.body,{new: true,runValidators: true, context: 'query' },function(err,updated_user){
                                    if(err)
                                        res.send(err)
                                    res.json(updated_user);    
                                });  
                            }
                        }
                    });
                }else{
                        res.json({message:"You cannot edit this User"});
                }
            }else{
                User.findOne({company:req.session.company,_id:req.params.userId}).exec(function(err,user){
                    if(err){
                        res.send(err);
                    }else{
                        if(req.body.password == undefined){
                            User.findOneAndUpdate({company:req.session.company,_id:req.params.userId},req.body,{new: true,runValidators: true, context: 'query' },function(err,updated_user){
                                if(err)
                                    res.send(err)
                                res.json(updated_user);    
                            });      
                        }else{
                            req.body.password = bcrypt.hashSync(req.body.password, 8);
                            User.findOneAndUpdate({company:req.session.company,_id:req.params.userId},req.body,{new: true,runValidators: true, context: 'query' },function(err,updated_user){
                                if(err)
                                    res.send(err)
                                res.json(updated_user);    
                            });  
                        }
                    }
                });
            }
        }else{
            User.findOne({company:req.session.company,_id:req.params.userId}).exec(function(err,user){
                if(err){
                    res.send(err);
                }else{
                    if(req.body.password == undefined){
                        User.findOneAndUpdate({company:req.session.company,_id:req.params.userId},req.body,{new: true,runValidators: true, context: 'query' },function(err,updated_user){
                            if(err)
                                res.send(err)
                            res.json(updated_user);    
                        });
                    }else{
                        req.body.password = bcrypt.hashSync(req.body.password, 8);    
                        User.findOneAndUpdate({company:req.session.company,_id:req.params.userId},req.body,{new: true,runValidators: true, context: 'query' },function(err,updated_user){
                            if(err)
                                res.send(err)
                            res.json(updated_user);    
                        });                    
                    }
                }

            });
            
        }
    }
    else{
        res.json({auth:false});
    }
};

//DELETE A USER(SUPER USER)
exports.delete_a_User = function(req,res){
    if(req.session.user || req.session.subuser){
        if(req.params.userId != req.session.subuser){
            User.findOneAndDelete({company:req.session.company,_id:req.params.userId},function(err,user){
                if(err)
                    res.send(err);
                res.json({message:"User Successfully Deleted"});  
            });
        }else{
            res.json({auth:false});
        }

        }
};

// LOGIN A USER

exports.login_a_User = function(req,res,next) {
    var username = req.body.user_name.toLowerCase();
    // console.log(username);
    User.findOne({ user_name : username}).populate('user_type').exec(function(err, user) {
        if(err) return res.status(500).send('Error on the server');
        if(user==null) return res.status(404).send('No user found');
        
        var passwordISValid = bcrypt.compareSync(req.body.password, user.password);
        if(!passwordISValid) return res.status(401).send({auth:false,message:"Wrong Password"});   
        req.session.subuser = user._id;
        req.session.company = user.company;
        req.session.user_type = user.user_type;
        req.session.user_name = user.personal_details.name;
        res.locals.user = user;
        req.session.user_permissions = user.user_permissions;
        req.session.user_additional_permissions = user.additional_permissions;
        req.session.user_approval_permissions = user.approval_permissions;
        if(user.user_group){
            if(user.onType == "Staff"){
                Staff.findOne({_id:user.user_type}).exec(function(err,staff){
                    req.session.user_designation = staff.designation;
                    req.session.user_permission = user.user_group;
                    next();
                });
            }else{
                req.session.user_permission = user.user_group;
                next();
            }
            
            // res.json(user);
        }
        else{
            console.log("User Group Not Found");
        }
    });
};

// LOGOUT

exports.logout_a_User = function(req, res) {
    req.session.destroy((err) => {
        if(err) {
            console.log(err);
        }
    res.status(200).send('Logout successful');
    });
};


//FETCH USER PERMISSION

exports.fetch_a_permission = function(req,res,next){
    UserGroups.findOne({company:req.session.company,_id:req.session.user_permission},function(err,permission){
        if(err)
            res.send(err);
        req.session.permissions = OverRide(req.session.user_permissions,permission.permissions); //Override
        req.session.additional_permissions = OverRide(req.session.user_additional_permissions,permission.additional_permissions);
        req.session.approval_permissions =  ObjectOverRide(req.session.user_approval_permissions,permission.approval_permissions);
        // console.log(req.session.approval_permissions);
        res.json({user:res.locals.user,permission:req.session.permissions,additional_permissions:req.session.additional_permissions});
    });
};


//PUSH USER PERMISSION

exports.push_a_permission = function(req,res,next){
    User.findOneAndUpdate({company:req.session.company,_id:req.params.userId},{$push:{user_permissions:{module_name:req.body.module_name,read:req.body.read,write:req.body.write,edit:req.body.edit,delete:req.body.delete}}},{new:true},function(err,permission){
        if(err)
            res.send(err);
        res.json(permission);    

    });
};