'use strict';

var mongoose = require('mongoose');
var Heads = mongoose.model('Heads');
var Department = mongoose.model('Department');
var Designation = mongoose.model('Designation');


 //CREATE A HEAD

 exports.create_a_head = function(req,res,next){
    var left,right;
    var treeid;
        Heads.findOne({_id:req.body.parent_head}).exec(function(err,parenthead) {
            if(parenthead!=null) {
                left = parenthead.rgt;
                right = parenthead.rgt+1;
                treeid= parenthead.tree_id;
                Heads.updateMany({tree_id:parenthead.tree_id,lft:{$gt:parenthead.rgt}},{$inc:{lft:2}}).exec(function(err,querylft) {
                    Heads.updateMany({tree_id:parenthead.tree_id,rgt:{$gte:parenthead.rgt}},{$inc:{rgt:2}}).exec(function(err,queryrgt) {
                            Heads.create({
                            company : req.session.company,
                            department : parenthead.department,
                            head_key:req.body.head_key,
                            accounting_head:req.body.accounting_head,
                            permissible_values:req.body.permissible_values,
                            name:req.body.name,
                            parent_head:req.body.parent_head,
                            labels : req.body.labels,
                            lft:left,
                            rgt:right,
                            tree_id:treeid,
                            notes:req.body.notes
                            },function(err,head) {
                                if(err)
                                    res.send(err)
                                res.json(head)
                            });
                        });
                    });
            }
            else {
                treeid = req.body.name;
                Heads.create({
                company : req.session.company,
                department : req.body.department,
                head_key:req.body.head_key,
                accounting_head:req.body.accounting_head,
                permissible_values:req.body.permissible_values,
                name:req.body.name,
                parent_head:req.body.parent_head,
                labels : req.body.labels,
                lft:left,
                rgt:right,
                tree_id:treeid,
                notes:req.body.notes
                },function(err,head){
                    if(err)
                        res.send(err)
                    res.json(head)
                });
                }
            
            
        });
};

 //READ HEADS

 exports.read_all_heads = function(req,res,next){
    if(req.session.user){
        Heads.find({company : req.session.company}).populate('labels department').exec(function(err,heads){
            if(err)
                res.send(err);
            res.json(heads);    
        });
    }else if(req.session.subuser){
        if(res.locals.add_read_all_permission == true){
            Heads.find({company : req.session.company}).populate('labels department').exec(function(err,heads){
                if(err)
                    res.send(err);
                res.json(heads);    
            });
        }else{
            Designation.findOne({_id:req.session.user_designation}).exec(function(err,desig){
                if(err){
                    res.send(err);
                }else{
                    Heads.find({company:req.session.company,department:desig.department}).populate('labels department').exec(function(err,heads){
                        if(err)
                            res.send(err);
                        res.json(heads);    
                    });
                }
            });
        }
    }
};


 exports.read_a_head = function(req,res,next){
    Heads.findOne({company : req.session.company,_id:req.params.headId}).exec(function(err,heads){
        if(err)
            res.send(err);
        res.json(heads);    
    });
};

// ******************************************************************
// HEAD UPDATE OVERRIDE

exports.update_head_values = function(req,res,next){
    var change_in_amount = req.body.updated_amount;
    Heads.findOneAndUpdate({company:req.session.company,_id:req.params.headId},req.body,{new:true}).exec(function(err,head){
        if(err){
            res.send(err);
        }else{
            res.locals.head_id = head._id;
            if(change_in_amount>0){
                res.locals.event = `Budget increased by ${change_in_amount}`;
            }else{
                res.locals.event = `Budget decreased by ${change_in_amount}`;
            }
            res.json(head);
            next();
        }
    });

};


