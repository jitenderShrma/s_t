'use strict';


var mongoose = require('mongoose');
var UserGroups = mongoose.model('UserGroup');



//CREATE A USER GROUP(SUPER USER)

exports.create_a_usergroup = function(req,res,next){
    UserGroups.findOne({_id:req.body.parent_group}).exec(function(err,group){
        if(err){
            res.send(err);
        }
        if(group == null){
            UserGroups.create({
                company: req.session.company,
                user_type:req.body.user_type,
                user_group_name:req.body.user_group_name,
                permissions : req.body.permissions,
                labels : req.body.labels,
                additional_permissions: req.body.additional_permissions,
                approval_permissions:{
                    by_department:{
                        status:req.body.by_department_status
                    },
                    by_heads:{
                        status:req.body.by_heads_status,
                        allowed_heads:req.body.allowed_heads
                    }
                }
            },
            function(err,usergroup){
                usergroup.setNext('tree_id',function(err,usergroup2){
                    if(err){
                        res.send(err);
                    }else{
                        res.json(usergroup2);
                    }

                }); 
            });

        }else if(group){
            var left,right,treeId;
            left = group.rgt;
            right = group.rgt+1;
            treeId = group.tree_id;
            UserGroups.updateMany({tree_id:group.tree_id,lft:{$gt:group.rgt}},{$inc:{lft:2}}).exec(function(err,updatelft){
                UserGroups.updateMany({tree_id:group.tree_id,rgt:{$gte:group.rgt}},{$inc:{rgt:2}}).exec(function(err,updatergt){
                    UserGroups.create({
                        company:req.session.company,
                        user_type:req.body.user_type,
                        user_group_name:req.body.user_group_name,
                        permissions:req.body.permissions,
                        parent_group:req.body.parent_group,
                        lft:left,
                        rgt:right,
                        tree_id:treeId
                    },function(err,sub_group){
                        if(err)
                            res.send(err);
                        res.json(sub_group);    
                    });

                });
            });
        }

    });
};


//DELETE A SUBGROUP

exports.delete_a_subgroup = function(req,res,next){
    UserGroups.findOne({company:req.session.company,_id:req.params.groupId}).exec(function(err,group){
        var width = group.rgt-group.lft+1;
        var bound = group.rgt;
        UserGroups.deleteMany({tree_id:group.tree_id,lft:{$gte:group.lft},rgt:{$lte:group.rgt}}).exec(function(err,deleteElm){
            UserGroups.updateMany({tree_id:group.tree_id,lft:{$gt:bound}},{$inc:{lft:-width}}).exec(function(err,querylft){
                UserGroups.updateMany({tree_id:group.tree_id,rgt:{$gt:bound}},{$inc:{rgt:-width}}).exec(function(err,queryrgt){
                    res.json({deleted:deleteElm,lftupdate:queryrgt,rgtupdate:querylft});

                });

            });

        });

    });
};

//FIND ALL GROUPS

exports.get_all_groups = function(req,res,next){
    UserGroups.find({company:req.session.company,user_type:{$ne:"Staff"}}).populate('labels').exec(function(err,usergroup){
        if(err)
            res.send(err);
        res.json(usergroup);   
    });
};

//GET A usergroup

exports.get_a_usergroup = function(req,res,next){
    UserGroups.findOne({company:req.session.company,_id:req.params.usergroupId},function(err,usergroup){
        if(err)
            res.send(err);
        res.json(usergroup);
    });
};

//EDIT A usergroup

exports.edit_a_usergroup = function(req,res){
    UserGroups.findOneAndUpdate({company:req.session.company,_id:req.params.usergroupId},req.body,{new: true, runValidators:true},function(err,usergroup){
        if(err)
            res.send(err);
        res.json(usergroup);
    });

};


// ADD A usergroup

exports.add_a_usergroup_module = function(req,res,next){
    UserGroups.findOneAndUpdate({super_user:req.session.user,user_group:req.params.userGroup},{$push: {modules:{module_name:req.body.module_name,usergroup:req.body.usergroup}}},{new:true},function(err,usergroup){
        if(err)
            res.send(err);
        res.json(usergroup);    
    });
};

//ADD A SUBGROUP

exports.add_a_subgroup = function(req,res,next)  {
    UserGroups.findOneAndUpdate({company:req.session.company,_id:req.params.userGroup},{$push: {sub_groups:req.body.sub_groups}},{new:true},function(err,usergroup) {
        if(err) res.send(err);
        res.json(usergroup);
    });
}

// REMOVE A SUBGROUP

exports.remove_a_subgroup = function(req,res,next) {
    UserGroups.findOneAndUpdate({company:req.session.company,_id:req.params.userGroup},{$pull: {sub_groups:req.body.sub_groups}},{new:true},function(err,usergroup) {
        if(err) res.send(err);
        res.json(usergroup);
    })
};



//ADD A LABEL

exports.add_a_label = function(req,res,next)  {
    UserGroups.findOneAndUpdate({company:req.session.company,_id:req.params.userGroup},{$push: {labels:req.body.labels}},{new:true},function(err,usergroup) {
        if(err) res.send(err);
        res.json(usergroup);
    });
};

// REMOVE A LABEL

exports.remove_a_label = function(req,res,next) {
    UserGroups.findOneAndUpdate({company:req.session.company,_id:req.params.userGroup},{$pull: {labels:req.body.labels}},{new:true},function(err,usergroup) {
        if(err) res.send(err);
        res.json(usergroup);
    })
};
// exports.fetch_all_usergroups = function(req,res,next){
//     UserGroups.find({company:req.session.company}).populate('parent_group').exec(function(err,groups){
//         if(err)
//             res.send(err);
//         res.json(groups);    

//     });

// };


exports.fetch_something = function(req,res,next){
    UserGroups.findOne({company:req.session.company,user_group_name:req.params.name}).exec(function(err,user_group){
        if(err)
            res.send(err);
         res.json(user_group);   

    });
};

exports.edit_staff = function(req,res,next){
    UserGroups.findOneAndUpdate({company:req.session.company,user_group_name:req.params.name},req.body,{new:true}).exec(function(err,user_group){
        if(err)
            res.send(err);
         res.json(user_group);   

    });
};


