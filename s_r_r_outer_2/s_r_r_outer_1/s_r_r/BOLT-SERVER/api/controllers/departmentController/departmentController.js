'use strict';

var mongoose = require('mongoose');
var Department = mongoose.model('Department');
var Designation = mongoose.model('Designation');



//CREATE DEPARTMENT
exports.create_a_department = function(req,res,next){
    var left,right;
    var treeid;
    Department.findOne({_id:req.body.parent_department}).exec(function(err,parentdepartment) {
        if(parentdepartment!=null) {
            left=parentdepartment.rgt;
            right=parentdepartment.rgt+1;
            treeid = parentdepartment.tree_id;
            Department.updateMany({tree_id:parentdepartment.tree_id,lft:{$gt:parentdepartment.rgt}},{$inc:{lft:2}}).exec(function(err,querylft) {
                    Department.updateMany({tree_id:parentdepartment.tree_id,rgt:{$gte:parentdepartment.rgt}},{$inc:{rgt:2}}).exec(function(err,queryrgt) {
                            Department.create({
                            company : req.session.company,
                            department_name : req.body.department_name,
                            designation:req.body.designation,
                            heads:req.body.heads,
                            parent_department:req.body.parent_department,
                            labels : req.body.labels,
                            lft:left,
                            rgt:right,
                            tree_id:treeid
                            },function(err,department) {
                                if(err){
                                    res.send(err);
                                }else{
                                    res.json(department);
                                }
                            });
                        });
                    });
        }
        else {
            treeid = req.body.department_name;
            Department.create({
                company : req.session.company,
                department_name : req.body.department_name,
                designation:req.body.designation,
                heads:req.body.heads,
                parent_department:req.body.parent_department,
                labels : req.body.labels,
                lft:left,
                rgt:right,
                tree_id:treeid
                },function(err,department) {
                    if(err){
                        res.send(err);
                    }else{
                        res.json(department);
                    }
            });
        }
    });
};


//FIND ALL DEPARTMENTS

exports.find_a_department = function(req,res,next){
    Department.findOne({company:req.session.company,_id:req.params.deptId}).exec(function(err,department){
        res.json(department);
    });
};


//UPDATE DEPARTMENT
exports.update_a_department = function(req,res,next){
    Department.findOne({_id:req.params.deptId,company:req.session.company}).exec(function(err,department){
        if(err){
            console.log(err);
        }else{
            if(req.body.parent_department == null && department.lft == 0){
                Department.findOneAndUpdate({_id:req.params.deptId,company:req.session.company},req.body,{new: true, runValidators:true},function(err,dept){
                    if(err){
                        res.send(err);
                    }else{
                        res.json(dept);    
                    }
                });
            }else if(req.body.parent_department == null && department.lft !=0){
                var width = department.rgt-department.lft+1;
                var bound = department.rgt;
                Department.updateMany({tree_id:department.tree_id,lft:{$gt:bound}},{$inc:{lft:-width}}).exec(function(err,querylft){
                    Department.updateMany({tree_id:department.tree_id,rgt:{$gt:bound}},{$inc:{rgt:-width}}).exec(function(err,queryrgt) {
                        Department.updateMany({tree_id:department.tree_id,lft:{$gte:department.lft},rgt:{$lte:department.rgt}},{$inc:{lft:-department.lft,rgt:-department.lft},tree_id:department.department_name}).exec(function(err,updateddept){
                            Department.findOneAndUpdate({company:req.session.company,_id:req.params.deptId},{parent_department:null,department_name:req.body.department_name},{new:true}).exec(function(err,updated){
                                console.log("department got independent");
                                res.json({message:"department got independent"});
                            });

                        });
                    });
                });

            }else if(req.body.parent_department == department.parent_department){
                Department.findOneAndUpdate({company:req.session.company,_id:req.params.deptId},req.body,{new:true}).exec(function(err,dept){
                    if(err){
                        console.log(err);
                    }else{
                        res.json(dept);
                    }
                });
            }else if(req.body.parent_department != department.parent_department){
                var width = department.rgt-department.lft+1;
                var bound = department.rgt;
                Department.updateMany({tree_id:department.tree_id,lft:{$gt:bound}},{$inc:{lft:-width}}).exec(function(err,querylft) {
                    Department.updateMany({tree_id:department.tree_id,rgt:{$gt:bound}},{$inc:{rgt:-width}}).exec(function(err,queryrgt) {
                         Department.findOne({_id:req.body.parent_department}).exec(function(err,parent){
                            var left = parent.rgt;
                            var right = parent.rgt+1;
                            var tree_id = parent.tree_id;
                            Department.updateMany({tree_id:parent.tree_id,lft:{$gt:parent.rgt}},{$inc:{lft:width}}).exec(function(err,left_update){
                                Department.updateMany({tree_id:parent.tree_id,rgt:{$gte:parent.rgt}},{$inc:{rgt:width}}).exec(function(err,right_update){
                                    Department.updateMany({tree_id:department.tree_id,lft:{$gte:department.lft},rgt:{$lte:department.rgt}},{$inc:{lft:parent.rgt-department.lft,rgt:parent.rgt-department.lft},tree_id:tree_id}).exec(function(err,finalupdate){
                                        Department.findOneAndUpdate({company:req.session.company,_id:req.params.deptId},{parent_department:req.body.parent_department,name:req.body.department_name},{new:true}).exec(function(err,updatedfinal){
                                            console.log("updated");
                                            res.json({message:"updated"});
                                        });
                                    });

                                });
                            });
                         });
                    });

                });


            }

        }

    });
};