// ******************************************************************
 //Update

 exports.update_a_head = function(req,res,next){
    Heads.findOne({company:req.session.company,_id:req.params.headId}).exec(function(err,head){
        if(req.body.parent_head == null && head.lft == 0){
            Heads.findOneAndUpdate({company:req.session.company,_id:req.params.headId},req.body,{new:true}).exec(function(err,updatedhead){
                res.json({message:"head got independent"});
            });
        }else if(req.body.parent_head == null && head.lft !=0){
            var width = head.rgt-head.lft+1;
            var bound = head.rgt;
            Heads.updateMany({tree_id:head.tree_id,lft:{$gt:bound}},{$inc:{lft:-width}}).exec(function(err,querylft) {
                Heads.updateMany({tree_id:head.tree_id,rgt:{$gt:bound}},{$inc:{rgt:-width}}).exec(function(err,queryrgt) {
                    Heads.updateMany({tree_id:head.tree_id,lft:{$gte:head.lft},rgt:{$lte:head.rgt}},{$inc:{lft:-head.lft,rgt:-head.lft},tree_id:head.name}).exec(function(err,updateddesig){
                            Heads.findOneAndUpdate({company:req.session.company,_id:req.params.headId},{parent_head:null,department:req.body.department,name:req.body.name},{new:true}).exec(function(err,updated){
                                res.json({message:"head got independent"});
                                console.log("head got independent");                                
                        });    
                });
            });
        });
        }else if(req.body.parent_head == head.parent_head){
            Heads.findOneAndUpdate({company:req.session.company,_id:req.params.headId},req.body,{new:true}).exec(function(err,updateddes){
                res.json({message:"head got independent"});
            });
        }else if(req.body.parent_head != head.parent_head){
            var width = head.rgt-head.lft+1;
            var bound = head.rgt;
            Heads.updateMany({tree_id:head.tree_id,lft:{$gt:bound}},{$inc:{lft:-width}}).exec(function(err,querylft) {
                Heads.updateMany({tree_id:head.tree_id,rgt:{$gt:bound}},{$inc:{rgt:-width}}).exec(function(err,queryrgt) {
                    Heads.findOne({_id:req.body.parent_head}).exec(function(err,parent){
                        var left = parent.rgt;
                        var right = parent.rgt+1;
                        var tree_id = parent.tree_id;
                        Heads.updateMany({tree_id:parent.tree_id,lft:{$gt:parent.rgt}},{$inc:{lft:width}}).exec(function(err,left_update){
                            Heads.updateMany({tree_id:parent.tree_id,rgt:{$gte:parent.rgt}},{$inc:{rgt:width}}).exec(function(err,right_update){
                                Heads.updateMany({tree_id:head.tree_id,lft:{$gte:head.lft},rgt:{$lte:head.rgt}},{$inc:{lft:parent.rgt-head.lft,rgt:parent.rgt-head.lft},tree_id:tree_id}).exec(function(err,finalupdate){
                                    Heads.findOneAndUpdate({company:req.session.company,_id:req.params.headId},{parent_head:req.body.parent_head,department:req.body.department,name:req.body.name},{new:true}).exec(function(err,updatedfinal){
                                    console.log("updated");
                                    res.json({message:"heads updated"});
                                });
                        });
                            });
                        });  
                    });
                });
            });
    }
});
};

//Get Head count for a Department

