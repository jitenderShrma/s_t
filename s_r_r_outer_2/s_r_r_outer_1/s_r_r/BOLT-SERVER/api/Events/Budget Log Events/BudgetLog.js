var events = require('events');
var eventEmitter = new events.EventEmitter();
var mongoose = require('mongoose');
var BudgetLog = mongoose.model('BudgetLog');


var initiateBudgetLog = function(company,head_id){
    BudgetLog.create({
        company:company,
        head_id:head_id,
        log:[{
            date:Date.now(),
            event:"Log Created"
        }]
    },function(err,BudgetLog){
        if(err){
            console.log(err);
        }else{
            console.log("Budget Log Created");
        }
    });
};

var updateBudgetLog = function(head_id,event){
    BudgetLog.findOneAndUpdate({head_id:head_id},{$push:{log:{date:Date.now(),event:event}}},{new:true}).exec(function(err,BudgetLog){
        if(err){
            console.log(err);
        }else{
            console.log("budget log updated");

        }
    });
};


eventEmitter.on('Initiate',initiateBudgetLog);
eventEmitter.on('UpdateLog',updateBudgetLog);


module.exports = eventEmitter;


