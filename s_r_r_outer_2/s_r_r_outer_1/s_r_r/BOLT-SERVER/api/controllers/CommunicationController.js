'use strict';
var mongoose = require('mongoose');
var Communication = mongoose.model('Communications');


//Install Path
 exports.install_a_com = function(req,res,next){

    Communication.create({
        super_user:req.session.user,
        module_name: req.body.module_name,
        global:req.body.global,
        labels : req.body.labels
    },
    function(err,comms){
        if(err)
            res.send(err);
        res.json(comms);
    });
 };


 // View a Com
 exports.view_a_com = function(req,res,next){
     Communication.find({super_user:req.session.user},function(err,comms){
         if(err)
            res.send(err);
         res.json(comms);   
     });
 };


 //Uninstall
 exports.uninstall_a_com = function(req,res,next){
        Communication.findOneAndDelete({super_user:req.session.user,module_name:req.params.moduleName},function(err,comms){
            if(err)
                res.send(err);
            res.json({message:"Com Uninstalled"});   
        });
 };