exports.get_dept_head_count = function(req,res,next) {
    var final_heads = []
    Department.findOne({company:req.session.company,_id:req.params.deptId}).exec(function(err,department) {
        Department.find({company:req.session.company,tree_id:department.tree_id,lft:{$gte:department.lft},rgt:{$lte:department.rgt}}).exec(function(err,departments) {
            if(err)
                res.send(err)
            else {
                // console.log(departments)
                function AsyncLoop(i,cb) {
                    if(i < departments.length) {
                        Heads.find({company:req.session.company,department:departments[i]}).exec(function(err,heads) {
                            final_heads.push(heads)
                            AsyncLoop(i+1,cb)
                        })
                    }
                    else {
                        cb();
                    }
                }
                AsyncLoop(0,function() {
                    var drop_head = []
                    console.log("loop ends");
                    for(var i=0;i<final_heads.length;i++) {
                        for(var j=0;j<final_heads[i].length;j++) {
                            drop_head.push(final_heads[i][j])
                        }
                    }
                    res.json(drop_head.length)
                })
            }
        })
    })
}

 //Delete

 exports.delete_a_head = function(req,res,next){
     if(req.session.user){
        Heads.findOne({company : req.session.company,head_key:req.params.headId}).exec(function(err,head){
            var width = head.rgt-head.lft+1;
            var bound = head.rgt;
            Heads.deleteMany({tree_id:head.tree_id,lft:{$gte:head.lft},rgt:{$lte:head.rgt}}).exec(function(err,deleteElem) {
                Heads.updateMany({tree_id:head.tree_id,lft:{$gt:bound}},{$inc:{lft:-width}}).exec(function(err,querylft) {
                    Heads.updateMany({tree_id:head.tree_id,rgt:{$gt:bound}},{$inc:{rgt:-width}}).exec(function(err,queryrgt) {
                        res.json({deleted:deleteElem,lftupdate:queryrgt,rgtupdate:querylft});
                    });
                });
            });
        });
     }else if(req.session.subuser){
        res.send({message:"Access Denied"});
     }
};

exports.get_dept_head = function(req,res,next) {
    var final_heads = []
    Department.findOne({company:req.session.company,_id:req.params.deptId}).exec(function(err,department) {
        Department.find({company:req.session.company,tree_id:department.tree_id,lft:{$lte:department.lft},rgt:{$gte:department.rgt}}).exec(function(err,departments) {
            if(err)
                res.send(err)
            else {
                function AsyncLoop(i,cb) {
                    if(i < departments.length) {
                        Heads.find({company:req.session.company,department:departments[i]}).exec(function(err,heads) {
                            final_heads.push(heads)
                            AsyncLoop(i+1,cb)
                        })
                    }
                    else {
                        cb();
                    }
                }
                AsyncLoop(0,function() {
                    var drop_head = []
                    console.log("loop ends");
                    for(var i=0;i<final_heads.length;i++) {
                        for(var j=0;j<final_heads[i].length;j++) {
                            drop_head.push(final_heads[i][j])
                        }
                    }
                    res.json(drop_head)
                })
            }
        })
    })
}

exports.get_dept_head_only = function(req,res,next) {
    var final_heads = []
    Department.findOne({company:req.session.company,_id:req.params.deptId}).exec(function(err,department) {
        Department.find({company:req.session.company,tree_id:department.tree_id,lft:{$gte:department.lft},rgt:{$lte:department.rgt}}).exec(function(err,departments) {
            if(err)
                res.send(err)
            else {
                // console.log(departments)
                function AsyncLoop(i,cb) {
                    if(i < departments.length) {
                        Heads.find({company:req.session.company,department:departments[i]}).populate('department labels').exec(function(err,heads) {
                            final_heads.push(heads)
                            AsyncLoop(i+1,cb);
                        })
                    }
                    else {
                        cb();
                    }
                }
                AsyncLoop(0,function() {
                    var drop_head = []
                    console.log("loop ends");
                    for(var i=0;i<final_heads.length;i++) {
                        for(var j=0;j<final_heads[i].length;j++) {
                            drop_head.push(final_heads[i][j])
                        }
                    }
                    res.json(drop_head)
                })
            }
        })
    })
}


exports.get_heads_quaterly = function(req,res,next){
    var arr = [];
    var json_data;
    Heads.find({company:req.session.company,lft:{$ne:0}}).exec(function(err,head){
        if(err){
            res.send(err);
        }else{
            for(var i = 0;i<head.length;i++){
                json_data = {
                    name:head[i].name,
                    tree_id:head[i].tree_id,
                    Q1:head[i].permissible_values[0],
                    Q2:head[i].permissible_values[1],
                    Q3:head[i].permissible_values[2],
                    Q4:head[i].permissible_values[3],
                    Year:head[i].year
                };
                arr.push(json_data);
                if(i == head.length-1){
                    res.send(arr);
                }
            }
        }

    });
};

