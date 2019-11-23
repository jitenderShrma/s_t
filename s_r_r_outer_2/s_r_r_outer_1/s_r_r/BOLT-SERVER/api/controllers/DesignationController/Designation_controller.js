'use strict';
var mongoose = require('mongoose');
var Designation = mongoose.model('Designation');
var Department = mongoose.model('Department');
var counters = mongoose.model('counter');
// *************************************************************************


//COUNTERS
exports.get_all_counters = function(req,res,next){
    counters.findOne({id:"designation_tree_id"},function(err,counter){
        if(err){
            
        }else{
            res.json(counter);
        }

    });

}

//CREATE A DESIGNATION
exports.create_a_designation = function(req,res,next){
    console.log(req.connection.remoteAddress);
    var left,right,treeId,node;
    Designation.findOne({_id:req.body.parent_designation_id}).exec(function(err,parent){
        if(err){
            res.send(err);
        }
        if(parent == null){
            Designation.create({
                company:req.session.company,
                name:req.body.name,
                department:req.body.department

            },function(err,designation){
                if(err){
                    res.send(err);
                }else{
                    designation.setNext('designation_tree_id',function(err,designation2){
                        if(err){
                            res.send(err);
                        }else{
                            res.json(designation2);
                        }

                    });
                }

            });
        }else{

            left = parent.rgt;
            right = parent.rgt+1;
            Designation.updateMany({designation_tree_id:parent.designation_tree_id,lft:{$gt:parent.rgt}},{$inc:{lft:2}}).exec(function(err,left_update){
                Designation.updateMany({designation_tree_id:parent.designation_tree_id,rgt:{$gte:parent.rgt}},{$inc:{rgt:2}}).exec(function(err,right_update){
                    node = [{
                        company:req.session.company,
                        designation_tree_id: parent.designation_tree_id,
                        name:req.body.name,
                        parent_designation_id:req.body.parent_designation_id,
                        lft:left,
                        rgt:right,
                        department:parent.department || req.body.department
                    }];
                    Designation.insertMany(node,function(err,node){
                        res.send(node);
                    });
                });
            });
        }
    });
};

//READ A DESIGNATION
exports.read_a_designation = function(req,res,next){
    Designation.findOne({company : req.session.company,_id:req.params.desigId}).populate('labels').exec(function(err,designation){
        res.json(designation);    
    });
};

//READ ALL DESIGNATIONS
exports.read_all_designations = function(req,res,next){
    if(req.session.user){
        Designation.find({company : req.session.company}).populate('labels department').exec(function(err,designations){
            if(err)
                res.send(err);
            res.json(designations);    
        });
    }else if(req.session.subuser){
        if(res.locals.add_read_all_permission == true){
            Designation.find({company:req.session.company}).populate('labels department').exec(function(err,designations){
                if(err)
                    res.send(err);
                res.json(designations);    
            });
        }else{
            Designation.findOne({_id:req.session.user_designation}).exec(function(err,designations){
                if(designations){
                    Designation.find({company:req.session.company,department:designations.department}).populate('labels department').exec(function(err,designations2){
                        if(err){
                            res.send(err);  
                        }else{
                            res.json(designations2);
                        }

                    });
                }
            });
        }

    }


    //OLD CODE BUT WORKING
    // Designation.find({company : req.session.company}).populate('labels').exec(function(err,designations){
    //     if(err)
    //         res.send(err);
    //     res.json(designations);    
    // });
   
};

// Get designation count for a Department

exports.get_dept_designation_count = function(req,res,next) {
    var final_desig = []
    Department.findOne({company:req.session.company,_id:req.params.deptId}).exec(function(err,department) {
        Department.find({company:req.session.company,tree_id:department.tree_id,lft:{$gte:department.lft},rgt:{$lte:department.rgt}}).exec(function(err,departments) {
            if(err)
                res.send(err)
            else {
                // console.log(departments)
                function AsyncLoop(i,cb) {
                    if(i < departments.length) {
                        Designation.find({company:req.session.company,department:departments[i]}).exec(function(err,desigs) {
                            final_desig.push(desigs)
                            AsyncLoop(i+1,cb)
                        })
                    }
                    else {
                        cb();
                    }
                }
                AsyncLoop(0,function() {
                    var drop_desig = []
                    console.log("loop ends");
                    for(var i=0;i<final_desig.length;i++) {
                        for(var j=0;j<final_desig[i].length;j++) {
                            drop_desig.push(final_desig[i][j])
                        }
                    }
                    res.json(drop_desig.length)
                })
            }
        })
    })
}

