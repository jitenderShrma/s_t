'use strict';
var mongoose = require('mongoose');
var Plugins = mongoose.model('Plugins');


//Release a Plugin
exports.release_a_plugin = function(req,res,next){
    Plugins.create({
        plugin_name:req.body.plugin_name,
        icon_class:req.body.icon_class,
        plugin_color:req.body.plugin_color,
        plugin_description:req.body.plugin_description,
        global_plugin:req.body.global_plugin,
        labels : req.body.labels
    },
    function(err,plugin){
        if(err)
            res.send(err);
        res.json(plugin);    
    });
};

//SEE Available PLugin
exports.see_available_plugins = function(req,res,next){
    Plugins.find({},function(err,plugin){
        if(err)
            res.send(err);
         res.json(plugin);   
    });
};