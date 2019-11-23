'use strict';

var mongoose = require('mongoose');
var Tasks = mongoose.model('Tasks');
var eventEmitter = require('../../coms/coms_extensions');



// CREATE A TASK
exports.create_a_task = function(req,res,next){

    Tasks.create({
        assigned_to:req.body.assigned_to,
        assigned_by:req.session.user,
        alert_by: req.session.alert_by,
        task_context:req.body.task_context,
        labels : req.body.labels
    },
    function(err,task){
        if(err)
            res.send(err);
         res.json(task); 
    });
};


// VIEW A TASK
exports.view_a_task = function(req,res,next){
    Tasks.find({assigned_by:req.session.user},function(err,task){
        if(err)
            res.send(err);
        res.json(task);   
        eventEmitter.emit('mailSMTP');
        eventEmitter.emit('mailAPI','prakharnegative@gmail.com');
        // eventEmitter.emit('sendSMS',9818311267);

    });
};