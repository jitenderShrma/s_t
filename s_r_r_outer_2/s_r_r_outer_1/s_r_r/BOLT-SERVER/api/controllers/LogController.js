'use strict';

var mongoose = require('mongoose');
var Log = mongoose.model('Log');




exports.view_a_log = function(req,res){

    Log.find({},function(err,log){
        if(err)
            res.send(err);
         res.json(log);   
    });

};