exports.get_heads_monthly = function(req,res,next){
    var arr = [];
    var json_data;
    Heads.find({company:req.params.companyId,lft:{$ne:0}}).exec(function(err,head){
        if(err){
            res.send(err);
        }
        if(head.length <=0) {
            res.json([{
                    name:"No Records",
                    tree_id:"N/A",
                    Jan:0,
                    Feb:0,
                    Mar:0,
                    Apr:0,
                    May:0,
                    Jun:0,
                    Jul:0,
                    Aug:0,
                    Sep:0,
                    Oct:0,
                    Nov:0,
                    Dec:0,
                    Year:"N/A",
                    start_month:res.locals.bud_settings.fin_year_start_month
                }])                    
        }
        else{
            for(var i = 0;i<head.length;i++){
                json_data = {
                    name:head[i].name,
                    tree_id:head[i].tree_id,
                    Jan:head[i].permissible_values[0],
                    Feb:head[i].permissible_values[1],
                    Mar:head[i].permissible_values[2],
                    Apr:head[i].permissible_values[3],
                    May:head[i].permissible_values[4],
                    Jun:head[i].permissible_values[5],
                    Jul:head[i].permissible_values[6],
                    Aug:head[i].permissible_values[7],
                    Sep:head[i].permissible_values[8],
                    Oct:head[i].permissible_values[9],
                    Nov:head[i].permissible_values[10],
                    Dec:head[i].permissible_values[11],
                   	Year:head[i].year+"/"+(parseInt(head[i].year)+1),
                    start_month:res.locals.bud_settings.fin_year_start_month
                };
                arr.push(json_data);
                if(i == head.length-1){
                    res.send(arr);
                }
            }
        }

    });
};

exports.get_heads_monthly_left = function(req,res,next){
    var arr = [];
    var json_data;
    Heads.find({company:req.params.companyId,lft:{$ne:0}}).exec(function(err,head){
        if(err){
            res.send(err);
        }
        if(head.length <=0) {
            res.json([{
                    name:"No Records",
                    tree_id:"N/A",
                    Jan:0,
                    Feb:0,
                    Mar:0,
                    Apr:0,
                    May:0,
                    Jun:0,
                    Jul:0,
                    Aug:0,
                    Sep:0,
                    Oct:0,
                    Nov:0,
                    Dec:0,
                    Year:"N/A",
                    start_month:res.locals.bud_settings.fin_year_start_month
                }])                    
        }
        else{
            for(var i = 0;i<head.length;i++){
                json_data = {
                    name:head[i].name,
                    tree_id:head[i].tree_id,
                    Jan:head[i].amount_left[0],
                    Feb:head[i].amount_left[1],
                    Mar:head[i].amount_left[2],
                    Apr:head[i].amount_left[3],
                    May:head[i].amount_left[4],
                    Jun:head[i].amount_left[5],
                    Jul:head[i].amount_left[6],
                    Aug:head[i].amount_left[7],
                    Sep:head[i].amount_left[8],
                    Oct:head[i].amount_left[9],
                    Nov:head[i].amount_left[10],
                    Dec:head[i].amount_left[11],
                    Year:head[i].year+"/"+(parseInt(head[i].year)+1),
                    start_month:res.locals.bud_settings.fin_year_start_month
                };
                arr.push(json_data);
                if(i == head.length-1){
                    res.send(arr);
                }
            }
        }

    });
};

//ADD A LABEL

exports.add_a_label = function(req,res,next)  {
    Heads.findOneAndUpdate({company:req.session.company,_id:req.params.headId},{$push: {labels:req.body.labels}},{new:true},function(err,usergroup) {
        if(err) res.send(err);
        res.json(usergroup);
    });
};

// REMOVE A LABEL

exports.remove_a_label = function(req,res,next) {
    Heads.findOneAndUpdate({company:req.session.company,_id:req.params.headId},{$pull: {labels:req.body.labels}},{new:true},function(err,usergroup) {
        if(err) res.send(err);
        res.json(usergroup);
    })
};
