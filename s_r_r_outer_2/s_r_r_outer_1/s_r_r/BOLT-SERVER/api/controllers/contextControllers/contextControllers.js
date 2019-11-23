var mongoose = require('mongoose');
var ContextModel = mongoose.model('Context');


//CREATE A CONTEXT
exports.create_a_context = function(req,res,next){
    ContextModel.create({
        _id:req.body._id,
        context_name : req.body.context_name,
        short_codes : req.body.short_codes,
    },function(err,context){
        if(err)
             res.send(err);
        res.json(context);
    });
};

//READ ALL CONTEXT

exports.read_all_context = function(req,res,next){
    ContextModel.find({},function(err,context){
        if(err) 
            res.send(err);
        res.json(context);
    });
};

//READ A CONTEXT
exports.read_a_context = function(req,res,next){
    ContextModel.findOne({_id:req.params.contextId},function(err,context){
        if(err)
            res.send(err);
        res.json(context);    
    });
}; 

