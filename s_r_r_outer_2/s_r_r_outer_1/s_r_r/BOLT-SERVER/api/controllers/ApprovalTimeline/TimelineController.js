'use strict';
var mongoose = require('mongoose');
var Timeline = mongoose.model('Timeline');
// view a timeline 
exports.view_a_timeline = function(req,res,next){
    Timeline.findOne({company:req.session.company,approval_id:req.params.approvalId}).populate({path:'approval_id',populate:{path:'level1approved.by level2approved.by level3approved.by level4approved.by level5approved.by rejected_by'}}).exec(function(err,timeline){
        if(err){
            res.send(err);
        }else{
            res.json(timeline);
        }
    });
};