//UPDATE A DESIGNATION
exports.update_a_designation = function(req,res,next){
    Designation.findOne({company:req.session.company,_id:req.params.desId}).exec(function(err,designation){
        if(req.body.parent_designation_id == null && designation.lft == 0){
            Designation.findOneAndUpdate({company:req.session.company,_id:req.params.desId},req.body,{new:true}).exec(function(err,updateddes){
        
            });
        }else if(req.body.parent_designation_id == null && designation.lft !=0){
            var current_sequence;
            counters.findOne({id:"designation_tree_id"}).exec(function(err,counter){
                if(err){
                    
                }else{
                    current_sequence = counter.seq;
                    counters.findOneAndUpdate({id:"designation_tree_id"},{$inc:{seq:1}}).exec(function(err,neweq){
                        console.log("sequence updated");
                    });
                }
            });
            var width = designation.rgt-designation.lft+1;
            var bound = designation.rgt;
            Designation.updateMany({designation_tree_id:designation.designation_tree_id,lft:{$gt:bound}},{$inc:{lft:-width}}).exec(function(err,querylft) {
                Designation.updateMany({designation_tree_id:designation.designation_tree_id,rgt:{$gt:bound}},{$inc:{rgt:-width}}).exec(function(err,queryrgt) {
                    Designation.updateMany({designation_tree_id:designation.designation_tree_id,lft:{$gte:designation.lft},rgt:{$lte:designation.rgt}},{$inc:{lft:-designation.lft,rgt:-designation.lft},designation_tree_id:current_sequence+1}).exec(function(err,updateddesig){
                            Designation.findOneAndUpdate({company:req.session.company,_id:req.params.desId},{parent_designation_id:null,department:req.body.department,name:req.body.name},{new:true}).exec(function(err,updated){
                                // res.json({deleted:deleteElem,lftupdate:queryrgt,rgtupdate:querylft});
                                console.log("designation got independent");
                        });
                    
                });
            });
        });
        }else if(req.body.parent_designation_id == designation.parent_designation_id){
            Designation.findOneAndUpdate({company:req.session.company,_id:req.params.desId},req.body,{new:true}).exec(function(err,updateddes){
            });
        }else if(req.body.parent_designation_id != designation.parent_designation_id){
            var width = designation.rgt-designation.lft+1;
            var bound = designation.rgt;
            Designation.updateMany({designation_tree_id:designation.designation_tree_id,lft:{$gt:bound}},{$inc:{lft:-width}}).exec(function(err,querylft) {
                Designation.updateMany({designation_tree_id:designation.designation_tree_id,rgt:{$gt:bound}},{$inc:{rgt:-width}}).exec(function(err,queryrgt) {
                    Designation.findOne({_id:req.body.parent_designation_id}).exec(function(err,parent){
                        var left = parent.rgt;
                        var right = parent.rgt+1;
                        var tree_id = parent.designation_tree_id;
                        Designation.updateMany({designation_tree_id:parent.designation_tree_id,lft:{$gt:parent.rgt}},{$inc:{lft:width}}).exec(function(err,left_update){
                            Designation.updateMany({designation_tree_id:parent.designation_tree_id,rgt:{$gte:parent.rgt}},{$inc:{rgt:width}}).exec(function(err,right_update){
                                Designation.updateMany({designation_tree_id:designation.designation_tree_id,lft:{$gte:designation.lft},rgt:{$lte:designation.rgt}},{$inc:{lft:parent.rgt-designation.lft,rgt:parent.rgt-designation.lft},designation_tree_id:tree_id}).exec(function(err,finalupdate){
                                    Designation.findOneAndUpdate({company:req.session.company,_id:req.params.desId},{parent_designation_id:req.body.parent_designation_id,department:req.body.department,name:req.body.name},{new:true}).exec(function(err,updatedfinal){
                                    console.log("updated");
                                });

                        });
    
                            });
                        });  
                    });
                });
            });
        }
        var new_department = req.body.department;
        if(new_department){
            Designation.updateMany({designation_tree_id:designation.designation_tree_id,lft:{$gte:designation.lft},rgt:{$lte:designation.rgt}},{department:new_department}).exec(function(err,updateElem) {
                res.json(updateElem)
            });
        }else{
            res.json(null);
        }
    });
};