//READ DEPARTMENT
exports.read_all_departments = function(req,res,next){
    if(req.session.user){
        Department.find({company:req.session.company}).populate('labels').exec(function(err,departments) {
            if(err) res.send(err);
            res.json(departments);
        });
    }else if(req.session.subuser){
        if(res.locals.add_read_all_permission == true){
            Department.find({company:req.session.company}).populate('labels').exec(function(err,departments) {
                if(err) res.send(err);
                res.json(departments);
            });
        }else{
            Designation.findOne({_id:req.session.user_designation}).exec(function(err,designation){
                if(err){
                    res.send(err);
                }else{
                    Department.findOne({_id:designation.department}).exec(function(err,dept){
                        Department.find({tree_id:dept.tree_id,lft:{$gte:dept.lft},rgt:{$lte:dept.rgt}}).exec(function(err,departments){
                            res.json(departments);

                        });
                    });
                }

            });
        }
    }
    
};



//DELETE DEPARTMENT
exports.delete_a_department = function(req,res,next){
    if(req.session.user){
        Department.findOne({company : req.session.company,_id:req.params.deptId}).exec(function(err,department){
            var width = department.rgt-department.lft+1;
            var bound = department.rgt;
            Department.deleteMany({tree_id:department.tree_id,lft:{$gte:department.lft},rgt:{$lte:department.rgt}}).exec(function(err,deleteElem) {
                Department.updateMany({tree_id:department.tree_id,lft:{$gt:bound}},{$inc:{lft:-width}}).exec(function(err,querylft) {
                    Department.updateMany({tree_id:department.tree_id,rgt:{$gt:bound}},{$inc:{rgt:-width}}).exec(function(err,queryrgt) {
                        res.json({deleted:deleteElem,lftupdate:queryrgt,rgtupdate:querylft});
                    });
                });
            });
        });

    }else if(req.session.subuser){
        res.send({message:"Access Denied"});        
    }
};

//ADD A LABEL

exports.add_a_label = function(req,res,next)  {
    Department.findOneAndUpdate({company:req.session.company,_id:req.params.deptId},{$push: {labels:req.body.labels}},{new:true},function(err,usergroup) {
        if(err) res.send(err);
        res.json(usergroup);
    });
};

// REMOVE A LABEL

exports.remove_a_label = function(req,res,next) {
    Department.findOneAndUpdate({company:req.session.company,_id:req.params.deptId},{$pull: {labels:req.body.labels}},{new:true},function(err,usergroup) {
        if(err) res.send(err);
        res.json(usergroup);
    });
};

// GET ALL CHILDREN
exports.get_child_dept = function(req,res,next) {
        Department.find({company:req.session.company,parent_department:req.params.deptId}).exec(function(err,departments) {
            if(err)
                res.send(err)
            else
                res.json(departments)
        });
};


//DEPARTMENT FIX
// exports.fix_all_departments = function(req,res,next){
//      Department.updateMany({},{company:"5d30314365f3692e1a3b9d7b"},{new:true}).exec(function(err,department){
//         if(err){
//             console.log(err);
//         }else{
//             res.json(department);
//         }
//     });
// };

// //INDEX FIX

// exports.fix_all_index = function(req,res,next){
//     Department.collection.dropIndexes(function(err,result){
//         res.json(result);
//     });
// }
