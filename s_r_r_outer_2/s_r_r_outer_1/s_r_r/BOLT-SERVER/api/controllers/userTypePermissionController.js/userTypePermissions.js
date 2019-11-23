'use strict';
var mongoose = require('mongoose');
var TypePermissions = mongoose.model('TypePermissions');


//CREATE A PERMISSION TYPE

exports.create_a_permission  = function(req,res,next){
    TypePermissions.create({
        company:req.session.company,
        user_type:req.body.user_type,
        permissions:req.body.permissions,
        sub_groups: req.body.sub_groups,
        labels : req.body.labels
    },function(err,permission){
            if(err)
                res.send(err);
            res.json(permission);  
        });
    };

//VIEW ALL PERMISSIONS

exports.view_all_permissions = function(req,res,next){
    TypePermissions.find({company:req.session.company},function(err,permission){
        if(err)
            res.send(err);
         res.json(permission);   
    });
};


//VIEW A PERMISSION
exports.view_a_permission = function(req,res,next){
    TypePermissions.findOne({company:req.session.company,user_type:req.params.userType},function(err,permission){
        if(err)
            res.send(err);
         res.json(permission);   
    });
};

//UPDATE A PERMISSION

exports.update_a_permission = function(req,res,next){

    TypePermissions.findOneAndUpdate({company:req.session.company,user_type:req.params.userType},req.body,{new:true},function(err,permission){
        if(err)
            res.send(err);
         res.json(permission);   
    });
};


//PUSH A PERMISSION

exports.push_a_permission = function(req,res,next){
    TypePermissions.findOneAndUpdate({company:req.session.company,user_type:req.params.userType},{$push:{permissions:{module_name:req.body.module_name,read:req.body.read,write:req.body.write,edit:req.body.edit,delete:req.body.delete}}},{new:true},function(err,permission){
        if(err)
            res.send(err);
        res.json(permission);    

    });
};


//POP A PERMISSION

exports.pop_a_permission = function(req,res,next){
    TypePermissions.findOneAndUpdate({company:req.session.company,user_type:req.params.userType},{$pull:{permissions:{_id:req.body._id}}},{new:true},function(err,permission){
        if(err)
            res.send(err);
        res.json(permission);    

    });
};

//PUSH A SUBGROUP

exports.push_a_subgroup = function(req,res,next){
    TypePermissions.findOneAndUpdate({company:req.session.company,user_type:req.params.userType},{$push:{sub_groups:req.body.sub_groups}},{new:true},function(err,permission){
        if(err)
            res.send(err);
        res.json(permission);    

    });
};


//POP A SUBGROUP

exports.pop_a_subgroup = function(req,res,next){
    TypePermissions.findOneAndUpdate({company:req.session.company,user_type:req.params.userType},{$pull:{sub_groups:req.body.sub_groups}},{new:true},function(err,permission){
        if(err)
            res.send(err);
        res.json(permission);    

    });
};

//GET ALL USERTYPES WITH POPULATED FIELDS sub_groups & labels

exports.get_all_usertypes = function(req,res,next)  {
    TypePermissions.find({company:req.session.company}).populate({path:'sub_groups labels',populate:{path:'sub_groups labels',populate:{path:'sub_groups labels',populate:{path:'sub_groups labels',populate:{path:'sub_groups labels',populate:{path:'sub_groups labels',populate:{path:'sub_groups labels',populate:{path:'sub_groups labels',populate:{path:'sub_groups labels',populate:{path:'sub_groups labels'}}}}}}}}}}).exec(function(err,usertypes) {
        if(err)
            res.send(err);
        res.json(usertypes);
    });
}

//PUSH A LABEL

exports.push_a_label = function(req,res,next) {
    TypePermissions.findOneAndUpdate({company:req.session.company,user_type:req.params.userType},{$push:{labels:req.body.labels}},{new:true},function(err,usertypes) {
        if(err)
            res.send(err)
        res.json(usertypes) 
    });
}

//POP A LABEL

exports.pop_a_label = function(req,res,next) {
    TypePermissions.findOneAndUpdate({company:req.session.company,user_type:req.params.userType},{$pull:{labels:req.body.labels}},{new:true},function(err,usertypes) {
        if(err)
            res.send(err)
        res.json(usertypes)
    });
}