//DELETE A DESIGNATION
exports.delete_a_designation = function(req,res,next){
    if(req.session.user){
        Designation.findOne({company : req.session.company,_id:req.params.desId}).exec(function(err,designation){
            var width = designation.rgt-designation.lft+1;
            var bound = designation.rgt;
            Designation.deleteMany({designation_tree_id:designation.designation_tree_id,lft:{$gte:designation.lft},rgt:{$lte:designation.rgt}}).exec(function(err,deleteElem) {
                Designation.updateMany({designation_tree_id:designation.designation_tree_id,lft:{$gt:bound}},{$inc:{lft:-width}}).exec(function(err,querylft) {
                    Designation.updateMany({designation_tree_id:designation.designation_tree_id,rgt:{$gt:bound}},{$inc:{rgt:-width}}).exec(function(err,queryrgt) {
                        res.json({deleted:deleteElem,lftupdate:queryrgt,rgtupdate:querylft});
                    });
                });
            });
        });
    }if(req.session.subuser){
        res.send({message:"Access Denied"});        
        // if(res.locals.add_delete_own_permission == true && req.params.desId == req.session.user_designation){
        //     Designation.findOne({company : req.session.company,_id:req.params.desId}).exec(function(err,designation){
        //         var width = designation.rgt-designation.lft+1;
        //         var bound = designation.rgt;
        //         Designation.deleteMany({designation_tree_id:designation.designation_tree_id,lft:{$gte:designation.lft},rgt:{$lte:designation.rgt}}).exec(function(err,deleteElem) {
        //             Designation.updateMany({designation_tree_id:designation.designation_tree_id,lft:{$gt:bound}},{$inc:{lft:-width}}).exec(function(err,querylft) {
        //                 Designation.updateMany({designation_tree_id:designation.designation_tree_id,rgt:{$gt:bound}},{$inc:{rgt:-width}}).exec(function(err,queryrgt) {
        //                     res.json({deleted:deleteElem,lftupdate:queryrgt,rgtupdate:querylft});
        //                 });
        //             });
        //         });
        //     });
        // }
        // if(res.locals.add_delete_own_permission == false){
        //     Designation.findOne({company : req.session.company,_id:req.params.desId}).exec(function(err,designation){
        //         var width = designation.rgt-designation.lft+1;
        //         var bound = designation.rgt;
        //         Designation.deleteMany({designation_tree_id:designation.designation_tree_id,lft:{$gte:designation.lft},rgt:{$lte:designation.rgt}}).exec(function(err,deleteElem) {
        //             Designation.updateMany({designation_tree_id:designation.designation_tree_id,lft:{$gt:bound}},{$inc:{lft:-width}}).exec(function(err,querylft) {
        //                 Designation.updateMany({designation_tree_id:designation.designation_tree_id,rgt:{$gt:bound}},{$inc:{rgt:-width}}).exec(function(err,queryrgt) {
        //                     res.json({deleted:deleteElem,lftupdate:queryrgt,rgtupdate:querylft});
        //                 });
        //             });
        //         });
        //     });

        // }else{
        //     console.log("Access Denied");
        //     res.json({message:"You Cannot delete this designation"});
        // }
    }
};


exports.get_dept_designation = function(req,res,next) {
    Designation.find({company:req.session.company,department:req.params.deptId}).populate('labels').exec(function(err,designations) {
        res.json(designations)
    });
}

// PUSH A LABEL
exports.push_desig_label = function(req,res,next) {
    Designation.findOneAndUpdate({company:req.session.company,_id:req.params.desigId},{$push:{labels:req.body.labels}},{new:true}).exec(function(err,designation){
        if(err)
            res.send(err)
        res.json(designation)
    });
}; 

// POP A LABEL
exports.pop_desig_label = function(req,res,next) {
    Designation.findOneAndUpdate({company:req.session.company,_id:req.params.desigId},{$pull:{labels:req.body.labels}},{new:true}).exec(function(err,designation){
        if(err)
            res.send(err)
        res.json(designation)
    });
};


exports.get_dept_desig_only = function(req,res,next) {
    var final_designation = []
    Department.findOne({company:req.session.company,_id:req.params.deptId}).exec(function(err,department) {
        if(department){
            Department.find({company:req.session.company,tree_id:department.tree_id,lft:{$gte:department.lft},rgt:{$lte:department.rgt}}).exec(function(err,departments) {
                if(err)
                    res.send(err)
                else {
                    // console.log(departments)
                    function AsyncLoop(i,cb) {
                        if(i < departments.length) {
                            Designation.find({company:req.session.company,department:departments[i]}).populate('department labels').exec(function(err,designation) {
                                final_designation.push(designation)
                                AsyncLoop(i+1,cb)
                            })
                        }
                        else {
                            cb();
                        }
                    }
                    AsyncLoop(0,function() {
                        var drop_desig = []
                        console.log("loop ends");
                        for(var i=0;i<final_designation.length;i++) {
                            for(var j=0;j<final_designation[i].length;j++) {
                                drop_desig.push(final_designation[i][j])
                            }
                        }
                        res.json(drop_desig)
                    });
                }
            });

        }else{
            res.json({message:"Department not found"});
        }
    });
};