var mongoose = require('mongoose');
var BudgetLog = mongoose.model('BudgetLog');

var logEmitter = require('../Events/Budget Log Events/BudgetLog');

function AddBudgetLog(req,res,next){
    var head_id = res.locals.head_id;
    var company = req.session.company;
    var event = res.locals.event;
    BudgetLog.findOne({head_id:head_id}).exec(function(err,BudgetLog){
        if(err){
            console.log(err);
        }else{
            if(BudgetLog){
                // update existing Log
                logEmitter.emit('UpdateLog',BudgetLog.head_id,event);

            }else{
                // create a new log
                logEmitter.emit('Initiate',company,head_id);
                logEmitter.emit('UpdateLog',head_id,event);

            }
        }

    });
}

module.exports = AddBudgetLog;
