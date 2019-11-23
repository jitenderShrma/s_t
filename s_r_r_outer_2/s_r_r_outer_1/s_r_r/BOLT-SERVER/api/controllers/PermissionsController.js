'use strict';


var mongoose = require('mongoose');
var Permissions = mongoose.model('Permissions');



//CREATE A PERMISSION(SUPER USER)

exports.create_a_permission = function(req,res,next){
    Permissions.create({
        super_user: req.session.user,
        user_type : req.body.user_type,
        modules : req.body.modules,
    },
    function(err,permission){
        if(err)
            res.send(err);
         res.json(permission);   
    });
};


//GET ALL PERMISSIONS

exports.get_all_permissions = function(req,res){
    Permissions.find({super_user:req.session.user},function(err,permission){
        if(err)
            res.send(err);
         res.json(permission);   
        
    });

};

//GET A PERMISSION
exports.get_a_permission = function(req,res){
    Permissions.findOne({super_user:req.session.user,user_group:req.params.userType},function(err,permission){
        if(err)
            res.send(err);
        res.json(permission);    

    });
};

//EDIT A PERMISSION

exports.edit_a_permission = function(req,res){
    Permissions.findOneAndUpdate({super_user:req.session.user,_id:req.params.permissionId},req.body,{new: true, runValidators:true},function(err,permission){
        if(err)
            res.send(err);
        res.json(permission);
    });

};


// ADD A PERMISSION
exports.add_a_permission_module = function(req,res,next){
    Permissions.findOneAndUpdate({super_user:req.session.user,user_group:req.params.userType},{$push: {modules:{module_name:req.body.module_name,permission:req.body.permission}}},{new:true},function(err,permission){
        if(err)
            res.send(err);
        res.json(permission);    
    });

};


